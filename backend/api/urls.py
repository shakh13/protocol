from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('login', LoginViewSet, basename='login')
router.register('users', UserViewSet, basename='users')
router.register('certificates', CertificateViewSet, basename='certificates')
router.register('machines', MachineViewSet, basename='machines')
router.register('clients', ClientViewSet, basename='clients')
router.register('buildings', BuildingViewSet, basename='buildings')
router.register('positions', PositionViewSet, basename='positions')

urlpatterns = [
                  path('me', Me.as_view(), name='me'),
              ] + router.urls
