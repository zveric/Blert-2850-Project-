from rest_framework import serializers
from monitoring.models import User, Livestock, Readings

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

class LivestockSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Livestock
        fields = "__all__" 

class ReadingsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Readings
        fields = "__all__" 