from django.shortcuts import render
from .models import Geofence, GeofenceBreachEvent
from .services import geofence_breach_check, send_breach_alert, geofence_breach_resolution, create_geofence, update_geofence, delete_geofence, get_geofence_breach_by_livestock
from rest_framework import status 
from rest_framework.decorators import api_view
from rest_framework.response import Response 

# Create your views here.

"""
This File contains the API Views for the Geofence App

1. POST - create geofence boundary 
2. PUT - update geofence boundary 
3. DELETE - delete geofence boundary 
4. GET - get geofence breach events by livestock id 
5. POST - check if a GPS reading is a breach and send out alert if needed
6. GET - list all the breach events
7. GET - list only unresolved breach events
8. POST - resolve a breach event (marked as resolved by farmer/admin) 
9. GET - get all breaches for a specific site 

"""


