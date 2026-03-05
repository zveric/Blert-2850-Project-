# livestock_tracking.csv

## What this is

Synthetic GPS location and accelerometer activity data for two livestock herds
on a farm near Alice, Eastern Cape, South Africa. Covers 2022-01-01 to
2023-12-31 at 15-minute intervals (70,077 readings per herd; 140,154 total).

Designed for the DATA Project / COMP2850 Environmental Monitoring Dashboard.
Animal behaviour model calibrated against Martiskainen et al. (2009).
Use alongside infrastructure_events.csv for gate/fence correlation analysis.

### Units

| site_id | Description |
|---------|-------------|
| `herd_cattle_A` | Cattle herd — larger geofence radius (0.004°, ~440 m) |
| `herd_goat_B` | Goat herd — slightly wider ranging (0.006°, ~660 m) |

---

## Column glossary

| Column | Unit | Sensor | What it means |
|--------|------|--------|---------------|
| `timestamp` | ISO 8601 datetime | — | 15-minute interval timestamp |
| `site_id` | string | — | Herd identifier |
| `latitude` | decimal degrees | GPS module | Animal position. Negative = southern hemisphere. |
| `longitude` | decimal degrees | GPS module | Animal position. |
| `accel_mag_g` | g (gravitational units) | MPU6050 accelerometer | Magnitude of movement. ~1.0g = resting, ~1.2g = grazing/walking, >3.5g = fleeing or struggling. |
| `ambient_temperature_c` | °C | BME280 | Air temperature at collar node. Animals reduce movement during midday heat (>28°C). |
| `status` | normal / warning / critical | derived | Overall alert status. See alert_rules.md. |
| `alert_triggered` | 0 or 1 | derived | 1 when status is warning or critical. |
| `alert_low_activity` | 0 or 1 | derived | 1 when accel < 1.08g sustained for 4 consecutive readings during active hours (06:00–20:00) only. |
| `alert_geofence` | 0 or 1 | derived | 1 when animal is outside the geofence boundary. |
| `alert_flee` | 0 or 1 | derived | 1 when accel > 3.5g — possible theft, predator, or panic event. |

---

## Keywords

**Accelerometer** — a sensor measuring acceleration in three axes (x, y, z).
The MPU6050 reports the magnitude of the combined 3D vector in units of g
(gravitational acceleration, ~9.81 m/s²). At rest, a stationary sensor reads
~1.0g due to gravity. Movement adds to this value.

**Geofence** — a virtual geographic boundary. Defined as a circular radius
around the home kraal (enclosure). A breach means the animal's GPS position
is outside the expected grazing area — not necessarily theft, but warrants
investigation.

**Kraal** — traditional Southern African livestock enclosure. Animals return
to the kraal at night. The dataset reflects this: GPS positions cluster
tightly around the kraal centre overnight and disperse during the day.

**Correlated random walk** — the movement model used for GPS positions.
Each step is influenced by the previous position (correlation), with
additional drift toward the kraal at night (attraction). Produces
realistic daily foraging patterns.

**Behaviour state machine** — the accel model. Animal behaviour is modelled
as discrete states (resting / grazing / active / fleeing) with transitions
driven by time of day and temperature. Reflects the approach of Martiskainen
et al. (2009).

---

## How to load and explore

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('livestock_tracking.csv', parse_dates=['timestamp'])
df['hour'] = df.timestamp.dt.hour

cattle = df[df.site_id == 'herd_cattle_A']

# Plot GPS track for one day
day = cattle[cattle.timestamp.dt.date == cattle.timestamp.dt.date.iloc[100]]
plt.figure(figsize=(8,8))
plt.scatter(day.longitude, day.latitude, c=day.hour, cmap='plasma', s=10)
plt.colorbar(label='Hour of day')
plt.scatter([26.840], [-32.780], marker='*', s=200, color='red', label='Kraal')
plt.title('Cattle GPS track — coloured by hour'); plt.legend(); plt.show()

# Activity by hour
accel_by_hour = cattle.groupby('hour')['accel_mag_g'].mean()
accel_by_hour.plot(kind='bar', title='Mean accelerometer magnitude by hour')
plt.axhline(1.08, color='orange', linestyle='--', label='Low-activity threshold')
plt.legend(); plt.show()

# Night vs day distance from kraal
import numpy as np
cattle['dist'] = np.sqrt((cattle.latitude + 32.780)**2 + (cattle.longitude - 26.840)**2)
night = cattle[(cattle.hour < 6) | (cattle.hour >= 19)]['dist'].mean()
day   = cattle[(cattle.hour >= 8) & (cattle.hour <= 16)]['dist'].mean()
print(f'Mean distance from kraal — night: {night:.5f}°  day: {day:.5f}°')
```

---

## Known characteristics

- GPS positions are centred on Alice, Eastern Cape (−32.780°, 26.840°)
- Animals cluster near the kraal at night; disperse during active hours
- Low-activity alert fires only during 06:00–20:00 — resting at night is
  normal and does not alert
- Flee events (accel > 3.5g) occur at ~0.1% of readings — appropriately rare
- ~5% of rows contain NaN (harsher field hardware conditions, collar charging gaps)
- Use alongside infrastructure_events.csv — correlate gate events with GPS proximity
