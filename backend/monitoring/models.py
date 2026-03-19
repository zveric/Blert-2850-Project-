from django.db import models

# Create your models here.

class Sites(models.Model):
    name = models.CharField(max_length=100)
    geofence = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Livestock(models.Model):
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    site = models.ForeignKey(
        Sites,
        on_delete=models.CASCADE, # delete all livestock if their parent site is removed
        related_name="livestock" # makes api design easier
    )

    def __str__(self):
        return self.name

class Readings(models.Model):
    timestamp = models.DateTimeField()
    livestock = models.ForeignKey(
        Livestock,
        on_delete=models.CASCADE,
        related_name="readings",
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    acceleration = models.FloatField()
    ambient_temperature = models.FloatField()
    def __str__(self):
        return self.timestamp

class Alerts(models.Model):
    timestamp = models.DateTimeField()
    reading = models.ForeignKey(
        Readings,
        on_delete=models.CASCADE,
        related_name="alerts",
    )
    livestock = models.ForeignKey(
        Livestock,
        on_delete=models.CASCADE,
        related_name="alerts",
    )
    type = models.CharField(max_length=100)
    description = models.TextField()




    def __str__(self):
        return f"{self.alert_type} at {self.timestamp}"