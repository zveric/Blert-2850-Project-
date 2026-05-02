from django.urls import path, include
from rest_framework import routers, serializers
from monitoring.models import User, Livestock, Readings
from monitoring.views import UserViewSet, LivestockViewSet, ReadingsViewSet
from monitoring.utils import update


class UserSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the user model in monitoring.models"""
    class Meta:
        model = User
        fields = ['email', 'password']

class LivestockSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the livestock model in monitoring.models"""
    class Meta:
        model = Livestock
        fields = "__all__" 

class ReadingsSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for the reading class in monitoring.models"""
    class Meta:
        model = Readings
        fields = "__all__" 

# Routers 
router = routers.DefaultRouter()

router.register(r"user", UserViewSet)
router.register(r"livestock", LivestockViewSet)
router.register(r"readings", ReadingsViewSet, basename="readings")


urlpatterns = [
    path("", include(router.urls)),
    path("update-database", update, name="update_database")
]