import os
import pandas as pd
import django
from datetime import datetime

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.gis.geos import Point
from monitoring.models import User, Livestock, Readings


def update(request=None):

    print("Update function triggered")
    PATH = r"..\data-project-datasets-final\synthetic_outputs\livestock_tracking.csv"

    new_lines = pd.read_csv(PATH)
    new_lines = new_lines.dropna(how="any").tail(2)

    existing_timestamps = [t.timestamp() for t in Readings.objects.values_list("timestamp", flat=True)]

    user = User.objects.get(username="admin")
    
    # print(existing_timestamps[1])
    # print(new_lines.tail)


    for x, row in new_lines.iterrows():

        row_timestamp = datetime.fromisoformat(str(row["timestamp"]))
        row_timestamp = row_timestamp.timestamp()

        if row_timestamp not in existing_timestamps:
            print("SUCCESS: Unique timestamp, reading saved")
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
        else:
            print("ERROR: Duplicate timestamp, reading skipped")

# CAUTION: Only run this if database is empty!!!
def populate(request=None):
    PATH = r"..\data-project-datasets-final\synthetic_outputs\livestock_tracking.csv"

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
