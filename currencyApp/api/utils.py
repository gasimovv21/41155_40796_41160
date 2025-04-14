import requests


from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from .models import (
    User, UserCurrencyAccount, Transaction, AccountHistory,
    DepositHistory)
from .serializers import UserCurrencyAccountSerializer
from django.db import transaction as db_transaction
from decimal import Decimal
from django.contrib.auth.hashers import make_password


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
    return Response({"message": "Currency account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


def getUserCurrencyAccounts(request, user_id):
    try:
        accounts = UserCurrencyAccount.objects.filter(user_id=user_id)
        if not accounts.exists():
            return Response({"error": "No accounts found for this user"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserCurrencyAccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)