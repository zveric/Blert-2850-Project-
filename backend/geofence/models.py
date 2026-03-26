from django.contrib.gis.db import models
from monitoring.models import Sites

# Create your models here.
'''
2 Models Created for Geofencing 

1. Geofence: shows the geofence boundary for each farm
    - farm - references the farm where we are geofencing
    - boundary - the boundary that we are creating for the farm 
    - created_at - timestamp for when the geofence was created

2. GeofenceBreachEvent: shows geofence breach events for each farm 
    - livestock - reference which livestock breachd the geofence
    - geofence - reference which geofence was breached
    - timestamp - time of breach event
    - latitude - latitude of the breach
    - longitude - longitude of the breach
    - resolved - whether breach event is resolved (false is default) 

'''

class Geofence(models.Model): 
    sites = models.OneToOneField(Sites, on_delete=models.CASCADE, related_name= "geofence_boundary")
    boundary = models.PolygonField() 
    created_at = models.DateTimeField(auto_now_add = True) 

    def __str__(self):
        return f"Geofence for {self.site.name}"

    def contains (self, point): 
        return self.boundary.contains(point)
    

class GeofenceBreachEvent(models.Model): 
    livestock = models.ForeignKey('monitoring.Livestock', on_delete=models.CASCADE, related_name = "breaches")
    geofence = models.ForeignKey(Geofence, on_delete=models.CASCADE, related_name= 'breaches' )
    timestamp = models.DateTimeField(auto_now_add = True)
    latitude = models.FloatField() 
    Longitude = models.FloatField() 
    resolved = models.BooleanField(default = False)

    def __str__(self): 
        return f"Farm Breach by {self.livestock.name} at {self.timestamp}"