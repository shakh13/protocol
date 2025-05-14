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
router.register('laboratory', LaboratoryViewSet, basename='laboratory')

urlpatterns = [
                  path('me', Me.as_view(), name='me'),
                  path('protocol-types/', get_protocol_types, name='protocol-types'),
                  path('add_protocol/', add_protocol, name='add_protocol'),
                  path('protocol/<int:pk>', get_protocol, name='protocol'),
                  path('update_protocol/<int:pk>', update_protocol, name='update_protocol'),
                  path('delete_protocol/<int:pk>', delete_protocol, name='delete_protocol'),
                  path('update_protocol_status/<int:pk>', update_protocol_status,
                       name='update_protocol_status'),
                  path('edit_protocol_requests', get_edit_protocol_requests, name='edit_protocol_requests'),
                  path('user_protocols/<int:pk>', get_user_protocols, name='user_protocols'),
                  path('all_protocols', get_all_protocols, name='all_protocols'),
                  path('generate-pdf/<int:pk>', generate_protocol_pdf, name='generate-pdf'),
              ] + router.urls
