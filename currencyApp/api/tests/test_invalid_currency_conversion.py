import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserCurrencyAccount
from decimal import Decimal


@pytest.mark.django_db
def test_currency_conversion_with_invalid_amount(monkeypatch):
    user = User.objects.create_user(username="invuser", email="inv@example.com", password="pass123")
    pln = UserCurrencyAccount.objects.get(user=user, currency_code="PLN")
    usd = UserCurrencyAccount.objects.create(user=user, currency_code="USD", balance=Decimal("0.00"))

    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    monkeypatch.setattr("api.utils.get_exchange_rate", lambda c, t: Decimal("4.00"))
    data = {"from_currency": "PLN", "to_currency": "USD", "amount": 0}
    response = client.post(f"/api/currency-accounts/convert/{user.id}/", data)
    assert response.status_code == 400
    assert "amount" in response.data
