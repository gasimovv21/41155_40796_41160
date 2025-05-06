import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User, UserCurrencyAccount

@pytest.mark.django_db
def test_pln_account_cannot_be_deleted():
    user = User.objects.create_user(username="plntest", email="pln@example.com", password="plnpass")
    pln = UserCurrencyAccount.objects.get(user=user, currency_code="PLN")
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.delete(f"/api/currency-accounts/{pln.account_id}/")
    assert response.status_code == 400
    assert "Cannot delete the default PLN account." in response.data["error"]