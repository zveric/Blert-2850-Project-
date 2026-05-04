from geofence.models import Geofence, GeofenceBreachEvent
from monitoring.models import Livestock 
from django.contrib.gis.geos import Point 
import africastalking 

"""
Core Functions for the Geofencing aspect of the Blert System 

1. geofence_breach_check: 
    - checks if livestock has breached the geofence boundary
    - if breach detected, creates a geofence_bpipreach_event, returns True
2. send_breach_alert:
    - for now just print alert to console, 
    - out of MVP scope: Integrate with SMS API like Africa's Talking or Twilio 
3. geofence_breach_resolution:
    - marks breach event as resolved when breach is resolved by police, or farmer
4 Create Geofence 
    - creating geofence for a site for a particular farm 
5. Update Geofence
    - Update geofence boundary for a site (done by admin/farmer)
6. Delete Geofence
    - Delete geofence for a site (done by admin/farmer)
7. Get Geofennce breah by livestock 
    - Get all the geofence breach per livestock (for farmers to monitor and track)

"""

def send_breach_alert(livestock, geofence_breach_event, recipient_phone_number): 
    #create alert via SMS via Africa's Talking API or Twilio API (not implemented since not in MVP scope)
    """print(f"ALERT: {livestock.site_id} has breached the geofence:\n"
          f"Location: ({geofence_breach_event.location.y}, {geofence_breach_event.location.x})\n"
          f"Time: {geofence_breach_event.timestamp}")"""
    
    username = 



def geofence_breach_resolution(geofence_breach_id): 
    geofence_breach_event = GeofenceBreachEvent.objects.get(id=geofence_breach_id)
    geofence_breach_event.resolved = True 
    geofence_breach_event.save() 
    return geofence_breach_event 


#CRUD Operations for the geofence management

def create_geofence(site_id, boundary): 
    geofence = Geofence.objects.create(site_id=site_id, boundary=boundary)
    return geofence 

def update_geofence(geofence_id, new_boundary): 
    geofence = Geofence.objects.get(id= geofence_id)
    geofence.boundary = new_boundary 
    geofence.save()
    return geofence 

def delete_geofence(geofence_id): 
    geofence = Geofence.objects.get(id = geofence_id) 
    geofence.delete() 

def get_geofence_breach_by_livestock(livestock_id): 
    breaches = GeofenceBreachEvent.objects.filter(livestock_id = livestock_id) 
    return breaches  


def geofence_breach_check(livestock, latitude, longitude) : 
    point = Point(longitude, latitude)
    geofence = Geofence.objects.get(site_id = livestock.site_id)

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

def get_all_breaches(): 
    breaches = GeofenceBreachEvent.objects.all() 
    return breaches 

def get_unresolved_breaches():
    breaches = GeofenceBreachEvent.objects.filter(resolved = False) 
    return breaches 

def get_geofence_breach_by_site(site_id): 
    breaches = GeofenceBreachEvent.objects.filter(livestock__site_id = site_id) 
    return breaches 












