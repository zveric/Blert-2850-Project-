from rest_framework import serializers
from monitoring.models import User, Livestock, Readings, Alerts

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]

class LivestockSerializer(serializers.HyperlinkedModelSerializer):
    readings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        
        model = Livestock
        fields = "__all__" 

class ReadingsSerializer(serializers.HyperlinkedModelSerializer):
    alert = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name="alerts-detail")
    class Meta:
        model = Readings
        fields = ["url", "id", "livestock", "timestamp", "latitude", "longitude", "accel_mag_g", "ambient_temperature_c", "status", "alert"]
    
    
class AlertsSerializer(serializers.HyperlinkedModelSerializer):
    readings = serializers.HyperlinkedRelatedField(many=False, read_only=True, view_name="readings-detail")
    class Meta:
        model = Alerts
        fields = "__all__"