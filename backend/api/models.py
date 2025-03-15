import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager


class Laboratory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    boss = models.CharField(max_length=100)
    print = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Position(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=70)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Building(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Equipment(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    certificate = models.CharField(max_length=200)
    certificate_number = models.CharField(max_length=100)
    certificate_expiry_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        # position, laboratory, clients, building in **extra_fields
        if not email:
            raise ValueError('Email is a required field')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    laboratory = models.OneToOneField(Laboratory, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    clients = models.ManyToManyField(Client, null=True, blank=True)
    buildings = models.ManyToManyField(Building, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
