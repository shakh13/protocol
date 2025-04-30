from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from django.conf import settings

User = get_user_model()


class LaboratorySerializer(serializers.ModelSerializer):
    # print_url = serializers.SerializerMethodField()

    class Meta:
        model = Laboratory  # Ensure Laboratory is correctly imported from models
        fields = '__all__'

    # def get_print_url(self, obj):
    #     if obj.print:
    #         return f"{settings.MEDIA_URL}{obj.print.name}"
    #     return None

    def update(self, instance, validated_data):
        # Keep previous image if no new image is uploaded
        instance.print = validated_data.get('print', instance.print)
        instance.name = validated_data.get('name', instance.name)
        instance.name_en = validated_data.get('name_en', instance.name_en)
        instance.address = validated_data.get('address', instance.address)
        instance.address_en = validated_data.get('address_en', instance.address_en)
        instance.boss = validated_data.get('boss', instance.boss)
        instance.boss_en = validated_data.get('boss_en', instance.boss_en)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.protocol_ending = validated_data.get('protocol_ending', instance.protocol_ending)
        instance.protocol_ending_en = validated_data.get('protocol_ending_en', instance.protocol_ending_en)
        instance.save()
        return instance


class PositionSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Position
        fields = '__all__'


class BuildingSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())

    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Building
        fields = '__all__'
        depth = 2


class ClientSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    buildings = BuildingSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    buildings = serializers.SerializerMethodField()  # Add buildings field
    clients = ClientSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = "__all__"
        depth = 1

    # def update(self, instance, validated_data):
    #     new_clients = validated_data.pop('clients', [])
    #     instance = super().update(instance, validated_data)
    #
    #     for client in new_clients:
    #         print(client)
    #         instance.clients.add(client)
    #
    #     instance.save()
    #
    #     return instance

    def get_fullname(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_buildings(self, obj):
        buildings = Building.objects.filter(user=obj)  # Get buildings where user is assigned
        return [{"id": b.id, "name": b.name} for b in buildings]


class CertificateSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = Certificate
        fields = '__all__'


class MachinesSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    certificate = CertificateSerializer(read_only=True)

    class Meta:
        model = Machines
        fields = '__all__'
        depth = 1

    def create(self, validated_data):
        request = self.context.get('request')  # Get request object
        machine = Machines(**validated_data,
                           certificate_id=request.data['certificate'])  # Assign lab ID

        machine.save()
        return machine


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


class ProtocolTypeSerializer(serializers.ModelSerializer):
    laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())

    class Meta:
        model = ProtocolType
        fields = '__all__'


class ProtocolSerializer(serializers.ModelSerializer):
    # laboratory = serializers.PrimaryKeyRelatedField(queryset=Laboratory.objects.all())
    laboratory = LaboratorySerializer(read_only=True)
    laboratory_id = serializers.PrimaryKeyRelatedField(
        queryset=Laboratory.objects.all(),
        source='laboratory', write_only=True
    )

    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client', write_only=True
    )

    building = BuildingSerializer(read_only=True)
    building_id = serializers.PrimaryKeyRelatedField(
        queryset=Building.objects.all(), source='building', write_only=True, allow_null=True, required=False
    )

    type = ProtocolTypeSerializer(read_only=True)
    type_id = serializers.PrimaryKeyRelatedField(
        queryset=ProtocolType.objects.all(), source='type', write_only=True
    )

    class Meta:
        model = Protocol
        fields = '__all__'
        depth = 2
