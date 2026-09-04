# ClimaPocket Android

> Offline-First Agrometeorological Telemetry & Material You 3.5 Dynamic Studio for Northern Mindanao Agricultural Cooperatives.

ClimaPocket Android is an agrometeorological decision-support system built for smallholder farmers, agronomists, and agricultural cooperatives across Bukidnon, Misamis Oriental, and the Cagayan Corridor. It pairs offline-first edge caching with FAO-56 Penman-Monteith physics to calculate reference evapotranspiration ($ET_0$), aerial chemical spray drift thresholds, and fungal pathogen risks directly on device.

---

## Technical Stack & Architecture

- **Operating System Target:** Android 15 (Vanilla Ice Cream / API Level 35)
- **UI Framework:** Jetpack Compose 1.7 with Material Design 3.5 Dynamic Color Theming
- **State Management:** Kotlin Coroutines `StateFlow` and MVI Architecture
- **Local Persistence:** Room Database 2.6.1 (Offline-First SQLite Cache with WAL mode)
- **Physics Engine:** FAO Irrigation and Drainage Paper No. 56 Penman-Monteith Model
- **Target Device Emulation:** Google Pixel 9 Pro Ergonomic Unibody Chassis

---

## Core Capabilities

### 1. Northern Mindanao Agrometeorological Field Network
Telemetry node monitoring across 5 topographically distinct microclimates:
- **Claveria Highland Station (Elev. 980m):** High-elevation Bukidnon volcanic plateau supporting Arabica coffee and sweet corn.
- **Manolo Fortich Foothills (Elev. 650m):** Del Monte pineapple basin and cacao agroforestry terraces.
- **Carmen Valley Floodplain (Elev. 25m):** Lowland Cagayan alluvial citrus and vegetable riverbanks.
- **Malaybalay High Plain (Elev. 622m):** Central high valley sugarcane and coffee tracts.
- **Maramag Irrigation Basin (Elev. 340m):** Lowland Pulangi River watershed paddy rice irrigation network.

### 2. FAO-56 Penman-Monteith Evapotranspiration Calculator
Computes daily reference crop evapotranspiration ($ET_0$, mm/day) incorporating:
- Slope of saturation vapor pressure curve ($\Delta$)
- Psychrometric constant ($\gamma = 0.066\text{ kPa/}^\circ\text{C}$)
- Net solar irradiance ($R_s \to R_n$)
- Wind velocity at 2-meter canopy height ($u_2$)
- Vapor pressure deficit ($e_s - e_a$)

### 3. Pesticide Chemical Spray & Drift Advisory
Evaluates canopy wind velocity and relative humidity against safety thresholds:
- **Optimal Safe Window ($1.5 \le u_2 \le 3.5\text{ m/s}$):** Low droplet drift risk with optimal foliar deposition.
- **Stagnant Warning ($u_2 < 1.5\text{ m/s}$):** Thermal inversion trapping droplets.
- **Elevated / Unsafe Drift ($u_2 > 3.5\text{ m/s}$):** High aerodynamic displacement exceeding buffer margins.

### 4. Room SQLite Offline Telemetry Cache
Allows agronomists in deep mountain valleys without cellular signals to query historical weather observations, calculate localized moisture deficits, and sync records when connectivity is restored.

---

## Telemetry Data Format

ClimaPocket generates standard JSON telemetry records compatible with cooperative management information systems:

```json
{
  "protocol": "CLIMAPOCKET-M3-ANDROID-15",
  "version": "1.7.0",
  "station": {
    "id": "STN-MIN-01",
    "name": "Claveria Highland Station",
    "elevation_meters": 980,
    "cooperative": "NORTHERN MIN-COOP",
    "primary_crop": "Arabica Coffee & Sweet Corn"
  },
  "telemetry": {
    "ambient_temp_celsius": 22.4,
    "relative_humidity_pct": 88,
    "wind_velocity_mps": 2.1,
    "solar_radiation_mj_m2": 18.5
  },
  "agrometeorology_fao56": {
    "et0_evapotranspiration_mm_day": 3.42,
    "soil_moisture_deficit_mm": 14.2,
    "spray_drift_risk": "OPTIMAL SAFE",
    "drift_index_ratio": 0.42,
    "fungal_blight_risk": "ELEVATED (BLIGHT RISK)"
  }
}
```

---

## License & Attribution

Designed and engineered for agricultural cooperative deployment in Northern Mindanao. Distributed under the MIT License.