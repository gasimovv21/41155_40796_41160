from django.urls import path
from .views import (
    RegisterView, LoginView, logout_view, forgot_password, reset_password,
    getCurrencyAccountsView, getCurrencyAccountView,
    getUserCurrencyAccountsView, convertCurrency,
    depositToAccount, getAccountHistory,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<str:uidb64>/<str:token>/', reset_password, name='reset-password'),

    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'),
    path('currency-accounts/user/<int:user_id>/', getUserCurrencyAccountsView, name='user-currency-accounts'),
    path('currency-accounts/convert/<int:user_id>/', convertCurrency, name='convert-currency'),
    path('currency-accounts/deposit/<int:user_id>/', depositToAccount, name='deposit-to-account'),
    path('currency-accounts/history/<int:user_id>/', getAccountHistory, name='account-history'),
]
