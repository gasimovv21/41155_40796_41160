from django.urls import path
from .views import RegisterView, LoginView, CheckJWTView

urlpatterns = [
    path('v1/register/', RegisterView.as_view(), name='register'),
    path('v1/login/', LoginView.as_view(), name='login'),
    path('v1/checkjwt/', CheckJWTView.as_view(), name='check-jwt'),
]
