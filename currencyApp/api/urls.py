from django.urls import path
from .views import (
    RegisterView, LoginView, getCurrencyAccountsView,
    getCurrencyAccountView, getUserCurrencyAccountsView,
    convertCurrency, depositToAccount, getAccountHistory,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'),
    path('currency-accounts/user/<int:user_id>/', getUserCurrencyAccountsView, name='user-currency-accounts'),

    path('currency-accounts/convert/<int:user_id>/', convertCurrency, name='convert-currency'),
    path('currency-accounts/deposit/<int:user_id>/', depositToAccount, name='deposit-to-account'),
    path('currency-accounts/history/<int:user_id>/', getAccountHistory, name='account-history'),
    # path('checkjwt/', CheckJWTView.as_view(), name='check-jwt'),
]
