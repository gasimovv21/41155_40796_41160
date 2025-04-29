from rest_framework import serializers
from .models import (
    User,
    UserCurrencyAccount,
    Transaction,
    DepositHistory,
    AccountHistory)
from django.contrib.auth.hashers import make_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'first_name',
            'last_name',
            'phone_number',
            'email')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserCurrencyAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCurrencyAccount
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['transaction_id', 'from_currency', 'to_currency', 'amount', 'user', 'created_at']

    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M:%S')


class ConvertRequestSerializer(serializers.Serializer):
    from_currency = serializers.CharField(required=True, max_length=3)
    to_currency = serializers.CharField(required=True, max_length=3)
    amount = serializers.FloatField(required=True, min_value=0.01)


class DepositRequestSerializer(serializers.Serializer):
    user_currency_account_code = serializers.CharField(required=True)
    amount = serializers.FloatField(required=True, min_value=0.01)


class DepositHistorySerializer(serializers.ModelSerializer):
    currency_code = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = DepositHistory
        fields = ['deposit_id', 'amount', 'created_at', 'user', 'currency_code']

    def get_currency_code(self, obj):
        return obj.user_currency_account.currency_code

    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M:%S')


class AccountHistorySerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = AccountHistory
        fields = [
            'history_id',
            'currency',
            'action',
            'amount',
            'user',
            'created_at']

    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M:%S')