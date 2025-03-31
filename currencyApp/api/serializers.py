from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'phone_number', 'email')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
