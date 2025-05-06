import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, AccountHistory

@pytest.mark.django_db
def test_get_account_history():
    user = User.objects.create_user(username="historyuser", email="hist@example.com", password="histpass")
    AccountHistory.objects.create(user=user, currency="USD", amount=100, action="income")
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get(f"/api/currency-accounts/history/{user.id}/")
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["currency"] == "USD"