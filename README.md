# SpreadOut

A 3D interactive map that scores US cities on quality of life — so you can actually compare places before deciding where to live. It pulls together air quality, water quality, safety, connectivity, and livability into a single composite score, and overlays risk factors like wildfire, flooding, crime, and environmental hazards.

The goal is simple: cut through the noise and help people make smarter housing decisions — move away from overpriced, polluted, overcrowded metros and find somewhere worth living.

---

## What it shows

Each city on the map is rendered as a 3D bar. The height and color of the bar represent its quality of life score. Two view modes let you switch between:

- **Breakdown** — individual bars for each metric (air, water, safety, etc.) rendered side by side
- **Composite** — a single bar representing the overall weighted score

Click any bar to open a detail card with the city's full stats: scores, risk levels, median home price, and population.

### How scores are calculated

Five metrics are scored 0–100:

| Metric | Weight |
|---|---|
| Air Quality | 22% |
| Water Quality | 22% |
| Safety | 22% |
| Livability | 20% |
| Connectivity | 14% |

Risk penalties are then subtracted from the composite:

| Risk Level | Penalty |
|---|---|
| Medium | −1 pt |
| High | −5 pts |
| Critical | −12 pts |

The final score is clamped to 0–100.

---

## Getting started

You'll need [Node.js](https://nodejs.org/) (v18 or later) installed.

**1. Clone the repo**

```bash
git clone https://github.com/your-username/spread-out.git
cd spread-out
```

**2. Start the Python Backend**

The app uses a FastAPI backend to fetch live macroeconomic data (e.g., Treasury yields). You need to install its dependencies and start it.

```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will run on `http://127.0.0.1:8000`.

**3. Install frontend dependencies and start dev server**

Open a new terminal tab in the root project directory (`spread-out/`):

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to use the app

### Navigating the 3D map

- **Rotate** — click and drag
- **Zoom** — scroll wheel
- **Pan** — right-click and drag

### Filtering cities

The left sidebar has four filters:

- **Search** — type a city or state name to narrow the list instantly
- **State** — drop down to show only cities in a specific state
- **Min Score** — drag the slider to hide cities below a certain score threshold
- **Max Risk** — set a ceiling on how risky a city can be (e.g. "Low only" will exclude anything with a medium or higher risk rating in any category)

Hit **Reset Filters** to clear everything.

### Reading the detail card

Click a bar on the map (or a city in the sidebar list) to select it. A floating card appears with:

- Composite score and a letter grade (Excellent / Good / Moderate / Fair / Poor)
- Individual metric scores with color-coded bars
- Risk breakdown across four categories
- Population and median home price

Click the **×** to dismiss the card.

### Switching view modes

Use the **Breakdown / Composite** toggle in the top-right header to switch between the multi-bar breakdown and the single composite bar per city.

Use **Hide Panel** to collapse the sidebar and give the map more room.

---

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) and [@react-three/drei](https://github.com/pmndrs/drei)
- [D3-geo](https://github.com/d3/d3-geo) for lat/lng → 3D coordinate projection
- [Vite](https://vitejs.dev/) for bundling

---

## License

MIT
