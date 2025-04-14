from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Transaction, DepositHistory, AccountHistory
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    TransactionSerializer,
    DepositHistorySerializer,
    AccountHistorySerializer
)
from .utils import (
    getCurrencyAccounts, createCurrencyAccount, getCurrencyAccountDetail,
    updateCurrencyAccount, deleteCurrencyAccount, getUserCurrencyAccounts,
    convert_currency, deposit_to_account
)

SECRET_KEY = settings.SECRET_KEY


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(username=serializer.validated_data['username'])
                if check_password(serializer.validated_data['password'], user.password):
                    user.last_login = now()
                    user.save(update_fields=["last_login"])

                    tokens = get_tokens_for_user(user)
                    return Response({
                        "accessToken": tokens["access"],
                        "refreshToken": tokens["refresh"],
                        "user_id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class CheckJWTView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = UserRegistrationSerializer(user)
#         return Response({"message": "✅ You are authenticated!", "user": serializer.data})


@api_view(['GET', 'POST'])
def getCurrencyAccountsView(request):
    if request.method == 'GET':
        return getCurrencyAccounts(request)
    elif request.method == 'POST':
        return createCurrencyAccount(request)


@api_view(['GET', 'PUT', 'DELETE'])
def getCurrencyAccountView(request, pk):
    if request.method == 'GET':
        return getCurrencyAccountDetail(request, pk)
    elif request.method == 'PUT':
        return updateCurrencyAccount(request, pk)
    elif request.method == 'DELETE':
        return deleteCurrencyAccount(request, pk)


@api_view(['GET'])
def getUserCurrencyAccountsView(request, user_id):
    return getUserCurrencyAccounts(request, user_id)


@api_view(['GET', 'POST'])
def convertCurrency(request, user_id):
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user_id=user_id)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        from_currency = request.data.get('from_currency')
        to_currency = request.data.get('to_currency')
        amount = request.data.get('amount')

        if not all([from_currency, to_currency, amount]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
        except ValueError:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        return convert_currency(user, from_currency, to_currency, amount)


@api_view(['GET', 'POST'])
def depositToAccount(request, user_id):
    if request.method == 'GET':
        currency_code = request.GET.get('currency_code')

        deposits = DepositHistory.objects.filter(user_id=user_id)
        if currency_code:
            deposits = deposits.filter(user_currency_account__currency_code=currency_code)

        deposits = deposits.order_by('-created_at')

        serializer = DepositHistorySerializer(deposits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user_currency_account_code = request.data.get('user_currency_account_code')
        amount = request.data.get('amount')

        if not all([user_currency_account_code, amount]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
        except ValueError:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        return deposit_to_account(user, user_currency_account_code, amount)


@api_view(['GET'])
def getAccountHistory(request, user_id):
    histories = AccountHistory.objects.filter(user_id=user_id).order_by('-created_at')
    serializer = AccountHistorySerializer(histories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)