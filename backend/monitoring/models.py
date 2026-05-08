from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
# https://docs.djangoproject.com/en/6.0/topics/auth/customizing/

class User(AbstractUser):
    """Using Django provided class"""

class Livestock(models.Model):
    """Livestock class to hold all the reading data related to the different herds"""
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
    """Using Readings class to hold all the readings data for each of the herds"""
    livestock = models.ForeignKey(
        Livestock,
        on_delete=models.CASCADE,
        related_name="readings"
    )

    timestamp = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    accel_mag_g = models.FloatField()
    ambient_temperature_c = models.FloatField()
    status = models.CharField(max_length=100)

    def __str__(self):
        return str(self.timestamp)

class Alerts(models.Model):
    """Using Alerts class to hold the alerts and the timestamp id for each of the herds"""
    readings = models.OneToOneField(
        Readings,
        on_delete=models.CASCADE,
        related_name="alert"
    )
    alert_triggered = models.IntegerField()
    alert_low_activity = models.IntegerField()
    alert_geofence = models.IntegerField()
    alert_flee = models.IntegerField()
