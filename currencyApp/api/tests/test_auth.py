import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from api.models import User

@pytest.mark.django_db
def test_register_user():
    client = APIClient()
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "123456789"
    }
    response = client.post(reverse('register'), data)
    assert response.status_code == 201
    assert User.objects.filter(username="testuser").exists()

@pytest.mark.django_db
def test_login_user():
    client = APIClient()
    user = User.objects.create_user(username="loginuser", email="login@example.com", password="password123")
    data = {"username": "loginuser", "password": "password123"}
    response = client.post(reverse('login'), data)
    assert response.status_code == 200
    assert "accessToken" in response.data