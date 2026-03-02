// ClimaPocket Android — Architecture Simulation & State Controller

const STATIONS = {
  "claveria": {
    name: "Claveria Highlands",
    prov: "Misamis Oriental • 850m ASL • Corn & Coffee",
    temp: "24°",
    condition: "Scattered Monsoon Clouds",
    icon: "⛅",
    highLow: "High: 28° • Low: 19°",
    precip: "Precipitation: 65% Expected",
    moisture: "78.4%",
    moistureWidth: 78,
    ph: "6.2 pH",
    solar: "640 W/m²",
    humidity: "84%",
    composable: `@Composable
fun ClaveriaHighlandsScreen(viewModel: ClimaViewModel) {
    val telemetry by viewModel.claveriaStream.collectAsStateWithLifecycle()
    Scaffold(
        bottomBar = { AgroBottomNavigationBar() }
    ) { innerPadding ->
        LazyColumn(modifier = Modifier.padding(innerPadding)) {
            item { HeroWeatherCard(temp = telemetry.ambientTemp) }
            item { SoilSaturationSensorCard(moisture = telemetry.soilMoisture) }
        }
    }
}`
  },
  "manolo": {
    name: "Manolo Fortich",
    prov: "Bukidnon Foothills • 620m ASL • Pineapple & Cacao",
    temp: "27°",
    condition: "High Solar Irradiance",
    icon: "☀️",
    highLow: "High: 31° • Low: 22°",
    precip: "Precipitation: 15% Expected",
    moisture: "62.1%",
    moistureWidth: 62,
    ph: "5.8 pH",
    solar: "890 W/m²",
    humidity: "68%",
    composable: `@Composable
fun ManoloFortichAgroDossier(telemetry: StationState) {
    Surface(
        color = MaterialTheme.colorScheme.background,
        modifier = Modifier.fillMaxSize()
    ) {
        AgroCanopyInspector(
            solarRadiation = telemetry.solarWatts,
            fungalSporeIndex = RiskIndex.LOW
        )
    }
}`
  },
  "cdo-carm": {
    name: "Carmen Valley (CDO)",
    prov: "Cagayan de Oro • 25m ASL • Urban Agro-Corridor",
    temp: "31°",
    condition: "Humid Tropical Canopy",
    icon: "🌤️",
    highLow: "High: 33° • Low: 25°",
    precip: "Precipitation: 40% Rain Chance",
    moisture: "55.8%",
    moistureWidth: 56,
    ph: "6.6 pH",
    solar: "780 W/m²",
    humidity: "79%",
    composable: `@Composable
fun CarmenValleyUrbanNode(data: UrbanAgroData) {
    Card(
        shape = MaterialTheme.shapes.extraLarge,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Text("Urban Riverbank Soil Porosity: \${data.porosity}")
    }
}`
  },
  "lantapan": {
    name: "Lantapan Slopes",
    prov: "Mount Kitanglad • 1,120m ASL • Arabica Coffee Reserve",
    temp: "20°",
    condition: "Mountain Mist & Drizzle",
    icon: "🌧️",
    highLow: "High: 23° • Low: 16°",
    precip: "Precipitation: 90% Continuous",
    moisture: "91.2%",
    moistureWidth: 91,
    ph: "6.0 pH",
    solar: "420 W/m²",
    humidity: "96%",
    composable: `@Composable
fun KitangladHighlandSlope(state: HighlandTelemetry) {
    Column(modifier = Modifier.padding(16.dp)) {
        MicroClimateBanner(elevationMeters = 1120)
        HydrologicalRunoffWarning(isSaturated = state.soilMoisture > 85)
    }
}`
  }
};

let currentStation = "claveria";

document.addEventListener("DOMContentLoaded", () => {
  renderStation(currentStation);
});

function selectStation(key, btnEl) {
  currentStation = key;

  document.querySelectorAll(".station-chip").forEach(c => c.classList.remove("active"));
  if (btnEl) {
    btnEl.classList.add("active");
  }

  renderStation(key);
}

function renderStation(key) {
  const data = STATIONS[key];
  if (!data) return;

  document.getElementById("devLocationTitle").innerText = data.name;
  document.getElementById("devLocationProv").innerText = data.prov;
  document.getElementById("devTemp").innerText = data.temp;
  document.getElementById("devCondition").innerText = data.condition;
  document.getElementById("devIcon").innerText = data.icon;
  document.getElementById("devHighLow").innerText = data.highLow;
  document.getElementById("devPrecip").innerText = data.precip;
  document.getElementById("devMoisture").innerText = data.moisture;
  document.getElementById("devPH").innerText = data.ph;
  document.getElementById("devSolar").innerText = data.solar;
  document.getElementById("devHumidity").innerText = data.humidity;
  document.getElementById("moistureFill").style.width = `${data.moistureWidth}%`;

  document.getElementById("composeCodeView").innerText = data.composable;
}

function refreshTelemetry() {
  const btn = document.querySelector(".app-icon-btn");
  btn.style.transform = "rotate(360deg)";
  btn.style.transition = "transform 0.5s";
  setTimeout(() => {
    btn.style.transform = "none";
    btn.style.transition = "none";
    renderStation(currentStation);
  }, 500);
}
