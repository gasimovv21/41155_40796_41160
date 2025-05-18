from django.contrib.auth.hashers import make_password
from datetime import datetime, date
from rest_framework import serializers
from .models import (
    User,
    UserCurrencyAccount,
    Transaction,
    DepositHistory,
    AccountHistory,
    CreditCard)



class UserSerializer(serializers.ModelSerializer):
    account_created_on = serializers.SerializerMethodField()
    updated_on = serializers.SerializerMethodField()
    last_login = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'email',
            'password',
            'account_created_on',
            'updated_on',
            'last_login',)

        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def get_account_created_on(self, obj):
        return obj.account_created_on.strftime(
            '%d-%m-%Y') if obj.account_created_on else None

    def get_last_login(self, obj):
        return obj.last_login.strftime(
            '%d-%m-%Y %H:%M:%S') if obj.last_login else None

    def get_updated_on(self, obj):
        return obj.updated_on.strftime(
            '%d-%m-%Y %H:%M:%S') if obj.updated_on else None


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


class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class CreditCardSerializer(serializers.ModelSerializer):
    expiration_date = serializers.CharField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = CreditCard
        fields = ['id', 'user', 'card_number', 'expiration_date', 'cvv', 'created_at']
        extra_kwargs = {
            'cvv': {'write_only': True},
            'card_number': {'write_only': False},
        }

    def validate_expiration_date(self, value):
        try:
            parsed = datetime.strptime(value.strip(), "%m/%y")
            exp_date = parsed.date().replace(day=1)
            if exp_date < date.today().replace(day=1):
                raise serializers.ValidationError("Expiration date must be in the future.")
            return exp_date
        except ValueError:
            raise serializers.ValidationError("Expiration date must be in format MM/YY (e.g. 12/26)")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['expiration_date'] = instance.expiration_date.strftime('%m/%y')
        return data

    def get_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M:%S')
