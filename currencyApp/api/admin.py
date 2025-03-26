from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from .models import (User, UserCurrencyAccount, 
                    Transaction, AccountHistory, DepositHistory
)


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'


class UserCurrencyAccountInline(admin.TabularInline):
    model = UserCurrencyAccount
    extra = 1


class UserAdmin(admin.ModelAdmin):
    form = UserForm

    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'account_created_on', 'updated_on')
    list_filter = ('account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-account_created_on',)
    inlines = [UserCurrencyAccountInline]


class UserCurrencyAccountAdmin(admin.ModelAdmin):
    list_display = ('account_id', 'user', 'currency_code', 'balance', 'is_active', 'updated_at', 'account_number')
    list_filter = ('currency_code', 'is_active', 'updated_at')
    search_fields = ('user__username', 'currency_code')


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'user', 'from_currency', 'to_currency', 'amount', 'created_at')
    list_filter = ('from_currency', 'to_currency', 'created_at')
    search_fields = ('user__username', 'from_currency', 'to_currency')
    ordering = ('-created_at',)


class AccountHistoryAdmin(admin.ModelAdmin):
    list_display = ('history_id', 'user', 'currency', 'amount', 'action', 'created_at')
    list_filter = ('currency', 'action', 'created_at')
    search_fields = ('user__username', 'currency', 'action')
    ordering = ('-created_at',)


class DepositHistoryAdmin(admin.ModelAdmin):
    list_display = ('deposit_id', 'user', 'user_currency_account', 'amount', 'created_at')
    list_filter = ('user', 'user_currency_account', 'created_at')
    search_fields = ('user__username', 'user_currency_account__currency_code')



admin.site.register(User, UserAdmin)
admin.site.register(UserCurrencyAccount, UserCurrencyAccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(AccountHistory, AccountHistoryAdmin)
admin.site.register(DepositHistory, DepositHistoryAdmin)