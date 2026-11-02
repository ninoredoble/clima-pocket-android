# ClimaPocket

A design study for a phone weather screen, built as a web prototype. It explores one idea: forecast by **elevation** instead of by town.

Drag a pin up a mountain slope, scrub through the day, and the temperature, cloud, humidity, rain chance and wind change with where you are and what time it is. The sky, the page tint and the chart follow the same two controls.

**This is an interactive browser study.** It is not an Android app, not a forecast, and not a production system. Every number is sample data produced by a few written rules.

## What it is not

- Not an Android app. There is no Kotlin, Jetpack Compose, Room database or backend.
- Not connected to any sensor, station or weather service, and it makes no network requests for weather.
- Not safe to plan spraying, harvest or travel with.
- Place names (Carmen, Maramag, Malaybalay, Claveria) are real towns in Northern Mindanao, but their elevations are approximate and the slope between them is a schematic, not a survey line.

## How the numbers are made

The rules sit at the top of `app.js`:

| Rule | Value |
|---|---|
| Air temperature at the coast | an invented day curve, 22.5 °C at 02:30 to 30.5 °C at 14:30 |
| Cooling with height | 6.5 °C per km, the usual average |
| Coastal dew point | fixed at 21.5 °C (invented) |
| Cloud base | about 125 m for each °C between temperature and dew point, so the deck rises through the morning and sinks at night |
| Cloud depth | 300 m plus up to 500 m in the afternoon (invented) |
| Rain chance | peaks around 15:30 and grows with height (invented curve) |
| Wind | a made-up afternoon breeze that strengthens with height |

The "dry stretch" shown under the chart is the longest daylight run with a rain chance under 25% and no cloud at that height.

## Running it

Plain HTML, CSS and JavaScript, no build step. Open `index.html`, or serve the folder:

```sh
python3 -m http.server
```

It is deployed as a static site on GitHub Pages.

## Accessibility

Both controls are native range inputs, so they work with touch, mouse and arrow keys, and announce their value. With `prefers-reduced-motion` the entrance animations, falling rain, "Play the day" button and eased transitions are switched off.

## Credits

- Typeface: Bricolage Grotesque, SIL Open Font License 1.1, self-hosted in `fonts/`.
- No licence file is included in this repository yet.

## History

An earlier version of this repository described itself as an Android agrometeorology system. It was never that; this rewrite replaces it with what the project actually is. The repository name still carries the old claim. A more accurate name would be `climapocket-study` or `slope-forecast-study`.
