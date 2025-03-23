from django.shortcuts import render
from django.template.defaultfilters import slice_filter
from knox.serializers import UserSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken
from rest_framework.views import APIView

from .serializers import *
from .models import *

from django.shortcuts import get_object_or_404

from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

User = get_user_model()


class PositionViewSet(viewsets.ModelViewSet):
    serializer_class = PositionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Position.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Position.objects.all()
        position = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(position)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Position, pk=self.kwargs['pk'])  # Get existing position
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        position = get_object_or_404(Position, pk=self.kwargs['pk'])
        position.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BuildingViewSet(viewsets.ModelViewSet):
    serializer_class = BuildingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Building.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Building.objects.all()
        building = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(building)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Building, pk=self.kwargs['pk'])  # Get existing building
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        building = get_object_or_404(Building, pk=self.kwargs['pk'])
        building.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.prefetch_related("buildings").all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Client.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Client.objects.all()
        client = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(client)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Client, pk=self.kwargs['pk'])  # Get existing client
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        client = get_object_or_404(Client, pk=self.kwargs['pk'])
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MachineViewSet(viewsets.ModelViewSet):
    serializer_class = MachinesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Machines.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Machines.objects.all()
        machine = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(machine)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Machines, pk=self.kwargs['pk'])  # Get existing machine
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        machine = get_object_or_404(Machines, pk=self.kwargs['pk'])
        machine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Certificate.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Certificate.objects.all()
        certificate = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(certificate)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Certificate, pk=self.kwargs['pk'])  # Get existing certificate
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        certificate = get_object_or_404(Certificate, pk=self.kwargs['pk'])
        certificate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def list(self, request):
        current_user = request.user
        queryset = User.objects.filter(
            laboratory_id=current_user.laboratory_id  # ✅ Same laboratory
        ).exclude(id=current_user.id)  # ✅ Exclude current user

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, pk=None):
        instance = get_object_or_404(CustomUser, pk=pk)  # Get existing user
        password = request.data.pop('password', None)
        position_id = request.data.pop('position', None)
        if position_id:
            try:
                position = Position.objects.get(id=position_id)  # Fetch Position instance
            except Position.DoesNotExist:
                raise serializers.ValidationError({"position": "Invalid position ID."})
        else:
            position = None
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = User.objects.get(pk=pk)
        user.position = position

        if password:
            user.set_password(password)
        user.save()

        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class Me(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LoginSerializer

    def get(self, request):
        return Response({
            'fullname': request.user.first_name + ' ' + request.user.last_name,
            'email': request.user.email,
            'isAdmin': request.user.is_superuser,
        })


class LoginViewSet(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                _, token = AuthToken.objects.create(user)

                return Response(
                    {
                        "user": self.serializer_class(user).data,
                        "fullname": f"{user.first_name} {user.last_name}",
                        "token": token,
                        "isAdmin": user.is_superuser,
                    }
                )
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
            return Response(serializer.errors, status=400)


class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})  # Pass request in context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink) + str("password-reset/") + str(token)
    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_adress': reset_password_token.user.email
    }

    html_message = render_to_string("backend/email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject="Request for resetting password for {title}".format(title=reset_password_token.user.email),
        body=plain_message,
        from_email="vip.shaxi@gmail.com",
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()
