# TravelCity 🕌

**TravelCity** is a premium, interactive travel platform and itinerary planner designed with a focus on exploring cultural and Islamic heritage spots around the globe. The application features a stunning interactive 3D rotating globe, live travel routing, day-by-day itinerary builders, real-time expense calculators, local guide directories, and verified halal guides.

Live URL: **[https://frontend-beryl-zeta-82.vercel.app](https://frontend-beryl-zeta-82.vercel.app)**  
Backend API URL: **[https://travel-city-sable.vercel.app](https://travel-city-sable.vercel.app)**

---

## 🌟 Key Features

### 1. Immersive 3D Interactive Globe
- **Realistic Borders**: Leverages D3 Orthographic projections and TopoJSON boundary maps to render accurate coastlines and political borders directly onto an HTML5 canvas.
- **Islamic Heritage Focus**: Highlights historically significant Muslim countries and region connections (Saudi Arabia, Turkey, Morocco, Malaysia, Indonesia, Egypt, UAE, and Spain/Andalusia) in gold.
- **Flight Arcs**: Renders glowing curved paths connecting all highlighted countries. Click a country pin to view cultural notes, visa specifications, and travel connections in a floating glassmorphic info-card.
- **Physics Drag**: Supports dragging to tilt or spin the globe, coupled with automatic idle rotation.

### 2. Country-Specific Layout Morphing
- When a traveler selects a country or city on their explorer dashboard, the **entire application's color theme** (backgrounds, borders, highlights, and canvas shapes) morphs dynamically to reflect the selected country's aesthetic palette (e.g., *Emerald & Gold for Saudi Arabia*, *Turquoise for Turkey*, *Terracotta for Morocco*, *Cherry Blossom Pink for Japan*).

### 3. Comprehensive Itinerary Planner
- Plan your trips day-by-day with customized daily budgets, timeline tracking, and scheduled activities for cities, mosques, restaurants, and hotels.

### 4. Expense Ledger
- Track travel expenses categorized by transport, accommodation, ticketing, and dining. View remaining budgets and total spends computed in real time.

### 5. Local Guides & Halal Spotting
- Connect with local verified guides. Access detailed logs of mosques (with prayer hall details and Jummah times) and halal-certified dining options.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), React 19, D3.js (Geographic Orthographic Projectors), TopoJSON-Client, Vanilla CSS (Custom properties & theme data attributes).
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT (JSON Web Tokens) Authentication, Morgan Logging, CORS middleware.
- **Deployment**: Vercel Serverless Functions (Backend) & Vercel Static Hosting (Frontend).

---

## 📁 Directory Structure

```text
travel-city/
├── frontend/             # Next.js Frontend Application
│   ├── public/           # Static asset assets
│   └── src/
│       ├── app/          # App Router (Pages: Dashboard, Login, Signup)
│       ├── components/   # UI components (InteractiveGlobe, ParallaxBackground)
│       ├── context/      # AuthContext & Theme togglers
│       └── services/     # API Fetch service layers
├── src/                  # Express API Backend code
│   ├── controllers/      # Route controllers (Auth, City, Mosque, Guide, Itinerary)
│   ├── middlewares/      # JWT authentications and object validations
│   ├── models/           # Mongoose Database schemas & connection hook
│   └── routes/           # REST endpoints
├── server.js             # API entrypoint (Vercel-compatible)
├── vercel.json           # Backend serverless configuration
└── seed.js               # Database population script
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js installed locally.
- MongoDB running locally or a MongoDB Atlas cloud URI connection.

### 1. Backend Setup
1. From the root directory, create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/travel_city_explorer
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with sample relational records (Mosques, Cities, Hotels, Local Guides, and Users):
   ```bash
   node seed.js
   ```
4. Run the API server in development mode:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate into the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Create a `.env.local` file pointing to your local backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Instructions (Vercel)

Both the Next.js frontend and Express API backend are fully configured for Vercel.

### 1. Deploy the Backend
1. Modify `MONGO_URI` and `JWT_SECRET` in your Vercel Project Environment settings.
2. Run from the root directory:
   ```bash
   npx vercel --prod
   ```
3. Copy your live API URL (e.g., `https://travel-city-sable.vercel.app`).

### 2. Deploy the Frontend
1. Add `NEXT_PUBLIC_API_URL` to your Vercel Frontend environment settings, pointing to your live API.
2. Run from the `frontend/` directory:
   ```bash
   cd frontend
   npx vercel --prod
   ```
