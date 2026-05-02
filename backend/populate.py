import os
import pandas as pd
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.gis.geos import Point
from monitoring.models import User, Livestock, Readings

def populate():
    PATH = "data-project-datasets-final\synthetic_outputs\livestock_tracking.csv"

    df = pd.read_csv(PATH)
    df = df.dropna(how="any")

    user, created = User.objects.get_or_create(
        username = "admin",
        defaults = {"is_staff": True, "is_superuser": True}
    )

    for x, row in df.iterrows():
        animal, created = Livestock.objects.get_or_create(
            site_id = row["site_id"],
            defaults = {"user": user}
        )

        Readings.objects.create(
            livestock = animal,
            timestamp = row["timestamp"],
            geolocation = Point(float(row["longitude"]), float(row["latitude"])),
            accel_mag_g = float(row["accel_mag_g"]),
            ambient_temperature_c = float(row["ambient_temperature_c"]),
            status = row["status"],
            alert_triggered = int(row["alert_triggered"]),
            alert_low_activity = int(row["alert_low_activity"]),
            alert_geofence = int(row["alert_geofence"]),
            alert_flee = int(row["alert_flee"]) 
        ) 
    
if __name__ == "__main__":
    populate()