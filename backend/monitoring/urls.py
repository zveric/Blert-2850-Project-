from django.urls import path, include
from rest_framework import routers
from monitoring.views import UserViewSet, LivestockViewSet, ReadingsViewSet, AlertsViewset
from monitoring.utils import update

# Routers 
router = routers.DefaultRouter()

router.register(r"user", UserViewSet)
router.register(r"livestock", LivestockViewSet)
router.register(r"readings", ReadingsViewSet, basename="readings")
router.register(r"alerts", AlertsViewset)


urlpatterns = [
    path("", include(router.urls)),
    path("update-database", update, name="update_database")
]