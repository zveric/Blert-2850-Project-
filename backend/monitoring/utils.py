# Gemini was used to research documentation for Django and RestAPI
import os
import pandas as pd
import django
from datetime import datetime

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from monitoring.models import User, Livestock, Readings, Alerts

PATH = r"..\data-project-datasets-final\synthetic_outputs\livestock_tracking.csv"
UPDATE_CHECK = r"update_check.txt"


def update(request=None):

    def update_required():
        if not os.path.exists(UPDATE_CHECK):
            with open(UPDATE_CHECK, "w") as f:
                f.write(datetime.now().isoformat())
            return True

        with open(UPDATE_CHECK, "r") as f:
            last_check = f.read().strip()

        last_check_date = datetime.fromisoformat(last_check)

        csv_modified_date = datetime.fromtimestamp(os.path.getmtime(PATH))

        return csv_modified_date > last_check_date


    print("Update function triggered")
    if not update_required():
        print("Already up to date")
        return 0        

    new_lines = pd.read_csv(PATH)
    new_lines = new_lines.dropna(how="any").tail(2)

    existing_timestamps = [t.timestamp() for t in Readings.objects.values_list("timestamp", flat=True)]

    user = User.objects.first()
    
    print(existing_timestamps[1])
    print(new_lines.tail)


    for x, row in new_lines.iterrows():

        row_timestamp = datetime.fromisoformat(str(row["timestamp"]))
        row_timestamp = row_timestamp.timestamp()

        if row_timestamp not in existing_timestamps:
            print("SUCCESS: Unique timestamp, reading saved")
            animal, created = Livestock.objects.get_or_create(
                site_id = row["site_id"],
                defaults = {"user": user}
            )

            reading = Readings.objects.create(
                livestock = animal,
                timestamp = row["timestamp"],
                longitude = row["longitude"],
                latitude = row["latitude"],
                accel_mag_g = float(row["accel_mag_g"]),
                ambient_temperature_c = float(row["ambient_temperature_c"]),
                status = row["status"],
            )

            if row["alert_triggered"] == 1:
                Alerts.objects.create(
                    readings = reading,
                    alert_triggered = int(row["alert_triggered"]),
                    alert_low_activity = int(row["alert_low_activity"]),
                    alert_geofence = int(row["alert_geofence"]),
                    alert_flee = int(row["alert_flee"]) 
                )
        else:
            print("ERROR: Duplicate timestamp, reading skipped")
    with open(UPDATE_CHECK, "w") as f:
        f.write(datetime.now().isoformat())