import random
import re
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator
from django.db.models import Q


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    secret_phrase = models.CharField(max_length=255, null=True, blank=True)
    account_created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


class UserCurrencyAccount(models.Model):
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('JPY', 'Japanese Yen'),
        ('GBP', 'British Pound'),
        ('AUD', 'Australian Dollar'),
        ('CAD', 'Canadian Dollar'),
        ('CHF', 'Swiss Franc'),
        ('SEK', 'Swedish Krona'),
        ('PLN', 'Polish Zloty'),  # Default
    ]

    account_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='currency_accounts')
    currency_code = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    account_number = models.CharField(max_length=15, unique=True, editable=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'currency_code'], name='unique_user_currency_account')
        ]

    def __str__(self):
        return f"{self.get_currency_code_display()} Account for {self.user.username}"

    def clean(self):
        if not re.match(r'^[A-Z]{3}$', self.currency_code):
            raise ValidationError("Currency code must be a valid ISO 4217 code (e.g., USD, EUR, PLN).")
        if self.balance < 0:
            raise ValidationError("Balance cannot be negative.")

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_account_number()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_account_number():
        """
        Generate a random account number in the format XXX-XXX-XXX.
        """
        while True:
            number = '-'.join(f"{random.randint(100, 999)}" for _ in range(3))
            if not UserCurrencyAccount.objects.filter(account_number=number).exists():
                return number


@receiver(post_save, sender=User)
def create_default_currency_account(sender, instance, created, **kwargs):
    if created:
        UserCurrencyAccount.objects.create(user=instance, currency_code='PLN')


class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    from_currency = models.CharField(max_length=3)
    to_currency = models.CharField(max_length=3)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.transaction_id}: {self.user.username} ({self.from_currency} to {self.to_currency}, {self.amount})"


class AccountHistory(models.Model):
    ACTION_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    history_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='account_histories')
    currency = models.CharField(max_length=3)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    action = models.CharField(max_length=8, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History {self.history_id}: {self.user.username} ({self.currency}, {self.action}, {self.amount})"


class DepositHistory(models.Model):
    deposit_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deposits')
    user_currency_account = models.ForeignKey(UserCurrencyAccount, on_delete=models.CASCADE, related_name='deposits')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Deposit {self.deposit_id} by {self.user.username} to {self.user_currency_account.currency_code} account"


class CreditCard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="credit_cards")

    card_number = models.CharField(
        max_length=16,
        validators=[RegexValidator(r'^\d{16}$', message="Card number must be 16 digits.")],
        unique=True
    )
    expiration_date = models.DateField()
    cvv = models.CharField(
        max_length=4,
        validators=[RegexValidator(r'^\d{3,4}$', message="CVV must be 3 or 4 digits.")]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'card_number'], name='unique_card_per_user'),
            models.CheckConstraint(check=Q(card_number__regex=r'^\d{16}$'), name="valid_card_number_format")
        ]

    def __str__(self):
        return f"Card **** **** **** {self.card_number[-4:]} for {self.user.username}"


class WithdrawHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    credit_card = models.ForeignKey(CreditCard, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='PLN')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} {self.currency} withdrawn by {self.user.username} to card ****{self.credit_card.card_number[-4:]}"
