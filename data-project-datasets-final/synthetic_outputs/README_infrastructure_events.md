# infrastructure_events.csv

## What this is

Synthetic event log for a fixed farm gate and perimeter fence monitoring
node near Alice, Eastern Cape, South Africa. Covers 2022-01-01 to 2023-12-31
at 15-minute intervals (70,077 rows).

This is boolean event data, not continuous sensor readings. It records
discrete events (gate opened, fence disturbed) rather than environmental
measurements. Use alongside livestock_tracking.csv — correlating gate
events with animal GPS positions is a useful analysis task.

### Node

| site_id | Description |
|---------|-------------|
| `infrastructure_gate` | Farm gate and perimeter fence monitoring node |

---

## Column glossary

| Column | Unit | Sensor | What it means |
|--------|------|--------|---------------|
| `timestamp` | ISO 8601 datetime | — | 15-minute interval timestamp |
| `site_id` | string | — | Always `infrastructure_gate` |
| `ambient_temperature_c` | °C | BME280 | Air temperature at the gate node. |
| `gate_open_event` | 0 or 1 | Reed switch | 1 = gate was opened during this interval. Normal during working hours; suspicious at night. |
| `fence_breach_event` | 0 or 1 | Vibration sensor (MPU6050) | 1 = significant vibration detected on perimeter fence — possible intrusion or animal pressure. |
| `vibration_level` | dimensionless 0–1 | MPU6050 | Continuous vibration magnitude. Low baseline; elevated values correlate with breach events. |
| `status` | normal / warning / critical | derived | warning = gate opened at night; critical = fence breach. |
| `alert_triggered` | 0 or 1 | derived | 1 when status is warning or critical. |
| `alert_gate_night` | 0 or 1 | derived | 1 when gate_open_event = 1 during night hours (before 06:00 or after 19:00). |
| `alert_fence_breach` | 0 or 1 | derived | 1 when fence_breach_event = 1. Always triggers critical status. |

---

## Keywords

**Reed switch** — a simple magnetic contact sensor. When a magnet (attached
to the gate) moves away from the switch (attached to the gate post), the
circuit opens and an event is recorded. Highly reliable, low power consumption.

**Vibration sensor** — detects physical shock or vibration on the fence
structure. Can be triggered by an animal leaning on the fence, a person
climbing it, or wind-induced movement. Elevated vibration is necessary but
not always sufficient evidence of a breach — correlate with other signals.

**Poisson process** — the statistical model for gate events. Gate openings
occur at random but at a predictable average rate, peaked at dawn and dusk
(farm working hours). The Poisson model captures this structure.

---

## How to load and explore

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('infrastructure_events.csv', parse_dates=['timestamp'])
df['hour'] = df.timestamp.dt.hour

# Gate event pattern by hour
gate_by_hour = df.groupby('hour')['gate_open_event'].mean()
gate_by_hour.plot(kind='bar', title='Gate open events by hour of day')
plt.xlabel('Hour'); plt.ylabel('Proportion of intervals with gate event')
plt.show()

# Cross-reference with livestock GPS
ls = pd.read_csv('livestock_tracking.csv', parse_dates=['timestamp'])
import numpy as np
ls['dist'] = np.sqrt((ls.latitude + 32.780)**2 + (ls.longitude - 26.840)**2)

# Merge on timestamp for cattle
cattle = ls[ls.site_id == 'herd_cattle_A'][['timestamp','dist']].copy()
merged = df.merge(cattle, on='timestamp', how='inner')

near_gate = merged[merged.alert_gate_night == 1]['dist'].mean()
no_alert  = merged[merged.alert_gate_night == 0]['dist'].mean()
print(f'Mean cattle distance from kraal during night gate events: {near_gate:.4f}°')
print(f'Mean cattle distance otherwise:                           {no_alert:.4f}°')
```

---

## Known characteristics

- Gate events are bimodal: higher probability at dawn (06:00–08:00) and
  dusk (17:00–19:00) reflecting farm working hours
- Fence breach events are rare (~0.1% of intervals) but always alert
- ~1% of rows contain NaN (fixed hardware is more reliable than field units)
- This file deliberately has a minimal schema — it is an event log,
  not a sensor stream
