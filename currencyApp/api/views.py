from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer
from django.conf import settings
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import RefreshToken

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
                        "message": "Login successful",
                        "tokens": tokens
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckJWTView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserRegistrationSerializer(user)
        return Response({"message": "✅ You are authenticated!", "user": serializer.data})

