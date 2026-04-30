from django.db import models 
from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models as models

# Create your models here.
# https://docs.djangoproject.com/en/6.0/topics/auth/customizing/
# using the built in abstract user class for the user model
class User(AbstractUser):
    pass

class Livestock(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name="livestock"
    )
    site_id = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.site_id)

# https://gis.stackexchange.com/questions/179627/django-postgis-how-to-insert-coordinates-in-pointfield-in-epsg27700-and-retur
class Readings(models.Model):
    livestock = models.ForeignKey(
        Livestock, 
        on_delete=models.CASCADE,
        related_name="readings"
    )

    timestamp = models.DateTimeField()
    
    geolocation = models.PointField(srid=4326)

    accel_mag_g = models.FloatField()
    ambient_temperature_c = models.FloatField()
    status = models.CharField(max_length=100, unique=True)
    alert_triggered = models.IntegerField()
    alert_low_activity = models.IntegerField()
    alert_geofence = models.IntegerField()
    alert_flee = models.IntegerField()

    def __str__(self):
        return str(self.timestamp)

   

# class Sites(models.Model):
#     name = models.CharField(max_length=100)
#     geofence = models.CharField(max_length=100)

#     def __str__(self):
#         return self.name

# class Livestock(models.Model):
#     name = models.CharField(max_length=100)
#     species = models.CharField(max_length=100)
#     site = models.ForeignKey(
#         Sites,
#         on_delete=models.CASCADE, # delete all livestock if their parent site is removed
#         related_name="livestock" # makes api design easier
#     )

#     def __str__(self):
#         return self.name

# class Readings(models.Model):
#     timestamp = models.DateTimeField()
#     livestock = models.ForeignKey(
#         Livestock,
#         on_delete=models.CASCADE,
#         related_name="readings",
#     )
#     latitude = models.FloatField()
#     longitude = models.FloatField()
#     acceleration = models.FloatField()
#     ambient_temperature = models.FloatField()
#     def __str__(self):
#         return  f"{self.livestock.name} @ {self.timestamp}"

# class Alerts(models.Model):
#     timestamp = models.DateTimeField()
#     reading = models.ForeignKey(
#         Readings,
#         on_delete=models.CASCADE,
#         related_name="alerts",
#     )
#     livestock = models.ForeignKey(
#         Livestock,
#         on_delete=models.CASCADE,
#         related_name="alerts",
#     )
#     type = models.CharField(max_length=100)
#     description = models.TextField()

#     def __str__(self):
#         return f"{self.alert_type} at {self.timestamp}"

