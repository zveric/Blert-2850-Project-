# security_events.csv

## What this is

Synthetic community security and emergency alert sensor readings from three
nodes covering different community spaces near Alice, Eastern Cape. Covers
2022-01-01 to 2023-12-31 at 15-minute intervals (70,077 readings per node;
210,231 total).

Multi-sensor fusion is central to this dataset: no single sensor reading
alone triggers a critical intrusion alert. This reflects best practice in
security systems and reduces false positives.

### Nodes

| site_id | Description |
|---------|-------------|
| `node_perimeter` | Outer boundary — lower baseline activity, focuses on intrusion |
| `node_interior` | Interior space — highest activity baseline, cooking/domestic events |
| `node_communal` | Shared community area — intermediate activity |

---

## Column glossary

| Column | Unit | Sensor | What it means |
|--------|------|--------|---------------|
| `timestamp` | ISO 8601 datetime | — | 15-minute interval timestamp |
| `site_id` | string | — | Node identifier |
| `motion_detected` | 0 or 1 | PIR sensor | 1 = motion detected during this interval. Peaks at morning and evening activity hours. |
| `door_open` | 0 or 1 | Reed switch | 1 = door or window opened during this interval. |
| `vibration_level` | dimensionless 0–1 | DFRobot vibration sensor | Physical shock or vibration on the structure. Low baseline; elevated during breach events. |
| `smoke_ppm` | ppm (proxy) | MQ135 gas sensor | Airborne particles proxy. Elevated during cooking; very high during fire events. Not a calibrated smoke detector — see note below. |
| `sound_db` | dB (proxy) | DFRobot sound sensor | Ambient sound level. Elevated during activity hours and during distress events. |
| `light_lux` | lux | BH1750 | Ambient light level. Used to contextualise night vs day for alert logic. |
| `flame_detected` | 0 or 1 | DFRobot flame sensor | 1 = infrared flame signature detected. Rare; always correlates with very high smoke_ppm. |
| `panic_triggered` | 0 or 1 | DFRobot panic button | 1 = manual distress signal activated. Extremely rare; always critical. |
| `status` | normal / warning / critical | derived | Overall alert status. See alert_rules.md. |
| `alert_triggered` | 0 or 1 | derived | 1 when status is warning or critical. |
| `alert_intrusion` | 0 or 1 | derived | 1 when motion AND door AND vibration > 0.5 AND night (multi-sensor fusion). |
| `alert_fire` | 0 or 1 | derived | 1 when smoke > 200 ppm OR flame_detected = 1. |
| `alert_distress` | 0 or 1 | derived | 1 when panic_triggered = 1. |
| `alert_motion_night` | 0 or 1 | derived | 1 when motion detected between 22:00 and 06:00 (warning level only). |
| `alert_smoke` | 0 or 1 | derived | 1 when smoke_ppm > 35 (warning level). |
| `wx_temp_c` | °C | NASA POWER | Ambient air temperature (weather backbone). |

---

## Keywords

**PIR** — Passive Infrared sensor. Detects changes in infrared radiation
caused by moving warm bodies (people, animals). The sensor is "passive"
because it detects rather than emits radiation.

**Reed switch** — magnetic contact sensor used to detect door or window
opening. See infrastructure_events.csv glossary.

**MQ135** — a gas sensor that responds to a range of gases including ammonia,
benzene, CO₂, and smoke particles. It is not a dedicated smoke detector —
smoke_ppm values are a proxy, not a calibrated reading. Do not use for
life-safety decisions in a real deployment without a certified sensor.

**Sensor fusion** — combining multiple sensor signals to make a more reliable
decision than any single sensor could provide. The intrusion alert requires
motion + door + vibration + night simultaneously. Each signal alone could be
a false positive; together they constitute strong evidence.

**False positive** — an alert that fires when no real event occurred. Single-
sensor systems have high false positive rates. Fusion reduces this at the cost
of some sensitivity (it may miss events where only some sensors trigger).

**Bimodal distribution** — motion events follow a bimodal pattern: two peaks
per day (morning activity, evening activity) with lower rates overnight and
at midday. This reflects typical domestic and community activity rhythms.

---

## How to load and explore

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('security_events.csv', parse_dates=['timestamp'])
df['hour'] = df.timestamp.dt.hour

interior = df[df.site_id == 'node_interior']

# Motion pattern by hour
motion_by_hour = interior.groupby('hour')['motion_detected'].mean()
motion_by_hour.plot(kind='bar', title='Motion detection rate by hour — interior node')
plt.xlabel('Hour of day'); plt.ylabel('Proportion of intervals with motion')
plt.show()

# Smoke pattern — cooking hours clearly visible
smoke_by_hour = interior.groupby('hour')['smoke_ppm'].mean()
smoke_by_hour.plot(title='Mean smoke_ppm by hour — interior node')
plt.axhline(35,  color='orange', linestyle='--', label='Warning (35 ppm)')
plt.axhline(200, color='red',    linestyle='--', label='Critical (200 ppm)')
plt.legend(); plt.show()

# Fire events: flame always accompanies very high smoke
fire = df[df.flame_detected == 1]
print(f'Fire events: {len(fire)} rows')
print(f'Mean smoke during flame events:     {fire.smoke_ppm.mean():.0f} ppm')
print(f'Mean smoke during non-flame events: {df[df.flame_detected==0].smoke_ppm.mean():.0f} ppm')

# Alert rate by node
df.groupby('site_id')['status'].value_counts(normalize=True).unstack().round(3)
```

---

## Known characteristics

- Motion follows a bimodal daily pattern — morning and evening peaks ~2.4×
  midday rate, ~24× deep night rate (01:00–05:00)
- Smoke is 6× higher during cooking hours than other times
- Intrusion alerts only fire at night (19:00–06:00) by design
- Panic button rate: ~0.006% of readings — extremely rare
- Flame/smoke correlation is strong: mean smoke during flame events ~400 ppm
  vs ~25 ppm otherwise
- ~2% of rows contain NaN (indoor/fixed hardware is reliable; small dropout
  from power cuts / LoRa packet loss)
