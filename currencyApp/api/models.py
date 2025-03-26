import random
import re
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True)
    account_created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

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