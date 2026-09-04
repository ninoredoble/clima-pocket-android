/**
 * ClimaPocket Android - Material You 3.5 Agrometeorological Studio
 * 100% 7-Bit ASCII Character Encoding - Zero Mojibake
 * Jetpack Compose 1.7 & FAO-56 Penman-Monteith Evapotranspiration Physics
 */

// 1. Northern Mindanao Agro-Climatic Stations
const STATIONS = {
  claveria: {
    id: "STN-MIN-01",
    name: "Claveria Station",
    fullName: "Claveria Highland Station",
    sub: "Bukidnon High Elevation Grid // 980m",
    coop: "NORTHERN MIN-COOP",
    elev: 980,
    temp: 22.4,
    rh: 88,
    wind: 2.1,
    rad: 18.5,
    smd: 14.2,
    high: 26.8,
    low: 19.2,
    condition: "Highland Canopy Mist",
    themeBadge: "MOSS PALETTE",
    crop: "Arabica Coffee & Sweet Corn",
    theme: {
      bg: "#f5f8f5",
      surface: "#ffffff",
      surfaceTonal: "#e6ede6",
      primary: "#235336",
      primaryContainer: "#c4ebd0",
      accent: "#e07a5f",
      textHeadline: "#122117",
      textBody: "#425247",
      textDim: "#718578"
    },
    advisoryTitle: "FIELD ADVISORY // SAFE SPRAY WINDOW",
    advisoryBody: "Canopy wind speed at 2.1 m/s provides low risk of pesticide droplet drift. High relative humidity (88%) delays evaporation, optimizing foliar absorption for Arabica coffee trees."
  },
  manolo: {
    id: "STN-MIN-02",
    name: "Manolo Fortich Station",
    fullName: "Manolo Fortich Foothills",
    sub: "Del Monte Agro Basin // 650m",
    coop: "BUKIDNON PINE-COOP",
    elev: 650,
    temp: 25.1,
    rh: 76,
    wind: 3.4,
    rad: 22.0,
    smd: 28.5,
    high: 29.5,
    low: 21.0,
    condition: "Partly Cloudy Foothill",
    themeBadge: "AMBER PALETTE",
    crop: "Del Monte Pineapple & Cacao",
    theme: {
      bg: "#fcf9f2",
      surface: "#ffffff",
      surfaceTonal: "#f5eedd",
      primary: "#78590c",
      primaryContainer: "#fce8b8",
      accent: "#b85b28",
      textHeadline: "#241a02",
      textBody: "#54441f",
      textDim: "#877348"
    },
    advisoryTitle: "FIELD ADVISORY // TRANSPIRATION SURGE",
    advisoryBody: "Solar irradiance at 22.0 MJ/m2 accelerates vegetative evapotranspiration. Secondary drip irrigation recommended for young cacao seedlings on south-facing terraces."
  },
  carmen: {
    id: "STN-MIN-03",
    name: "Carmen River Station",
    fullName: "Carmen Valley Floodplain",
    sub: "Cagayan River Lowland // 25m",
    coop: "CAGAYAN ALLUVIAL COOP",
    elev: 25,
    temp: 30.8,
    rh: 64,
    wind: 4.8,
    rad: 24.5,
    smd: 42.1,
    high: 33.2,
    low: 25.4,
    condition: "Alluvial Sun / Breezy",
    themeBadge: "TERRACOTTA PALETTE",
    crop: "Citrus & Alluvial Vegetables",
    theme: {
      bg: "#faf5f3",
      surface: "#ffffff",
      surfaceTonal: "#f2e5e0",
      primary: "#853b21",
      primaryContainer: "#fad2c5",
      accent: "#cf5c36",
      textHeadline: "#291008",
      textBody: "#592b1d",
      textDim: "#8f5746"
    },
    advisoryTitle: "FIELD ADVISORY // CAUTION HIGH DRIFT",
    advisoryBody: "Thermal updrafts and 4.8 m/s valley gusts exceed safe aerial application threshold. Postpone drone spraying until evening katabatic wind inversion after 17:30."
  },
  malaybalay: {
    id: "STN-MIN-04",
    name: "Malaybalay Station",
    fullName: "Malaybalay High Plain",
    sub: "Central High Valley // 622m",
    coop: "VALLEY CANE-COOP",
    elev: 622,
    temp: 24.6,
    rh: 80,
    wind: 2.8,
    rad: 20.0,
    smd: 19.4,
    high: 28.0,
    low: 20.1,
    condition: "Afternoon Orographic Cloud",
    themeBadge: "PINE PALETTE",
    crop: "Highland Sugarcane & Arabica",
    theme: {
      bg: "#f4f8f7",
      surface: "#ffffff",
      surfaceTonal: "#e2edeb",
      primary: "#1c4f4b",
      primaryContainer: "#bee3df",
      accent: "#368f8b",
      textHeadline: "#0d2422",
      textBody: "#385451",
      textDim: "#6a8784"
    },
    advisoryTitle: "FIELD ADVISORY // PRE-RAIN WINDOW",
    advisoryBody: "Orographic buildup observed at Kitanglad ridge. Fertigation must complete within 2 hours to prevent active nitrate washout from anticipated convection."
  },
  maramag: {
    id: "STN-MIN-05",
    name: "Maramag Station",
    fullName: "Maramag Irrigation Basin",
    sub: "Pulangi Watershed // 340m",
    coop: "PULANGI RICE-COOP",
    elev: 340,
    temp: 28.3,
    rh: 72,
    wind: 2.5,
    rad: 21.5,
    smd: 35.0,
    high: 31.5,
    low: 23.8,
    condition: "Humid Tropical Basin",
    themeBadge: "VERDANT PALETTE",
    crop: "Lowland Paddy Rice & Corn",
    theme: {
      bg: "#f4f8f4",
      surface: "#ffffff",
      surfaceTonal: "#e0eee0",
      primary: "#20562e",
      primaryContainer: "#c2eac9",
      accent: "#43aa8b",
      textHeadline: "#0f2916",
      textBody: "#3d5742",
      textDim: "#6a856f"
    },
    advisoryTitle: "FIELD ADVISORY // PADDY WATER RETENTION",
    advisoryBody: "Solar radiation and relative humidity promote steady tillering. Sluice gate outflow should maintain 5cm water level to preserve nitrogen uptake."
  }
};

let currentStnKey = "claveria";

// 2. Room SQLite In-Memory Database Simulation
let roomDbCache = [
  { id: 1, station: "Claveria Highland", temp: 22.4, rh: 88, et0: 3.42, risk: "SAFE", sync: "2026-09-05 09:30" },
  { id: 2, station: "Manolo Fortich", temp: 25.1, rh: 76, et0: 4.15, risk: "SAFE", sync: "2026-09-05 09:25" },
  { id: 3, station: "Carmen Valley", temp: 30.8, rh: 64, et0: 5.68, risk: "UNSAFE", sync: "2026-09-05 09:20" },
  { id: 4, station: "Malaybalay High", temp: 24.6, rh: 80, et0: 3.85, risk: "SAFE", sync: "2026-09-05 09:15" },
  { id: 5, station: "Maramag Basin", temp: 28.3, rh: 72, et0: 4.60, risk: "SAFE", sync: "2026-09-05 09:10" }
];

// 3. FAO-56 Penman-Monteith Evapotranspiration Calculator
function computeFao56(temp, rh, wind, rad) {
  // Slope of vapor pressure curve (Delta, kPa/C)
  const delta = (4098 * (0.6108 * Math.exp((17.27 * temp) / (temp + 237.3)))) / Math.pow(temp + 237.3, 2);
  
  // Psychrometric constant (gamma, kPa/C)
  const gamma = 0.066;
  
  // Saturation vapor pressure (es, kPa)
  const es = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
  
  // Actual vapor pressure (ea, kPa)
  const ea = es * (rh / 100.0);
  
  // Net radiation equivalent (Rn - G, MJ/m2/d converted to mm/d equivalent)
  const rn = 0.77 * rad * 0.408;
  
  // FAO-56 Equation:
  const numerator = (0.408 * delta * rn) + (gamma * (900 / (temp + 273)) * wind * (es - ea));
  const denominator = delta + (gamma * (1 + 0.34 * wind));
  const et0 = Math.max(0.5, (numerator / denominator));

  // Spray drift index based on wind velocity
  let driftStatus = "SAFE";
  let driftIndex = (wind / 5.0).toFixed(2);
  let badgeColor = "#3ddc84";

  if (wind < 1.5) {
    driftStatus = "CAUTION (STAGNANT)";
    badgeColor = "#f59e0b";
  } else if (wind <= 3.5) {
    driftStatus = "OPTIMAL SAFE";
    badgeColor = "#3ddc84";
  } else if (wind <= 5.5) {
    driftStatus = "ELEVATED DRIFT";
    badgeColor = "#f59e0b";
  } else {
    driftStatus = "CRITICAL UNSAFE";
    badgeColor = "#ef4444";
  }

  // Fungal spore risk
  let fungal = "NORMAL";
  if (rh >= 85 && temp >= 20 && temp <= 27) {
    fungal = "ELEVATED (BLIGHT RISK)";
  } else if (rh >= 75) {
    fungal = "MODERATE";
  }

  // Moisture Deficit Estimation
  const deficit = Math.max(5.0, (et0 * 3.8 + (30 - rh * 0.2))).toFixed(1);

  return {
    et0: et0.toFixed(2),
    driftStatus: driftStatus,
    driftIndex: driftIndex,
    badgeColor: badgeColor,
    fungal: fungal,
    deficit: deficit
  };
}

// 4. Update UI Components
function renderStation(key) {
  currentStnKey = key;
  const s = STATIONS[key];
  if (!s) return;

  // Update card active states
  document.querySelectorAll(".station-card").forEach(c => {
    if (c.getAttribute("data-stn") === key) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });

  // Apply Material You 3.5 Theme Tokens to Phone Screen
  const screen = document.getElementById("pixelScreen");
  if (screen) {
    screen.style.setProperty("--m3-bg", s.theme.bg);
    screen.style.setProperty("--m3-surface", s.theme.surface);
    screen.style.setProperty("--m3-surface-tonal", s.theme.surfaceTonal);
    screen.style.setProperty("--m3-primary", s.theme.primary);
    screen.style.setProperty("--m3-primary-container", s.theme.primaryContainer);
    screen.style.setProperty("--m3-accent", s.theme.accent);
    screen.style.setProperty("--m3-text-headline", s.theme.textHeadline);
    screen.style.setProperty("--m3-text-body", s.theme.textBody);
    screen.style.setProperty("--m3-text-dim", s.theme.textDim);
  }

  // Update Phone Hardware Display
  document.getElementById("phoneStationName").textContent = s.name;
  document.getElementById("phoneStationSub").textContent = s.sub;
  document.getElementById("phoneCoopBadge").textContent = s.coop;
  document.getElementById("phoneTemp").innerHTML = s.temp.toFixed(1) + "&deg;";
  document.getElementById("phoneCondition").textContent = s.condition;
  document.getElementById("phoneHighLow").innerHTML = "H: " + s.high.toFixed(1) + "&deg; &bull; L: " + s.low.toFixed(1) + "&deg;";
  document.getElementById("phoneThemeBadge").textContent = s.themeBadge;
  document.getElementById("phoneHumidity").textContent = s.rh + "%";
  document.getElementById("phoneWind").textContent = s.wind + " m/s";

  // Compute Physics
  const phys = computeFao56(s.temp, s.rh, s.wind, s.rad);
  document.getElementById("phoneEt0").textContent = phys.et0 + " mm/d";
  document.getElementById("phoneAdvisoryTitle").textContent = s.advisoryTitle;
  document.getElementById("phoneAdvisoryBody").textContent = s.advisoryBody;

  // Sync with Calculator Controls
  document.getElementById("sliderTemp").value = s.temp;
  document.getElementById("sliderRh").value = s.rh;
  document.getElementById("sliderWind").value = s.wind;
  document.getElementById("sliderRad").value = s.rad;
  updateCalcOutputs();

  // Render 24-Hour Diurnal Timeline
  renderDiurnalHourly(s);
}

// 5. Render Diurnal Hourly Timeline
function renderDiurnalHourly(s) {
  const container = document.getElementById("phoneHourly");
  if (!container) return;

  const hours = [
    { t: "06:00", dt: -2.5, rain: "10%" },
    { t: "09:00", dt: 0.0, rain: "15%" },
    { t: "12:00", dt: +3.2, rain: "25%" },
    { t: "15:00", dt: +4.0, rain: "40%" },
    { t: "18:00", dt: +0.5, rain: "30%" },
    { t: "21:00", dt: -1.8, rain: "15%" },
    { t: "00:00", dt: -3.0, rain: "5%" },
    { t: "03:00", dt: -3.6, rain: "5%" }
  ];

  let html = "";
  hours.forEach(h => {
    const tempVal = (s.temp + h.dt).toFixed(1);
    html += '<div class="hour-pill">' +
      '<span class="hour-time">' + h.t + '</span>' +
      '<span class="hour-temp">' + tempVal + '&deg;</span>' +
      '<span class="hour-rain">' + h.rain + '</span>' +
    '</div>';
  });

  container.innerHTML = html;
}

// 6. Update Calculator UI Outputs
function updateCalcOutputs() {
  const temp = parseFloat(document.getElementById("sliderTemp").value);
  const rh = parseFloat(document.getElementById("sliderRh").value);
  const wind = parseFloat(document.getElementById("sliderWind").value);
  const rad = parseFloat(document.getElementById("sliderRad").value);

  document.getElementById("calcTempDisp").innerHTML = temp.toFixed(1) + "&deg;C";
  document.getElementById("calcRhDisp").textContent = rh + "%";
  document.getElementById("calcWindDisp").textContent = wind.toFixed(1) + " m/s";
  document.getElementById("calcRadDisp").textContent = rad.toFixed(1) + " MJ/m2";

  const phys = computeFao56(temp, rh, wind, rad);
  document.getElementById("calcEt0").textContent = phys.et0 + " mm/d";
  document.getElementById("calcDriftRisk").textContent = phys.driftStatus;
  document.getElementById("calcFungalRisk").textContent = phys.fungal;
  document.getElementById("calcDeficit").textContent = phys.deficit + " mm";

  const badge = document.getElementById("sprayStatusBadge");
  if (badge) {
    badge.textContent = phys.driftStatus;
    badge.style.color = phys.badgeColor;
    badge.style.borderColor = phys.badgeColor;
  }
}

// 7. Render Room DB Table
function renderRoomTable(records) {
  const tbody = document.getElementById("roomTbody");
  if (!tbody) return;

  if (!records || records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 12px; color:#64748b;">No matching cache rows found.</td></tr>';
    return;
  }

  let html = "";
  records.forEach(r => {
    html += '<tr>' +
      '<td>' + r.id + '</td>' +
      '<td>' + r.station + '</td>' +
      '<td>' + r.temp.toFixed(1) + '&deg;C</td>' +
      '<td>' + r.rh + '%</td>' +
      '<td>' + r.et0.toFixed(2) + '</td>' +
      '<td>' + r.sync + '</td>' +
    '</tr>';
  });
  tbody.innerHTML = html;
}

// 8. Event Listeners Setup
document.addEventListener("DOMContentLoaded", function() {

  // Studio Top Tabs Navigation
  document.querySelectorAll(".s-tab-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const targetId = this.getAttribute("data-tab");
      document.querySelectorAll(".s-tab-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === targetId) {
          pane.classList.add("active");
        }
      });
    });
  });

  // Station Cards Click
  document.querySelectorAll(".station-card").forEach(card => {
    card.addEventListener("click", function() {
      const key = this.getAttribute("data-stn");
      renderStation(key);
    });
  });

  // Sliders Input Events
  ["sliderTemp", "sliderRh", "sliderWind", "sliderRad"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updateCalcOutputs);
    }
  });

  // Room DB Quick SQL Buttons
  document.getElementById("btnSqlAll").addEventListener("click", function() {
    document.getElementById("sqlInput").value = "SELECT * FROM tbl_station_cache ORDER BY id ASC";
    renderRoomTable(roomDbCache);
  });

  document.getElementById("btnSqlHighTemp").addEventListener("click", function() {
    document.getElementById("sqlInput").value = "SELECT * FROM tbl_station_cache WHERE temp > 25.0";
    const filtered = roomDbCache.filter(r => r.temp > 25.0);
    renderRoomTable(filtered);
  });

  document.getElementById("btnSqlAdvisory").addEventListener("click", function() {
    document.getElementById("sqlInput").value = "SELECT * FROM tbl_station_cache WHERE risk = 'UNSAFE'";
    const filtered = roomDbCache.filter(r => r.risk === "UNSAFE");
    renderRoomTable(filtered);
  });

  document.getElementById("btnRunSql").addEventListener("click", function() {
    const q = document.getElementById("sqlInput").value.trim().toLowerCase();
    if (q.includes("where temp > 25") || q.includes("temp>25")) {
      renderRoomTable(roomDbCache.filter(r => r.temp > 25.0));
    } else if (q.includes("where risk") || q.includes("unsafe")) {
      renderRoomTable(roomDbCache.filter(r => r.risk === "UNSAFE"));
    } else {
      renderRoomTable(roomDbCache);
    }
  });

  // Export Telemetry Record (JSON)
  document.getElementById("btnExportAgro").addEventListener("click", function() {
    const s = STATIONS[currentStnKey];
    const temp = parseFloat(document.getElementById("sliderTemp").value);
    const rh = parseFloat(document.getElementById("sliderRh").value);
    const wind = parseFloat(document.getElementById("sliderWind").value);
    const rad = parseFloat(document.getElementById("sliderRad").value);
    const phys = computeFao56(temp, rh, wind, rad);

    const telemetryReport = {
      protocol: "CLIMAPOCKET-M3-ANDROID-15",
      version: "1.7.0",
      station: {
        id: s.id,
        name: s.fullName,
        elevation_meters: s.elev,
        cooperative: s.coop,
        primary_crop: s.crop
      },
      telemetry: {
        ambient_temp_celsius: temp,
        relative_humidity_pct: rh,
        wind_velocity_mps: wind,
        solar_radiation_mj_m2: rad
      },
      agrometeorology_fao56: {
        et0_evapotranspiration_mm_day: parseFloat(phys.et0),
        soil_moisture_deficit_mm: parseFloat(phys.deficit),
        spray_drift_risk: phys.driftStatus,
        drift_index_ratio: parseFloat(phys.driftIndex),
        fungal_blight_risk: phys.fungal
      },
      material_you_palette: s.theme,
      exported_at: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(telemetryReport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "climapocket_" + currentStnKey + "_telemetry.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Initial Boot Render
  renderStation("claveria");
  renderRoomTable(roomDbCache);
});