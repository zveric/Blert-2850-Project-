# soil_monitoring.csv

## What this is

Synthetic soil condition sensor readings from three agricultural monitoring
sites near Alice, Eastern Cape, South Africa. Covers 2022-01-01 to 2023-12-31
at 15-minute intervals (70,077 readings per site; 210,231 total).

Designed for the DATA Project / COMP2850 Environmental Monitoring Dashboard.
Calibrated against FAO irrigation guidance (Papers 56 and 61) and real NASA
POWER weather for the location.

### Sites

| site_id | Description |
|---------|-------------|
| `site_riverside` | Adjacent to river — higher moisture baseline, good drainage |
| `site_hillside` | Elevated ground — driest site, most dynamic moisture variation |
| `site_irrigated` | Irrigated field — highest baseline EC due to irrigation inputs |

---

## Column glossary

| Column | Unit | Sensor | What it means |
|--------|------|--------|---------------|
| `timestamp` | ISO 8601 datetime | — | 15-minute interval timestamp |
| `site_id` | string | — | Monitoring site identifier |
| `soil_moisture_vwc` | fraction 0.0–1.0 | Capacitive soil moisture sensor | Volumetric water content — the fraction of soil volume that is water. Multiply by 100 for percentage. 0.28 = 28% VWC. |
| `soil_ph` | pH units | DFRobot pH probe | Acidity of the soil. Most crops prefer 5.5–7.5. Below 5.5 = acidic; nutrient availability and microbial activity are affected. |
| `soil_ec_uS_cm` | µS/cm | DFRobot conductivity probe | Soil salinity. Rises as soil dries (salts concentrate). Inverse relationship with soil moisture. |
| `air_temperature_c` | °C | BME280 | Ambient air temperature at the sensor node. |
| `relative_humidity_pct` | % | BME280 | Relative humidity at the sensor node. |
| `pressure_hPa` | hPa | BME280 | Atmospheric pressure. Useful for evapotranspiration calculations. |
| `light_lux` | lux | BH1750 | Solar radiation proxy. Used in evapotranspiration estimation — higher light = more water lost from soil surface. |
| `status` | normal / warning / critical | derived | Overall alert status. See alert_rules.md. |
| `alert_triggered` | 0 or 1 | derived | 1 when status is warning or critical. |
| `stress_moisture` | 0 or 1 | derived | 1 when soil moisture below 14% or above 45% VWC. |
| `stress_ph` | 0 or 1 | derived | 1 when soil pH outside 5.5–7.5. |
| `stress_salinity` | 0 or 1 | derived | 1 when soil EC above 800 µS/cm. |
| `stress_critical` | 0 or 1 | derived | 1 when any critical threshold is exceeded. |
| `wx_rain_mm_hr` | mm/hr | NASA POWER | Rainfall rate. Soil moisture rises after rain events and decays exponentially during dry periods. |

---

## Keywords

**VWC** — Volumetric Water Content. The standard unit for soil moisture
expressed as a fraction of total soil volume occupied by water.
0.0 = bone dry; typical field capacity is 0.25–0.45 depending on soil type.

**Field capacity** — the moisture level a soil holds after excess water has
drained away, typically 24–48 hours after heavy rain. The upper end of the
optimal range for most crops.

**Wilting point** — the moisture level below which plants can no longer
extract water from the soil. Crops begin to wilt irreversibly below this point.
Approximately 0.08–0.12 VWC depending on soil type.

**EC (soil)** — electrical conductivity of the soil solution. Rises as water
evaporates and salts concentrate. High EC (salinity) inhibits water uptake by
plants even when moisture is physically present.

**Evapotranspiration** — the combined loss of water from soil evaporation and
plant transpiration. Driven by temperature, humidity, wind, and solar radiation.
BME280 + BH1750 together give the inputs for the FAO Penman-Monteith model.

**FAO Paper 56** — the FAO reference for crop water requirements and soil
moisture management thresholds. The benchmark for moisture and stress alerts.

---

## How to load and explore

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('soil_monitoring.csv', parse_dates=['timestamp'])

# One site
hill = df[df.site_id == 'site_hillside'].set_index('timestamp')

# Soil moisture with rain overlay
fig, ax1 = plt.subplots(figsize=(14, 5))
ax1.plot(hill.index, hill['soil_moisture_vwc'], label='Soil moisture (VWC)', color='blue')
ax1.axhline(0.14, color='orange', linestyle='--', label='Warning threshold')
ax1.axhline(0.08, color='red',    linestyle='--', label='Critical threshold')
ax2 = ax1.twinx()
ax2.bar(hill.index, hill['wx_rain_mm_hr'], color='lightblue', alpha=0.4, label='Rain')
ax1.legend(loc='upper left'); ax2.legend(loc='upper right')
plt.title('Hillside soil moisture with rainfall'); plt.show()

# EC vs moisture inverse relationship
import numpy as np
riv = df[df.site_id == 'site_riverside']
r = riv[['soil_moisture_vwc','soil_ec_uS_cm']].corr().iloc[0,1]
print(f'EC / moisture correlation: r = {r:.3f}')  # expect ~ -0.5

# Compare sites
df.groupby('site_id')[['soil_moisture_vwc','soil_ph','soil_ec_uS_cm']].mean().round(3)
```

---

## Known characteristics

- Soil moisture below 14% VWC is not reached in this 2022–23 dataset — the
  Eastern Cape experienced an unusually wet period. The stress threshold is
  correctly encoded; it simply does not trigger. Your dashboard should handle
  zero-alert periods gracefully.
- Soil EC and moisture are inversely correlated (r ≈ −0.5) by design
- Wet season (November–March) shows slightly lower pH due to acidification
- ~4% of rows contain NaN values (probe fouling, LoRa dropout)
