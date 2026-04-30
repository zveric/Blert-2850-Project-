from django.urls import path, include
from rest_framework import viewsets, routers
from . import models
from monitoring.serializers import UserSerializer, LivestockSerializer, ReadingsSerializer 

# ViewSets define the view behavior.

class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = UserSerializer

class LivestockViewSet(viewsets.ModelViewSet):
    queryset = models.Livestock.objects.all()
    serializer_class = LivestockSerializer

class ReadingsViewSet(viewsets.ModelViewSet):
    serializer_class = ReadingsSerializer
    
    def get_queryset(self):
        limit = self.request.query_params.get('limit', None)
        queryset = models.Readings.objects.all()
        if limit:
            queryset = queryset[:int(limit)]
        return queryset

# Routers 
router = routers.DefaultRouter()

router.register(r"user", UserViewSet)
router.register(r"livestock", LivestockViewSet)
router.register(r"readings", ReadingsViewSet, basename="readings")

# router.register(r"sites", SiteViewSet)
# router.register(r"livestock", LivestockViewSet)
# router.register(r"readings", ReadingViewSet)
# router.register(r"alerts", AlertsViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
]