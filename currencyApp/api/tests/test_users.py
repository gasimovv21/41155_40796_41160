import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User

@pytest.mark.django_db
def test_get_user_authenticated():
    user = User.objects.create_user(username="tester", email="t@t.com", password="pass123")
    token = RefreshToken.for_user(user).access_token
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.get(f"/api/users/{user.id}/")
    assert response.status_code == 200
    assert response.data['username'] == "tester"
