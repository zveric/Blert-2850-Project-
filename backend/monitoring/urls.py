from django.urls import path, include
from rest_framework import routers, serializers, viewsets
from monitoring.models import User, Livestock, Readings



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



# https://www.django-rest-framework.org/api-guide/serializers/#specifying-which-fields-to-include
# class SitesSerialiser(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = models.Sites
#         fields = "__all__"

# class LivestockSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = models.Livestock
#         fields = "__all__" 

# class ReadingsSerializers(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = models.Readings
#         fields = "__all__"

# class AlertsSerializers(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = models.Alerts
#         fields = "__all__"



# ViewSets define the view behavior.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LivestockViewSet(viewsets.ModelViewSet):
    queryset = Livestock.objects.all()
    serializer_class = LivestockSerializer

class ReadingsViewSet(viewsets.ModelViewSet):
    queryset = Readings.objects.all()
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