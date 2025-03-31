from django.urls import path
from .views import RegisterView, LoginView, CheckJWTView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('checkjwt/', CheckJWTView.as_view(), name='check-jwt'),
]
