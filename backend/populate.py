import os
import pandas as pd
import django
# Used AI to see why populate.py was slowing down after a while
from django.db import transaction 

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from monitoring.models import User, Livestock, Readings, Alerts

def populate():
    PATH = r"data-project-datasets-final/synthetic_outputs/livestock_tracking.csv"

    df = pd.read_csv(PATH)
    df = df.dropna(how="any")

    user, created = User.objects.get_or_create(
        username = "admin",
        defaults = {"is_staff": True, "is_superuser": True}
    )

    with transaction.atomic():
        for x, row in df.iterrows():
            animal, created = Livestock.objects.get_or_create(
                site_id = row["site_id"],
                defaults = {"user": user}
            )
    
            reading = Readings.objects.create(
                livestock = animal,
                timestamp = row["timestamp"],
                latitude = float(row["latitude"]),
                longitude = float(row["longitude"]),
                accel_mag_g = float(row["accel_mag_g"]),
                ambient_temperature_c = float(row["ambient_temperature_c"]),
                status = row["status"]
                # alert_triggered = int(row["alert_triggered"]),
                # alert_low_activity = int(row["alert_low_activity"]),
                # alert_geofence = int(row["alert_geofence"]),
                # alert_flee = int(row["alert_flee"]) 
            ) 
    
            if row["alert_triggered"] == 1:
                Alerts.objects.create(
                    readings = reading,
                    alert_triggered = int(row["alert_triggered"]),
                    alert_low_activity = int(row["alert_low_activity"]),
                    alert_geofence = int(row["alert_geofence"]),
                    alert_flee = int(row["alert_flee"]) 
                )
    
if __name__ == "__main__":
    populate()