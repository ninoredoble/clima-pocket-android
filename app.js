// ClimaPocket Android — Pixel 9 Pro Dynamic Material You Controller

const STATIONS = {
  "claveria": {
    name: "Claveria Highlands",
    sub: "Misamis Oriental • 850m ASL • Corn & Arabica",
    temp: "24°",
    cond: "Scattered Monsoon Clouds",
    icon: "⛅",
    highLow: "High: 28° • Low: 19°",
    precip: "Precipitation: 65% Expected",
    moist: "78.4%",
    moistWidth: 78,
    ph: "6.2 pH",
    solar: "640 W/m²",
    humidity: "84%",
    spore: "Optimal soil nitrogen retention",
    // Material You Dynamic Theme: Highland Forest Sage
    theme: {
      bg: "#f4f7f4",
      surface: "#ffffff",
      surfaceTonal: "#e3ede4",
      surfaceVariant: "#d4e2d6",
      primary: "#235336",
      primaryContainer: "#c4ebd0",
      headline: "#122117",
      body: "#3e5244",
      dim: "#6d8274"
    },
    compose: `@Composable
fun ClaveriaHighlandsScreen(viewModel: AgroViewModel) {
    val state by viewModel.highlandTelemetry.collectAsStateWithLifecycle()
    Scaffold(
        bottomBar = { AgroBottomNavigation(selected = Tab.Field) }
    ) { padding ->
        LazyColumn(contentPadding = padding) {
            item {
                HeroWeatherCard(
                    temp = state.ambientTemp,
                    condition = state.monsoonCondition,
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                )
            }
            item {
                SoilTelemetryCard(
                    moisturePct = state.soilSaturation,
                    phLevel = state.soilAcidity
                )
            }
        }
    }
}`
  },

  "manolo": {
    name: "Manolo Fortich",
    sub: "Bukidnon Foothills • 620m ASL • Cacao & Pineapple",
    temp: "27°",
    cond: "High Solar Irradiance",
    icon: "☀️",
    highLow: "High: 31° • Low: 22°",
    precip: "Precipitation: 15% Expected",
    moist: "62.1%",
    moistWidth: 62,
    ph: "5.8 pH",
    solar: "890 W/m²",
    humidity: "68%",
    spore: "Low fungal blight risk",
    // Material You Dynamic Theme: Warm Terracotta / Pineapple Amber
    theme: {
      bg: "#fdf8f4",
      surface: "#ffffff",
      surfaceTonal: "#faece1",
      surfaceVariant: "#f4ded0",
      primary: "#853e18",
      primaryContainer: "#ffdcc9",
      headline: "#2a160d",
      body: "#5c3d2e",
      dim: "#8a6a59"
    },
    compose: `@Composable
fun ManoloFortichAgroDossier(data: CanopyTelemetry) {
    ElevatedCard(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Text("Bukidnon Solar Flux: \${data.solarWatts} W/m²")
            PhotosyntheticEfficiencyGauge(ratio = data.solarFluxRatio)
        }
    }
}`
  },

  "cdo-carm": {
    name: "Carmen Valley (CDO)",
    sub: "Cagayan de Oro • 25m ASL • Urban Agro-Corridor",
    temp: "31°",
    cond: "Humid Tropical Canopy",
    icon: "🌤️",
    highLow: "High: 33° • Low: 25°",
    precip: "Precipitation: 40% Rain Chance",
    moist: "55.8%",
    moistWidth: 56,
    ph: "6.6 pH",
    solar: "780 W/m²",
    humidity: "79%",
    spore: "Moderate urban micro-climate heat index",
    // Material You Dynamic Theme: River Sand / Citrus Gold
    theme: {
      bg: "#fcf9f2",
      surface: "#ffffff",
      surfaceTonal: "#f5edd9",
      surfaceVariant: "#ede0c2",
      primary: "#6b5416",
      primaryContainer: "#f6e4a8",
      headline: "#231b08",
      body: "#524422",
      dim: "#7d6f4d"
    },
    compose: `@Composable
fun CarmenValleyUrbanNode(feed: UrbanSensorStream) {
    Card(
        shape = MaterialTheme.shapes.large,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.WaterDrop, contentDescription = null)
            Text("River Basin Water Table: \${feed.waterTableMeters}m")
        }
    }
}`
  },

  "lantapan": {
    name: "Lantapan Slopes",
    sub: "Mount Kitanglad • 1,120m ASL • Highland Arabica",
    temp: "20°",
    cond: "Mountain Mist & Drizzle",
    icon: "🌧️",
    highLow: "High: 23° • Low: 16°",
    precip: "Precipitation: 90% Continuous",
    moist: "91.2%",
    moistWidth: 91,
    ph: "6.0 pH",
    solar: "420 W/m²",
    humidity: "96%",
    spore: "High fungal spore risk (Rust Alert)",
    // Material You Dynamic Theme: Alpine Teal / Kitanglad Slate
    theme: {
      bg: "#f2f7f9",
      surface: "#ffffff",
      surfaceTonal: "#dceaf0",
      surfaceVariant: "#cadfe8",
      primary: "#1d586d",
      primaryContainer: "#c2e9f6",
      headline: "#0a1e26",
      body: "#324d57",
      dim: "#5c7984"
    },
    compose: `@Composable
fun KitangladHighlandSlope(state: HighlandState) {
    Surface(
        color = MaterialTheme.colorScheme.primaryContainer,
        shape = RoundedCornerShape(28.dp)
    ) {
        AgroAlertBanner(
            risk = SporeRisk.HIGH,
            elevationMeters = 1120,
            onRemediationClick = { state.dispatchFungicideAlert() }
        )
    }
}`
  }
};

let currentStationKey = "claveria";

document.addEventListener("DOMContentLoaded", () => {
  renderStation(currentStationKey);
});

function switchStudioTab(tabId, el) {
  document.querySelectorAll(".s-tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

  el.classList.add("active");
  document.getElementById(`pane-${tabId}`).classList.add("active");
}

function selectStation(key, cardEl) {
  currentStationKey = key;

  document.querySelectorAll(".station-card").forEach(c => c.classList.remove("active"));
  if (cardEl) {
    cardEl.classList.add("active");
  }

  renderStation(key);
}

function renderStation(key) {
  const data = STATIONS[key];
  if (!data) return;

  // Apply Material You Theme Variables dynamically to screen
  const screen = document.getElementById("pixelScreen");
  screen.style.setProperty("--m3-bg", data.theme.bg);
  screen.style.setProperty("--m3-surface", data.theme.surface);
  screen.style.setProperty("--m3-surface-tonal", data.theme.surfaceTonal);
  screen.style.setProperty("--m3-surface-variant", data.theme.surfaceVariant);
  screen.style.setProperty("--m3-primary", data.theme.primary);
  screen.style.setProperty("--m3-primary-container", data.theme.primaryContainer);
  screen.style.setProperty("--m3-text-headline", data.theme.headline);
  screen.style.setProperty("--m3-text-body", data.theme.body);
  screen.style.setProperty("--m3-text-dim", data.theme.dim);

  // Update Screen Content
  document.getElementById("phoneStnTitle").innerText = data.name;
  document.getElementById("phoneStnSub").innerText = data.sub;
  document.getElementById("phoneTemp").innerText = data.temp;
  document.getElementById("phoneCondition").innerText = data.cond;
  document.getElementById("phoneIcon").innerText = data.icon;
  document.getElementById("phoneHighLow").innerText = data.highLow;
  document.getElementById("phonePrecip").innerText = data.precip;
  document.getElementById("phoneMoisture").innerText = data.moist;
  document.getElementById("phoneMoistureBar").style.width = `${data.moistWidth}%`;
  document.getElementById("phonePH").innerText = data.ph;
  document.getElementById("phoneSolar").innerText = data.solar;
  document.getElementById("phoneHumidity").innerText = data.humidity;
  document.getElementById("phoneSpore").innerText = data.spore;

  // Update Compose Code View
  document.getElementById("composeSourceView").innerText = data.compose;
}

function triggerRefreshAnim() {
  const btn = document.querySelector(".phone-action-btn");
  btn.style.transform = "rotate(360deg)";
  setTimeout(() => {
    btn.style.transform = "none";
    renderStation(currentStationKey);
  }, 350);
}
