import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserCurrencyAccount
from decimal import Decimal

@pytest.mark.django_db
def test_deposit_to_account():
    user = User.objects.create_user(username="deposituser", email="dep@example.com", password="dep123")
    account = UserCurrencyAccount.objects.create(user=user, currency_code="USD", balance=Decimal("0.00"))
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    data = {"user_currency_account_code": "USD", "amount": 250}
    response = client.post(f"/api/currency-accounts/deposit/{user.id}/", data)
    assert response.status_code == 201
    account.refresh_from_db()
    assert account.balance == Decimal("250.00")
