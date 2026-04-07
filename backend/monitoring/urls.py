from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from . import models 


# https://www.django-rest-framework.org/api-guide/serializers/#specifying-which-fields-to-include
class SitesSerialiser(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Sites
        fields = "__all__"

class LivestockSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Livestock
        fields = "__all__" 

class ReadingsSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Readings
        fields = "__all__"

class AlertsSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Alerts
        fields = "__all__"


# ViewSets define the view behavior.
class SiteViewSet(viewsets.ModelViewSet):
    queryset = models.Sites.objects.all()
    serializer_class = SitesSerialiser

class LivestockViewSet(viewsets.ModelViewSet):
    queryset = models.Livestock.objects.all()
    serializer_class = LivestockSerializer

class ReadingViewSet(viewsets.ModelViewSet):
    queryset = models.Readings.objects.all()
    serializer_class = ReadingsSerializers

class AlertsViewSet(viewsets.ModelViewSet):
    queryset = models.Alerts.objects.all()
    serializer_class = AlertsSerializers

# Routers 
router = routers.DefaultRouter()
router.register(r"sites", SiteViewSet)
router.register(r"livestock", LivestockViewSet)
router.register(r"readings", ReadingViewSet)
router.register(r"alerts", AlertsViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
]