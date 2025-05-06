import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_unauthenticated_access_denied():
    client = APIClient()
    response = client.get("/api/users/")
    assert response.status_code == 401