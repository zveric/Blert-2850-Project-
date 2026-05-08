from .models import *
from .services import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import status
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

quick post mvp scope incase forget: escalating alerts to farmer 

"""

class GeofenceBreachListView(APIView):

    def get(self, request) :
        breaches = get_all_breaches()
        serializer = GeofenceBreachEventSerializer(breaches, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GeofenceBreachCheckView(APIView):

    def post(self, request):
        livestock_id = request.data.get("livestock_id")
        latitude = request.data.get("Latitude")
        longitude = request.data.get("Longitude")

        if not all([livestock_id, latitude, longitude]):
            return Response(
                {"error": "Missing required fields"},
                status = status.HTTP_400_BAD_REQUEST
            )

        try:

            from monitoring.models import Livestock
            livestock = Livestock.objects.get(id = livestock_id)
            breached, event = geofence_breach_check(livestock, latitude, longitude)

            if breached:
                serializer = GeofenceBreachEventSerializer(event)
                return Response(

                {'breached': True, 'event' : serializer.data},
                serializer.dat, status = status.HTTP_201_CREATED)

            return Response(
                {"breached" : False},
                status = status.HTTP_200_OK
            )
        except Livestock.DoesNotExist:
            return Response(
                {"error": "Livestock is not founnd"},
                status = status.HTTP_404_NOT_FOUND
            )

class GeofenceBreachUnresolvedView(APIView):

    def get(self, request):
        breaches = get_unresolved_breaches()
        serializer = GeofenceBreachEventSerializer(breaches, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

class GeofenceBreachBySiteView(APIView):

    def get(self, request, site_id):
        breaches = get_geofence_breach_by_site(site_id)
        serializer = GeofenceBreachEventSerializer(breaches, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

class GeofenceBreachResolveView(APIView):

    def post (self, request, breach_id):
        try:
            event = geofence_breach_resolution(breach_id)
            serializer = GeofenceBreachEventSerializer(event)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except GeofenceBreachEvent.DoesNotExist:
            return Response(
                {"error": "Breach event not found"},
                status=status.HTTP_404_NOT_FOUND)

class GeofenceBreachByLivestockView(APIView):

    def get(self, request, livestock_id):
        breaches = get_geofence_breach_by_livestock(livestock_id)
        serializer = GeofenceBreachEventSerializer(breaches, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

class GeofenceListCreateView(APIView):

    def get(self, request):
        geofences = Geofence.objects.all()
        serializer = GeofenceSerializer(geofences, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    def post(self, request):
        serializer = GeofenceSerializer(data=request.data)
        if serializer.is_valid():
            geofence = create_geofence(
                site_id = serializer.validated_data['site_id'],
                boundary= serializer.validated_data['boundary']
            )
            return Response(GeofenceSerializer(geofence).data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


class GeofenceDetailView(APIView):

    def get(self, request, site_id):
        try:
            geofence = Geofence.objects.get(site_id = site_id)
            serializer = GeofenceSerializer(geofence)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except Geofence.DoesNotExist:
            return Response(
                {"error": "Geofence not found"},
                status = status.HTTP_404_NOT_FOUND
            )

    def put(self, request, site_id):
        try:
            geofence = Geofence.objects.get(site_id = site_id)
            serializer = GeofenceSerializer(geofence, data = request.data)
            if serializer.is_valid():
                update_geofence(geofence.id, serializer.validated_data['boundary'])
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Geofence.DoesNotExist:
            return Response(
                {"error": "Geofence not found"},
                status = status.HTTP_404_NOT_FOUND)

    def delete(self, request, site_id):
        try:
            geofence = Geofence.objects.get(site_id = site_id)
            delete_geofence(geofence.id)
            return Response(status = status.HTTP_204_NO_CONTENT)
        except Geofence.DoesNotExist:
            return Response(
                {"error": "Geofence not found"},
                status = status.HTTP_404_NOT_FOUND)
