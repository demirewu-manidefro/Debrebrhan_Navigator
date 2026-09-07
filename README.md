# 📍 Debre Berhan Navigator

<p align="center">
  <strong>An AI-Powered Smart Navigation & Local Discovery Platform for Debre Berhan City</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge" alt="PWA">
</p>

---

## 📖 Overview

**Debre Berhan Navigator** is a modern, AI-powered interactive map platform built specifically for **Debre Berhan City, Ethiopia**.

The application helps residents and visitors easily discover important places, search for locations, get directions, explore local events, read and submit reviews, and communicate with an **Amharic-speaking AI assistant**.

The project combines **React, Node.js, PostgreSQL, geospatial mapping, routing, PWA technology, and Generative AI** to create a localized digital navigation experience.

---

## 📸 Application Preview

<p align="center">
  <img 
    src="docs/screenshots/debre-berhan-navigator.png" 
    alt="Debre Berhan Navigator Application Screenshot"
    width="900"
  />
</p>

<p align="center">
  <i>Debre Berhan Navigator — Interactive Map Interface</i>
</p>

---

## ✨ Features

### 🗺️ Interactive Map

- Interactive map of Debre Berhan City
- Search places by name
- Filter places by category
- Filter locations by Kebele
- Marker clustering for better map performance
- Detailed location information

### 🤖 Amharic AI Assistant

- AI-powered conversational assistant
- Supports **Amharic language**
- Natural-language place discovery
- Helps users find relevant locations
- Powered by **Google Gemini API**

### 📍 Navigation & Routing

- Uses the user's current location
- Calculates routes to selected destinations
- Displays routes directly on the map
- Powered by **Leaflet Routing Machine**

### ⭐ Reviews & Ratings

- 1–5 star ratings
- User comments
- Place-specific reviews
- Community-driven location information

### 📸 Place Photos

- Display photos for locations
- Support for image URLs
- Helps users visually identify places

### 🎉 Local Events

- Discover local events
- Dedicated event markers
- View ongoing and upcoming events
- Location-based event information

### 📶 Progressive Web App

- Installable on mobile and desktop
- Service Worker support
- Static asset caching
- Improved experience with poor connectivity
- PWA-ready architecture

### 🌙 Dark Mode

- Modern dark interface
- Light and dark themes
- User preference stored locally
- Responsive design

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Development & build tool |
| Tailwind CSS | Styling |
| React-Leaflet | Interactive maps |
| Leaflet Routing Machine | Navigation & routing |
| Lucide React | Icons |
| Vite PWA Plugin | PWA functionality |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL database driver |
| Google Gemini | AI assistant |

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         │  Mobile / Desktop   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ Interactive  │    │   Routing    │    │  AI Assistant│
        │     Map      │    │   Service    │    │    Gemini    │
        └──────────────┘    └──────────────┘    └──────┬───────┘
                                                       │
                                                       ▼
                                             ┌─────────────────┐
                                             │  Express REST   │
                                             │       API       │
                                             └────────┬────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │   PostgreSQL    │
                                             │     Database    │
                                             └─────────────────┘
