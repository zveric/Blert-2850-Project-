from rest_framework import serializers
from monitoring.models import User, Livestock, Readings, Alerts

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

class LivestockSerializer(serializers.HyperlinkedModelSerializer):
    readings = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        
        model = Livestock
        fields = "__all__" 

class ReadingsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Readings
        fields = "__all__" 
    
    
class AlertsSerializer(serializers.HyperlinkedModelSerializer):
    livestocks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Alerts
        fields = "__all__"