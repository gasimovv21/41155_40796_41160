from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.utils.timezone import now
from .models import User, Transaction, DepositHistory, AccountHistory
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


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
@permission_classes([IsAuthenticated])
def getCurrencyAccountsView(request):
    if request.method == 'GET':
        return getCurrencyAccounts(request)
    elif request.method == 'POST':
        return createCurrencyAccount(request)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def getCurrencyAccountView(request, pk):
    if request.method == 'GET':
        return getCurrencyAccountDetail(request, pk)
    elif request.method == 'PUT':
        return updateCurrencyAccount(request, pk)
    elif request.method == 'DELETE':
        return deleteCurrencyAccount(request, pk)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserCurrencyAccountsView(request, user_id):
    return getUserCurrencyAccounts(request, user_id)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def getAccountHistory(request, user_id):
    histories = AccountHistory.objects.filter(user_id=user_id).order_by('-created_at')
    serializer = AccountHistorySerializer(histories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)

        if token.payload['user_id'] != request.user.id:
            return Response({"error": "Token does not belong to the authenticated user."}, status=403)

        token.blacklist()
        return Response({"message": "Logout successful."})
    except TokenError:
        return Response({"error": "Invalid or expired refresh token."}, status=400)


@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"https://gasimovv21.pythonanywhere.com/api/reset-password/{uid}/{token}/" # in local < -- http://localhost:8000/api/reset-password/{uid}/{token}/"

        send_mail(
            'Reset your password',
            f'Click the link to reset your password: {reset_link}',
            'no-reply@currencyapp.com',
            [user.email],
            fail_silently=False,
        )
        return Response({"message": "Password reset link sent to email."})
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=404)


@api_view(['POST'])
def reset_password(request, uidb64, token):
    password = request.data.get('password')
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({"message": "Password reset successful."})
        else:
            return Response({"error": "Invalid or expired token."}, status=400)
    except Exception:
        return Response({"error": "Something went wrong."}, status=400)