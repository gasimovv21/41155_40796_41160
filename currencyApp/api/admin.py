from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.forms import ModelForm
from .models import (
    User, UserCurrencyAccount, 
    Transaction, AccountHistory, 
    DepositHistory, CreditCard, WithdrawHistory
)


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'


class UserCurrencyAccountInline(admin.TabularInline):
    model = UserCurrencyAccount
    extra = 1


class CreditCardInline(admin.TabularInline):
    model = CreditCard
    extra = 1
    max_num = 3


class UserAdmin(BaseUserAdmin):
    form = UserForm

    list_display = (
        'username', 'email', 'first_name', 'last_name',
        'phone_number', 'secret_key', 'is_active', 'is_staff',
        'account_created_on', 'updated_on'
    )
    list_filter = ('is_staff', 'is_superuser', 'account_created_on', 'updated_on')
    search_fields = ('username', 'email', 'secret_key', 'first_name', 'last_name', 'phone_number')
    ordering = ('-account_created_on',)

    readonly_fields = ('account_created_on', 'updated_on', 'last_login')

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone_number', 'secret_key',)
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

    inlines = [UserCurrencyAccountInline, CreditCardInline]


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


class CreditCardAdmin(admin.ModelAdmin):
    list_display = ('user', 'masked_card_number', 'expiration_date', 'created_at')
    search_fields = ('user__username', 'card_number')
    list_filter = ('expiration_date', 'created_at')
    readonly_fields = ('created_at',)

    def masked_card_number(self, obj):
        return f"**** **** **** {obj.card_number[-4:]}"
    masked_card_number.short_description = 'Card Number'


class WithdrawHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'masked_card', 'amount', 'currency', 'created_at')
    list_filter = ('currency', 'created_at')
    search_fields = ('user__username', 'credit_card__card_number')
    readonly_fields = ('created_at',)

    def masked_card(self, obj):
        return f"****{obj.credit_card.card_number[-4:]}"
    masked_card.short_description = 'Card'


admin.site.register(User, UserAdmin)
admin.site.register(UserCurrencyAccount, UserCurrencyAccountAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(AccountHistory, AccountHistoryAdmin)
admin.site.register(DepositHistory, DepositHistoryAdmin)
admin.site.register(CreditCard, CreditCardAdmin)
admin.site.register(WithdrawHistory, WithdrawHistoryAdmin)
