from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.utils.timezone import now
from .models import User, Transaction, DepositHistory, AccountHistory, CreditCard, UserCurrencyAccount, WithdrawHistory
from django.core.mail import send_mail
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth.hashers import make_password
from decimal import Decimal


from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    TransactionSerializer,
    ConvertRequestSerializer,
    DepositRequestSerializer,
    DepositHistorySerializer,
    AccountHistorySerializer,
    ForgotPasswordRequestSerializer,
    UserCurrencyAccountSerializer,
    CreditCardSerializer,
    WithdrawHistorySerializer
)
from .utils import (
    generate_temporary_password,
    getUsersList, getUserDetail, updateUser,
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsers(request):
    return getUsersList(request)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def getUser(request, pk):
    if request.method == 'GET':
        return getUserDetail(request, pk)
    elif request.method == 'PUT':
        return updateUser(request, pk)


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

        serializer = ConvertRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        return convert_currency(
            user,
            validated_data['from_currency'],
            validated_data['to_currency'],
            validated_data['amount']
        )


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

    elif request.method == 'POST':
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DepositRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        return deposit_to_account(
            user,
            validated_data['user_currency_account_code'],
            validated_data['amount']
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAccountHistory(request, user_id):
    histories = AccountHistory.objects.filter(user_id=user_id).order_by('-created_at')
    serializer = AccountHistorySerializer(histories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response({"error": "Refresh token is required."}, status=400)

    try:
        token = RefreshToken(refresh_token)

        if token['user_id'] != request.user.id:
            return Response({"error": "Token does not belong to the authenticated user."}, status=403)

        token.blacklist()
        return Response({"message": "Logout successful."})

    except (TokenError, InvalidToken):
        return Response({"error": "Invalid or expired refresh token."}, status=400)
    except Exception:
        return Response({"error": "Something went wrong."}, status=500)


@api_view(['POST'])
def forgot_password(request):
    serializer = ForgotPasswordRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    try:
        user = User.objects.get(email=email)

        temp_password = generate_temporary_password()

        user.password = make_password(temp_password)
        user.save()

        send_mail(
            'Your Temporary Password',
            f'Hello,\n\n'
            f'This is your temporary password to access your account: {temp_password}\n\n'
            f'Please change it in your profile settings after logging in.\n'
            f'If you experience any issues, do not hesitate to contact our support team.',
            'gasimoweltun@gmail.com',
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Temporary password sent to your email."})
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def credit_card_list_create(request):
    if request.method == 'GET':
        cards = CreditCard.objects.filter(user=request.user)
        serializer = CreditCardSerializer(cards, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        if CreditCard.objects.filter(user=request.user).count() >= 3:
            return Response({"error": "Maximum of 3 credit cards allowed."}, status=400)

        serializer = CreditCardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def credit_card_detail(request, pk):
    try:
        card = CreditCard.objects.get(pk=pk, user=request.user)
    except CreditCard.DoesNotExist:
        return Response({"error": "Card not found."}, status=404)

    if request.method == 'GET':
        return Response(CreditCardSerializer(card).data)

    elif request.method == 'PUT':
        serializer = CreditCardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        card.delete()
        return Response({"message": "Card deleted successfully."}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_credit_cards(request, user_id):
    if request.user.id != user_id and not request.user.is_staff:
        return Response({"error": "Not authorized."}, status=403)

    cards = CreditCard.objects.filter(user_id=user_id)
    serializer = CreditCardSerializer(cards, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_from_account(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    if request.user != user:
        return Response({"error": "You are not authorized to perform this action."}, status=403)

    amount = request.data.get("amount")
    card_id = request.data.get("card_id")
    currency_code = request.data.get("currency")

    if not all([amount, card_id, currency_code]):
        return Response({"error": "Amount, card_id, and currency are required."}, status=400)

    try:
        amount = Decimal(str(amount))
        if amount <= 0:
            raise ValueError
    except:
        return Response({"error": "Amount must be a positive number."}, status=400)

    try:
        card = CreditCard.objects.get(id=card_id, user=user)
    except CreditCard.DoesNotExist:
        return Response({"error": "Credit card not found or does not belong to user."}, status=404)

    try:
        account = UserCurrencyAccount.objects.get(user=user, currency_code=currency_code.upper())
    except UserCurrencyAccount.DoesNotExist:
        return Response({"error": f"{currency_code} account not found."}, status=404)

    if account.balance < amount:
        return Response({"error": f"Insufficient {currency_code} balance."}, status=400)

    account.balance -= amount
    account.save()

    WithdrawHistory.objects.create(
        user=user,
        credit_card=card,
        amount=amount,
        currency=currency_code.upper()
    )

    AccountHistory.objects.create(
        user=user,
        currency=currency_code.upper(),
        amount=amount,
        action='expense'
    )

    masked = card.card_number[-4:] if len(card.card_number) >= 4 else card.card_number

    return Response({
        "message": f"{amount} {currency_code.upper()} successfully withdrawn to card ****{masked}"
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_withdraw_history(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    if request.user != user:
        return Response({"error": "Unauthorized"}, status=403)

    currency_code = request.GET.get('currency_code')

    queryset = WithdrawHistory.objects.filter(user=user)
    if currency_code:
        queryset = queryset.filter(currency=currency_code)

    serializer = WithdrawHistorySerializer(queryset.order_by('-created_at'), many=True)
    return Response(serializer.data)
