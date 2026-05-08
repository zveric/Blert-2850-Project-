from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Geofence, GeofenceBreachEvent

class GeofenceSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Geofence
        geo_field = "boundary"
        fields = ['id', 'site_id', 'boundary', 'created_at']
        read_only_fields = ['created_at']

class GeofenceBreachEventSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = GeofenceBreachEvent
        geo_field = "location"
        fields = ['id', 'livestock', 'geofence', 'timestamp', 'location', 'resolved']
        read_only_fields = ['timestamp']

