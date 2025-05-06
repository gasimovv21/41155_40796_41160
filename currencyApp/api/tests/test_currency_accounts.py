import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserCurrencyAccount

@pytest.mark.django_db
def test_create_currency_account():
    user = User.objects.create_user(username="accuser", email="acc@example.com", password="1234test")
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    data = {"user": user.id, "currency_code": "USD", "balance": "100.00"}
    response = client.post("/api/currency-accounts/", data)
    assert response.status_code == 201
    assert UserCurrencyAccount.objects.filter(user=user, currency_code="USD").exists()
