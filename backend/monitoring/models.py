from django.db import models

# Create your models here.

class Sites(models.Model):
    name = models.CharField(max_length=100)
    geofence = models.CharField(max_length=100)
    site_id = models.IntegerField()
    def __str__(self):
        return self.name
