# pest_monitoring.csv

## What this is

Synthetic pest pressure and crop disease risk sensor readings from three
crop monitoring sites near Alice, Eastern Cape, South Africa. Covers
2022-01-01 to 2023-12-31 at 15-minute intervals (70,077 readings per site;
210,231 total).

Designed for the DATA Project / COMP2850 Environmental Monitoring Dashboard.
Alert thresholds calibrated against FAO Fall Armyworm IPM guidance (2018) and
the Huber & Gillespie (1992) leaf wetness disease model.

### Sites

| site_id | Description |
|---------|-------------|
| `site_maize` | Maize crop — moderate pest pressure baseline |
| `site_brassica` | Brassica crop — lowest baseline pest pressure |
| `site_orchard` | Orchard — highest baseline pest pressure |

---

## Column glossary

| Column | Unit | Sensor | What it means |
|--------|------|--------|---------------|
| `timestamp` | ISO 8601 datetime | — | 15-minute interval timestamp |
| `site_id` | string | — | Monitoring site identifier |
| `air_temperature_c` | °C | BME280 | Air temperature. Pest activity and fungal disease risk both have optimal temperature ranges. |
| `relative_humidity_pct` | % | BME280 | Relative humidity. High RH promotes leaf wetness and fungal spore germination. |
| `leaf_wetness_0_1` | dimensionless 0–1 | DFRobot leaf wetness sensor | Surface moisture on leaves. 0 = dry; 1 = fully wet. Above 0.6 = conditions suitable for fungal spore germination. |
| `light_lux` | lux | BH1750 | Ambient light. Affects photosynthesis and pest/fungal activity cycles. |
| `vibration_level` | dimensionless 0–1 | MPU6050 accelerometer | Physical disturbance of the trap mechanism. Elevated values correlate with insect activity disturbing a sensor trap. |
| `pest_trap_count` | count | Derived from trap sensor | Number of insects detected per interval. Modelled as negative binomial — expect high variance and zero-inflation during dry season. |
| `status` | normal / warning / critical | derived | Overall alert status. See alert_rules.md. |
| `alert_triggered` | 0 or 1 | derived | 1 when status is warning or critical. |
| `alert_pest_action` | 0 or 1 | derived | 1 when trap_count ≥ 5 (FAO action threshold). |
| `alert_pest_outbreak` | 0 or 1 | derived | 1 when trap_count ≥ 20 (FAO outbreak threshold). |
| `alert_disease_moderate` | 0 or 1 | derived | 1 when temperature, humidity, and leaf wetness are all in disease-risk range simultaneously. |
| `alert_disease_high` | 0 or 1 | derived | 1 when disease_moderate conditions sustained for ≥ 6 consecutive hours. |
| `wx_rain_mm_hr` | mm/hr | NASA POWER | Rainfall. Drives leaf wetness and pest population dynamics. |

---

## Keywords

**Leaf wetness** — a dimensionless measure (0–1) of surface moisture on
plant tissue. Wet leaves provide the medium for fungal spores to germinate.
The 0.6 threshold is the standard trigger point for disease risk models.

**NTU** (not used here — see water quality dataset)

**Negative binomial distribution** — the statistical model used for
pest_trap_count. It accounts for overdispersion: pest counts are highly
variable and often zero, but occasionally very high. A Poisson distribution
would underestimate the variance.

**IPM** — Integrated Pest Management. A framework that combines monitoring
(trap counts), environmental risk assessment, and targeted intervention.
The FAO FAW IPM Guide defines the 5 and 20 trap-count thresholds used here.

**FAW** — Fall Armyworm (*Spodoptera frugiperda*). A major invasive crop
pest across sub-Saharan Africa since 2016. Primarily affects maize.
The FAO 2018 IPM guide is the relevant standard for Eastern Cape conditions.

**Disease triangle** — the interaction of host (susceptible crop),
pathogen (fungal spores), and environment (temperature + humidity +
leaf wetness). All three must align for disease to occur. The
compound alert logic in this dataset reflects this model.

---

## How to load and explore

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('pest_monitoring.csv', parse_dates=['timestamp'])
df['month'] = df.timestamp.dt.month
df['wet_season'] = df.month.isin([11,12,1,2,3])

# Pest counts by season
seasonal = df.groupby(['site_id','wet_season'])['pest_trap_count'].mean().unstack()
seasonal.columns = ['Dry season','Wet season']
seasonal.plot(kind='bar', title='Mean trap count by season'); plt.show()

# Leaf wetness vs humidity
maize = df[df.site_id == 'site_maize']
maize.plot.scatter(x='relative_humidity_pct', y='leaf_wetness_0_1',
                   alpha=0.1, title='Leaf wetness vs humidity')
plt.show()

# Disease high events
dh = df[df.alert_disease_high == 1]
print(f'Disease high alerts: {len(dh)} rows ({100*len(dh)/len(df):.1f}%)')
print(f'Mean leaf wetness during disease_high: {dh.leaf_wetness_0_1.mean():.3f}')
print(f'Mean leaf wetness otherwise:           {df[df.alert_disease_high==0].leaf_wetness_0_1.mean():.3f}')
```

---

## Known characteristics

- Pest trap counts are 6× higher in wet season than dry — strong seasonal signal
- Wet season: November–March; dry: May–September
- Trap count data has high variance (negative binomial) — rolling means are
  more informative than point readings
- ~4% of rows contain NaN values (sensor dropout, LoRa packet loss)
