from django.urls import path
from .views import (
    getUsers, getUser,
    RegisterView, LoginView, logout_view, forgot_password,
    getCurrencyAccountsView, getCurrencyAccountView,
    getUserCurrencyAccountsView, convertCurrency,
    depositToAccount, getAccountHistory, credit_card_list_create,
    credit_card_detail, get_user_credit_cards
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('forgot-password/', forgot_password, name='forgot-password'),

    path('users/', getUsers, name='user-list'),
    path('users/<int:pk>/', getUser, name='user-detail'),
    path('currency-accounts/', getCurrencyAccountsView, name='currency-account-list'),
    path('currency-accounts/<int:pk>/', getCurrencyAccountView, name='currency-account-detail'),
    path('currency-accounts/user/<int:user_id>/', getUserCurrencyAccountsView, name='user-currency-accounts'),
    path('currency-accounts/convert/<int:user_id>/', convertCurrency, name='convert-currency'),
    path('currency-accounts/deposit/<int:user_id>/', depositToAccount, name='deposit-to-account'),
    path('currency-accounts/history/<int:user_id>/', getAccountHistory, name='account-history'),
    path('credit-card/', credit_card_list_create, name='credit-card-list'),
    path('credit-card/<int:pk>/', credit_card_detail, name='credit-card-detail'),
    path('credit-card/user/<int:user_id>/', get_user_credit_cards, name='credit-card-user'),
]
