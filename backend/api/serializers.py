from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()


class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory  # Ensure Laboratory is correctly imported from models
        fields = '__all__'


class PositionSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Position
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    buildings = serializers.SerializerMethodField()  # Add buildings field

    class Meta:
        model = User
        fields = "__all__"
        depth = 1

    def get_fullname(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_buildings(self, obj):
        buildings = Building.objects.filter(user=obj)  # Get buildings where user is assigned
        return [{"id": b.id, "name": b.name, "address": b.address} for b in buildings]


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


class BuildingSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())

    class Meta:
        model = Building
        fields = '__all__'
        depth = 1


class ClientSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    buildings = BuildingSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = '__all__'


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
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'position', 'laboratory_id')
        depth = 1

        extra_kwargs = {
            'password': {'write_only': True},
            'laboratory_id': {'read_only': True}  # Prevent user from manually setting it
        }

    def create(self, validated_data):
        request = self.context.get('request')  # Get request object
        if request and request.user:  # Ensure request is valid
            laboratory_id = request.user.laboratory_id  # Get current user's lab ID
        else:
            laboratory_id = None  # Handle anonymous users if needed

        password = validated_data.pop('password', None)
        # position_id = validated_data.pop('position', None)
        # if position_id:
        #     position = Position.objects.get(pk=position_id)
        # else:
        #     position = None
        validated_data['username'] = validated_data['email']
        user = User(**validated_data, laboratory_id=laboratory_id,
                    position_id=request.data['position'])  # Assign lab ID
        if password:
            user.set_password(password)  # Hash password
        user.save()
        return user
