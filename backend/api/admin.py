from django.contrib import admin
from .models import *

admin.site.register(Laboratory)
admin.site.register(Position)
admin.site.register(Client)
admin.site.register(Building)
admin.site.register(Machines)
admin.site.register(Certificate)

admin.site.register(CustomUser)

admin.site.register(ProtocolType)
admin.site.register(Protocol)
