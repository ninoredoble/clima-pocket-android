# ClimaPocket Android

> **Native Android (Kotlin & Jetpack Compose) Agrometeorological Weather & Soil Telemetry Application**  
> An offline-first mobile client engineered for Northern Mindanao agricultural cooperatives (corn, coffee, and cacao farmers) across Misamis Oriental and Mount Kitanglad.

---

## 📱 Mobile Architecture & Modern Android Stack

- **UI Framework**: Modern Declarative **Jetpack Compose** utilizing Material 3 (Material You dynamic theme surfaces).
- **Architecture Pattern**: Clean Architecture + MVI (Model-View-Intent) utilizing unidirectional data flow (`StateFlow` & `SharedFlow`).
- **Concurrency & Networking**: Kotlin Coroutines, Retrofit, and OkHttp with local SQLite/Room caching for resilient offline field operation.
- **Dependency Injection**: Koin 3.5.

---

## 🌾 Agrometeorological Capabilities

Standard consumer weather applications only report generic city-wide temperatures. **ClimaPocket** provides localized farm-level soil and micro-climate indicators:

1. **Subsurface Soil Saturation (15cm depth)**: Reports volumetric water content to prevent over-irrigation or identify root rot conditions.
2. **Soil pH Telemetry**: Tracks soil acidity to optimize crop nutrient absorption.
3. **Photosynthetic Solar Radiation ($W/m^2$)**: Direct sunlight irradiance measurements for upland shade canopy management.
4. **Fungal Spore Risk Index**: Correlates high canopy relative humidity (>80%) with ambient temperature to predict coffee rust and corn blight before outbreaks spread.
5. **Northern Mindanao Field Stations**:
   - **Claveria Highlands** (Misamis Oriental &bull; 850m ASL &bull; Corn & Coffee)
   - **Manolo Fortich** (Bukidnon Foothills &bull; 620m ASL &bull; Pineapple & Cacao)
   - **Carmen Valley** (Cagayan de Oro &bull; 25m ASL &bull; Urban Agro-Corridor)
   - **Lantapan Slopes** (Mount Kitanglad &bull; 1,120m ASL &bull; Arabica Reserve)

---

## 🚀 Running the Interactive Studio Locally

```bash
# Clone the repository
git clone https://github.com/ninoredoble/clima-pocket-android.git

# Navigate into directory
cd clima-pocket-android

# Open index.html in any browser to launch the live emulator
open index.html
```
