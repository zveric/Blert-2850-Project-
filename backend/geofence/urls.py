from django.urls import path
from . import views

urlpatterns = [
    #CRUD Operation Endpoints

    path('geofences/', views.GeofenceListCreateView.as_view(), name = 'geofence-list-create'),
    path('geofences/<str:site_id>/', views.GeofenceDetailView.as_view(), name = 'geofence-detail'),

    #Breach Event Hndling Enpoints
    path('geofences/breaches/', views.GeofenceBreachListView.as_view(), name = 'geofence-breach-list'),
    path('geofences/breaches/unresolved/', views.GeofenceBreachUnresolvedView.as_view(), name = 'geofence-unresolved-breach-list'),
    path('geofences/breaches/check/', views.GeofenceBreachCheckView.as_view(), name = 'geofence-breach-by-site'),
    path('geofences/breaches/livestock/<int:livestock_id>/', views.GeofenceBreachByLivestockView.as_view(), name = 'geofence-breach-by-livestock'),
    path('geofences/breaches/<int:breach_id>/resolve/', views.GeofenceBreachResolveView.as_view(), name = 'geofence-breach-resolve'),
    path('geofences/breaches/site/<str:site_id>/', views.GeofenceBreachBySiteView.as_view(), name = 'geofence-breach-by-site'),


]
