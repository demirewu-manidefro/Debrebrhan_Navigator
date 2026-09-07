# 📍 Debre Berhan Navigator

![Debre Berhan Navigator](https://img.shields.io/badge/Status-Active-success) ![React](https://img.shields.io/badge/React-19.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

A modern, AI-powered interactive map application designed for exploring **Debre Berhan City**. This platform makes it incredibly easy to find essential places (hospitals, schools, hotels, government offices), navigate to them, and interact with an integrated Amharic AI assistant for smart, localized queries.

## ✨ Key Features

- 🗺️ **Interactive Map**: Search and filter places by category, name, or Kebele using a smooth, clustered map interface.
- 🤖 **Amharic AI Assistant**: An integrated chat drawer powered by the Gemini API that understands and responds in Amharic, helping you find places dynamically.
- 📍 **Native Routing**: Get real-time directions! The app uses your current geolocation to draw a path directly to your selected destination using `leaflet-routing-machine`.
- ⭐ **Reviews & Ratings**: Users can leave 1-5 star ratings and comments on any place.
- 📸 **Photos**: View and attach image URLs to showcase places.
- 🎉 **Local Events**: Keep track of local happenings with specialized pink calendar markers mapping out ongoing and upcoming events.
- 📶 **Offline Support (PWA)**: Install the web app on your phone or desktop. The app caches static assets via Service Workers to ensure it loads even with poor connectivity.
- 🌙 **Dark Mode**: A beautifully crafted dark theme for comfortable night-time browsing, saving your preference locally.

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (for styling and Dark Mode)
- **React-Leaflet** & **Leaflet Routing Machine** (for maps and routing)
- **Lucide React** (Icons)
- **Vite PWA Plugin** (Progressive Web App support)

### Backend
- **Node.js** & **Express.js** (REST API)
- **PostgreSQL** (`pg` driver for database management)
- **Google Generative AI** (Gemini integration for the AI Assistant)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Database Setup
1. Ensure PostgreSQL is running.
2. Create a `.env` file inside the `backend/` directory:
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=db_gps
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
3. Initialize and seed the database:
   ```bash
   cd backend
   npm install
   node initDb.js
   ```

### 2. Run the Backend Server
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 3. Run the Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173` or similar. Open this in your browser)*

---

## 📂 Project Structure

```text
db_gps/
├── backend/
│   ├── routes/          # Express API routes (places, reviews, events, photos, chat)
│   ├── data/            # JSON seed data
│   ├── db.js            # PostgreSQL connection pool
│   ├── initDb.js        # Script to create tables and seed database
│   └── server.js        # Main backend entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # React components (MapView, Navbar, RoutingMachine, Modals)
    │   ├── context/     # React Contexts (ThemeContext for Dark Mode)
    │   ├── App.jsx      # Main application logic
    │   └── main.jsx     # Vite entry point
    ├── tailwind.config.js
    └── vite.config.js   # Vite + PWA config
```

## 📝 License

This project is open-source and available under the [ISC License](LICENSE).
