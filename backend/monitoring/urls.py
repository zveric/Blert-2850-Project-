from django.urls import path, include
from rest_framework import routers
from monitoring.views import UserViewSet, LivestockViewSet, ReadingsViewSet, AlertsViewset, manual_sms
from monitoring.utils import update
from rest_framework.authtoken.views import obtain_auth_token

# Routers 
router = routers.DefaultRouter()

router.register(r"user", UserViewSet)
router.register(r"livestock", LivestockViewSet)
router.register(r"readings", ReadingsViewSet, basename="readings")
router.register(r"alerts", AlertsViewset, basename="alerts")


urlpatterns = [
    path("", include(router.urls)),
    path("update-database", update, name="update_database"),
    path("sms/send/", manual_sms, name = "manual_sms"),
    
]

