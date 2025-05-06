import pytest
from rest_framework.test import APIClient
from django.core import mail
from api.models import User

@pytest.mark.django_db
def test_forgot_password_sends_email():
    user = User.objects.create_user(username="forgotuser", email="forgot@example.com", password="oldpass")
    client = APIClient()
    data = {"email": "forgot@example.com"}
    response = client.post("/api/forgot-password/", data)
    assert response.status_code == 200
    assert len(mail.outbox) == 1
    assert "temporary password" in mail.outbox[0].body.lower()
