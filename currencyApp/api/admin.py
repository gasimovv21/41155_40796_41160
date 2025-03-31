from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.forms import ModelForm
from .models import (
    User, UserCurrencyAccount, 
    Transaction, AccountHistory, 
    DepositHistory
)


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'


class UserCurrencyAccountInline(admin.TabularInline):
    model = UserCurrencyAccount
    extra = 1


class UserAdmin(BaseUserAdmin):
    form = UserForm

    list_display = (
        'username', 'email', 'first_name', 'last_name',
        'phone_number', 'is_active', 'is_staff',
        'account_created_on', 'updated_on'
    )
    list_filter = ('is_staff', 'is_superuser', 'account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-account_created_on',)

    readonly_fields = ('account_created_on', 'updated_on', 'last_login')

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone_number')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('System Info', {
            'fields': ('last_login', 'account_created_on', 'updated_on'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

    inlines = [UserCurrencyAccountInline]


class UserCurrencyAccountAdmin(admin.ModelAdmin):
    list_display = (
        'account_id', 'user', 'currency_code', 
        'balance', 'is_active', 'updated_at', 'account_number'
    )
    list_filter = ('currency_code', 'is_active', 'updated_at')
    search_fields = ('user__username', 'currency_code')


class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'transaction_id', 'user', 'from_currency', 
        'to_currency', 'amount', 'created_at'
    )
    list_filter = ('from_currency', 'to_currency', 'created_at')
    search_fields = ('user__username', 'from_currency', 'to_currency')
    ordering = ('-created_at',)


class AccountHistoryAdmin(admin.ModelAdmin):
    list_display = (
        'history_id', 'user', 'currency', 
        'amount', 'action', 'created_at'
    )
    list_filter = ('currency', 'action', 'created_at')
    search_fields = ('user__username', 'currency', 'action')
    ordering = ('-created_at',)


class DepositHistoryAdmin(admin.ModelAdmin):
    list_display = (
        'deposit_id', 'user', 'user_currency_account', 
        'amount', 'created_at'
    )
    list_filter = ('user', 'user_currency_account', 'created_at')
    search_fields = ('user__username', 'user_currency_account__currency_code')


admin.site.register(User, UserAdmin)
admin.site.register(UserCurrencyAccount, UserCurrencyAccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(AccountHistory, AccountHistoryAdmin)
admin.site.register(DepositHistory, DepositHistoryAdmin)
