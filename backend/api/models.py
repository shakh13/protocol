import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.base_user import BaseUserManager

from api.protocols.beton_08 import Beton08PDF


class Laboratory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    address_en = models.CharField(max_length=100)
    boss = models.CharField(max_length=100)
    boss_en = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    phone = models.CharField(max_length=100)
    print = models.ImageField(upload_to='images/')
    protocol_ending = models.TextField()
    protocol_ending_en = models.TextField()

    def __str__(self):
        return self.name


class Position(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=70)
    name_en = models.CharField(max_length=70)

    def __str__(self):
        return self.name


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Building(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    user = models.ForeignKey("CustomUser", on_delete=models.SET_NULL, null=True, blank=True)
    client = models.ForeignKey(Client, related_name="buildings", on_delete=models.CASCADE)
    name = models.CharField(max_length=500)
    prefix = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Certificate(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Machines(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE)
    certificate_number = models.CharField(max_length=100)
    certificate_expiry_date = models.DateField()

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
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    clients = models.ManyToManyField(Client, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


PROTOCOL_STATUS = [
    (0, 'SAVED'),
    (1, 'COMPLETED'),
    (2, 'REQUEST'),
    (3, 'REJECTED'),
]

PROTOCOL_TYPES = [
    (0, 'Бетон 08'),
    (1, 'Бетон 1.28'),
    (2, 'Грунт, плот'),
    (3, 'Грунт, куп'),
    (4, 'ГПС, плот'),
    (5, 'ГПС, куп'),
    (6, 'Оникс, Шмидт 08'),
    (7, 'Оникс, Шмидт 1.28'),
    (8, 'Щебень'),
    (9, 'Песок'),
    (10, 'Цемент'),
    (11, 'ГПС, ШПС'),
    (12, 'Макс. плотность'),
    (13, 'ПЛТ'),
]

PROTOCOL_SETTINGS = {
    0: Beton08PDF.settings(),
    1: Beton08PDF.settings(),
    2: Beton08PDF.settings(),
    3: Beton08PDF.settings(),
    4: Beton08PDF.settings(),
    5: Beton08PDF.settings(),
    6: Beton08PDF.settings(),
    7: Beton08PDF.settings(),
    8: Beton08PDF.settings(),
    9: Beton08PDF.settings(),
    10: Beton08PDF.settings(),
    11: Beton08PDF.settings(),
    12: Beton08PDF.settings(),
    13: Beton08PDF.settings(),
}


class ProtocolType(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    settings = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Protocol(models.Model):
    id = models.AutoField(primary_key=True)
    laboratory = models.ForeignKey(Laboratory, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ForeignKey(ProtocolType, on_delete=models.CASCADE)
    machines = models.ManyToManyField(Machines, blank=True)
    language = models.CharField(max_length=2, default='ru', blank=True)
    # add additional fields
    product_name = models.CharField(max_length=100, null=True, blank=True)
    product_name_eng = models.CharField(max_length=100, null=True, blank=True)
    building_data = models.CharField(max_length=100, null=True, blank=True)
    building_data_eng = models.CharField(max_length=100, null=True, blank=True)
    producer_name = models.CharField(max_length=100, null=True, blank=True)
    producer_name_eng = models.CharField(max_length=100, null=True, blank=True)
    test_type = models.CharField(max_length=100, null=True, blank=True)
    test_type_eng = models.CharField(max_length=100, null=True, blank=True)
    rd_test_building = models.CharField(max_length=100, null=True, blank=True)
    rd_test_building_eng = models.CharField(max_length=100, null=True, blank=True)
    rd_test_method = models.CharField(max_length=100, null=True, blank=True)
    rd_test_method_eng = models.CharField(max_length=100, null=True, blank=True)
    addition = models.CharField(max_length=100, null=True, blank=True)
    addition_eng = models.CharField(max_length=100, null=True, blank=True)
    subcontractor = models.CharField(max_length=100, null=True, blank=True)
    subcontractor_eng = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    temperature_from = models.IntegerField(null=True, blank=True)
    temperature_to = models.IntegerField(null=True, blank=True)
    humidity_from = models.IntegerField(null=True, blank=True)
    humidity_to = models.IntegerField(null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    data = models.TextField()
    status = models.IntegerField(choices=PROTOCOL_STATUS)

    def __str__(self):
        return f'{self.product_name} - {self.type}'
