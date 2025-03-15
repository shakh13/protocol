from django.contrib import admin
from .models import *

admin.site.register(Laboratory)
admin.site.register(Position)
admin.site.register(Client)
admin.site.register(Building)
admin.site.register(Equipment)

admin.site.register(CustomUser)
