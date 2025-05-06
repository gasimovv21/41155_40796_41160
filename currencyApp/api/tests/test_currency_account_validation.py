import pytest
from api.models import UserCurrencyAccount, User
from django.core.exceptions import ValidationError
from decimal import Decimal

@pytest.mark.django_db
def test_currency_account_invalid_currency_code():
    user = User.objects.create_user(username="baduser", email="bad@example.com", password="badpass")
    account = UserCurrencyAccount(user=user, currency_code="INVALID", balance=Decimal("100.00"))
    with pytest.raises(ValidationError):
        account.clean()

@pytest.mark.django_db
def test_currency_account_negative_balance():
    user = User.objects.create_user(username="neguser", email="neg@example.com", password="negpass")
    account = UserCurrencyAccount(user=user, currency_code="USD", balance=Decimal("-50.00"))
    with pytest.raises(ValidationError):
        account.clean()
