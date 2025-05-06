import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserCurrencyAccount
from decimal import Decimal

@pytest.mark.django_db
def test_currency_conversion_pln_to_usd(monkeypatch):
    user = User.objects.create_user(username="convuser", email="conv@example.com", password="pass123")
    pln = UserCurrencyAccount.objects.get(user=user, currency_code="PLN")
    pln.balance = Decimal("1000.00")
    pln.save()
    usd = UserCurrencyAccount.objects.create(user=user, currency_code="USD", balance=Decimal("0.00"))
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    monkeypatch.setattr("api.utils.get_exchange_rate", lambda c, t: Decimal("4.00"))
    data = {"from_currency": "PLN", "to_currency": "USD", "amount": 400}
    response = client.post(f"/api/currency-accounts/convert/{user.id}/", data)
    assert response.status_code == 201
    pln.refresh_from_db()
    usd.refresh_from_db()
    assert pln.balance == Decimal("600.00")
    assert usd.balance == Decimal("100.00")
