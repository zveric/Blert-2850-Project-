from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from monitoring.utils import update
from monitoring.models import User, Livestock, Readings, Alerts
from monitoring.serializers import UserSerializer, LivestockSerializer, ReadingsSerializer, AlertsSerializer


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
        timestamp_query = self.request.query_params.get("timestamp")
        livestock_query = self.request.query_params.get("livestock")
        limit = self.request.query_params.get("limit", None)
        start_time = self.request.query_params.get("start_time", None) 
        end_time = self.request.query_params.get("end_time", None) 
        queryset = Readings.objects.all()

        if livestock_query:
            queryset = Readings.objects.filter(livestock=livestock_query)
        else:
            queryset = Readings.objects.all()

        if start_time: 
            queryset = queryset.filter(timestamp__gte=start_time) 

        if end_time:
            queryset = queryset.filter(timestamp__lte = end_time) 

        queryset = queryset.order_by('-timestamp')


        if limit:
            queryset = queryset[:int(limit)]

        return queryset
    
class AlertsViewset(viewsets.ModelViewSet):
    queryset = Alerts.objects.all()
    serializer_class = AlertsSerializer

@api_view(['GET'])
def update_database(request):
    try:
        update()
        return Response({
            "status": "Success",
            "message": "Checking if the readings are unique"
        })
    except Exception as e:
        return Response({"status": "Failure", "error": str(e)}, status=500)
    
# @api_view(['GET'])
# def populate_database(request):
#     try:
#         populate()
#         return Response({
#             "status": "Success",
#             "message": "Populating the database"
#         })
#     except Exception as e:
#         return Response({"status": "Failure", "error": str(e)}, status=500)