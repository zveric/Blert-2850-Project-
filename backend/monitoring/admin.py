from django.contrib import admin

# Register your models here.

# from .models import Sites, Livestock, Readings, Alerts

from .models import User, Livestock, Readings

# admin.site.register(Sites)
# admin.site.register(Livestock)
# admin.site.register(Readings)
# admin.site.register(Alerts)

admin.site.register(User)
admin.site.register(Livestock)
admin.site.register(Readings)
