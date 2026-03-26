from geofence.models import Geofence, GeofenceBreachEvent
from monitoring.models import Livestock 
from django.contrib.gis.geos import Point 

"""
functions created

1. geofence_breach_check: 
    - checks if livestock has breached the geofence boundary
    - if breach detected, creates a geofence_breach_event, returns True
2. send_breach_alert:
    - for now just print alert to console, 
    - out of MVP scope: Integrate with SMS API like Africa's Talking or Twilio 
3. geofence_breach_resolution:
    - marks breach event as resolved when breach is resolved by police, or farmer
"""
 

def geofence_breach_check(livestock, latitude, longitude) : 
    point = Point(longitude, latitude)
    geofence = Geofence.objects.get(site = livestock.site)

    if not geofence.contains(point): 
        geofence_breach_event = GeofenceBreachEvent.objects.create(
            livestock = livestock, 
            geofence = geofence, 
            latitude = latitude, 
            longitude = longitude,
            resolved = False

        ) 
        return True, geofence_breach_event # breach alert!
    
    return False, None  #no breach detected


def send_breach_alert(livestock, geofence_breach_event): 
    #create alert via SMS via Africa's Talking API or Twilio API (not implemented since not in MVP scope)
    print(f"ALERT: {livestock.name} has breached the geofence:\n"
          f"Location: ({geofence_breach_event.latitude}, {geofence_breach_event.longitude})\n"
          f"Time: {geofence_breach_event.timestamp}")


def geofence_breach_resolution(geofence_breach_id): 
    geofence_breach_event = GeofenceBreachEvent.objects.get(id=geofence_breach_id)
    geofence_breach_event.resolved = True 
    geofence_breach_event.save() 

    return geofence_breach_event 