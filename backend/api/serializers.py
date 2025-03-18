from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()


class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory  # Ensure Laboratory is correctly imported from models
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'is_superuser']


class CertificateSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Certificate
        fields = '__all__'


class MachinesSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Machines
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Client
        fields = '__all__'


class BuildingSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Building
        fields = '__all__'
        depth = 1


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
