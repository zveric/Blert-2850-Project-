# Gemini was used to research documentation for query_params, api_view
import os
import pandas as pd
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from monitoring.utils import update
from monitoring.models import User, Livestock, Readings, Alerts
from monitoring.serializers import UserSerializer, LivestockSerializer, ReadingsSerializer, AlertsSerializer
from monitoring.services import send_sms
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from django.http import FileResponse # Used Claude to research docs for sending a file through the api

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

    # used Gemini to understand get_queryset and query_params work 
    def get_queryset(self):
        livestock_query = self.request.query_params.get("livestock")
        limit = self.request.query_params.get("limit", None)
        start_time = self.request.query_params.get("start_time", None)
        end_time = self.request.query_params.get("end_time", None)
        queryset = Readings.objects.all()

        # Used to Gemini to find docs about objects filter options that are built in
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
        return Response({"status": "Success", "message": "Updated"})
    except Exception as e:
        return Response({"status": "Failure", "error": str(e)}, status=500)


@api_view(['POST'])
def manual_sms(request):

    phone_number = request.data.get('phone_number')
    message = request.data.get('message')

    if not phone_number or not message:
        return Response ({'error': 'phone_number and message are required'}, status = 400)

    try:
        response = send_sms(phone_number, message)
        return Response({'status': 'SMS sent', 'response': str(response)})
    except Exception as e:
        print(f"SMS Error: {e}")
        return Response ({'error': str(e)}, status = 500 )

# Used Gemini to understand the documentation for permission classes
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created'}, status=201)

# Used Claude to read docs for sending over a file through RestAPI
@api_view(['GET'])
def download_csv(request):
    path = r"..\data-project-datasets-final\synthetic_outputs\livestock_tracking.csv"

    if not os.path.exists(path):
        return Response({"error": "File not found"}, status=404)

    df = pd.read_csv(path)
    df = df.dropna(how="any")

    export_file_path = r"export_file.csv"
    df.to_csv(export_file_path, index=False)

    return FileResponse(open(export_file_path, "rb"), as_attachment=True, filename="export_file.csv")

