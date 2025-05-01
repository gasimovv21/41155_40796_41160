import requests
import random
import string


from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from .models import (
    User, UserCurrencyAccount, Transaction, AccountHistory,
    DepositHistory)
from .serializers import UserCurrencyAccountSerializer, UserRegistrationSerializer
from django.db import transaction as db_transaction
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.hashers import make_password


def generate_temporary_password(length=14):
    chars = string.ascii_letters + string.digits + "-_"
    return ''.join(random.choice(chars) for _ in range(length))


def getUsersList(request):
    users = User.objects.all()
    serializer = UserRegistrationSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def getUserDetail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserRegistrationSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


def updateUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if "password" in data:
        data["password"] = make_password(data["password"])

    serializer = UserRegistrationSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def getCurrencyAccounts(request):
    accounts = UserCurrencyAccount.objects.all()
    serializer = UserCurrencyAccountSerializer(accounts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def createCurrencyAccount(request):
    serializer = UserCurrencyAccountSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"error": "Account with this currency already exists for this user."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def getCurrencyAccountDetail(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserCurrencyAccountSerializer(account)
    return Response(serializer.data, status=status.HTTP_200_OK)


def updateCurrencyAccount(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserCurrencyAccountSerializer(account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def deleteCurrencyAccount(request, pk):
    try:
        account = UserCurrencyAccount.objects.get(pk=pk)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "Currency account not found"}, status=status.HTTP_404_NOT_FOUND)

    if account.currency_code == 'PLN':
        return Response({"error": "Cannot delete the default PLN account."}, status=status.HTTP_400_BAD_REQUEST)

    if account.balance != 0.00:
        return Response({"error": "Cannot delete account with a non-zero balance."}, status=status.HTTP_400_BAD_REQUEST)

    account.delete()
    return Response({"message": "Currency account deleted successfully"}, status=status.HTTP_200_OK)


def getUserCurrencyAccounts(request, user_id):
    try:
        accounts = UserCurrencyAccount.objects.filter(user_id=user_id)
        if not accounts.exists():
            return Response({"error": "No accounts found for this user"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserCurrencyAccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


def get_exchange_rate(currency_code, rate_type):
    url = f"https://api.nbp.pl/api/exchangerates/rates/c/{currency_code}/?format=json"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        rate = data['rates'][0][rate_type]
        return Decimal(rate)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Failed to fetch exchange rate: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except KeyError:
        return Response({"error": f"Invalid response format from NBP API."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def convert_currency(user, from_currency, to_currency, amount):
    try:
        from_account = UserCurrencyAccount.objects.get(user=user, currency_code=from_currency)
        to_account = UserCurrencyAccount.objects.get(user=user, currency_code=to_currency)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": "One or both currency accounts do not exist for this user."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        amount = Decimal(amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    except:
        return Response({"error": "Invalid amount format."}, status=status.HTTP_400_BAD_REQUEST)

    if amount <= 0:
        return Response({"error": "Amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        if from_currency == 'PLN':
            rate = get_exchange_rate(to_currency, 'ask')
            if isinstance(rate, Response):
                return rate

            if from_account.balance < amount:
                return Response({"error": "Insufficient balance in PLN account."}, status=status.HTTP_400_BAD_REQUEST)

            from_account.balance -= amount
            converted_amount = (amount / rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            to_account.balance += converted_amount

        else:
            rate = get_exchange_rate(from_currency, 'bid')
            if isinstance(rate, Response):
                return rate

            if from_account.balance < amount:
                return Response({"error": f"Insufficient balance in {from_currency} account."}, status=status.HTTP_400_BAD_REQUEST)

            from_account.balance -= amount
            converted_amount = (amount * rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            to_account.balance += converted_amount

        from_account.save()
        to_account.save()

        AccountHistory.objects.create(user=user, currency=from_currency, amount=amount, action='expense')
        AccountHistory.objects.create(user=user, currency=to_currency, amount=converted_amount, action='income')

        transaction = Transaction.objects.create(
            user=user,
            from_currency=from_currency,
            to_currency=to_currency,
            amount=amount
        )

    return Response({
        "message": "Conversion successful.",
        "converted_amount": str(converted_amount),
        "transaction_id": transaction.transaction_id
    }, status=status.HTTP_201_CREATED)


def deposit_to_account(user, user_currency_account_code, amount):
    try:
        account = UserCurrencyAccount.objects.get(currency_code=user_currency_account_code, user=user)
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": f"Account with currency {user_currency_account_code} not found for this user."}, status=status.HTTP_404_NOT_FOUND)

    amount = Decimal(amount)

    if amount <= 0:
        return Response({"error": "Deposit amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

    with db_transaction.atomic():
        account.balance += amount
        account.save()

        deposit = DepositHistory.objects.create(
            user=user,
            user_currency_account=account,
            amount=amount
        )

    return Response({"message": "Deposit successful.", "deposit_id": deposit.deposit_id}, status=status.HTTP_201_CREATED)