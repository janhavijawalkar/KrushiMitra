# 🌾 KrushiMitra (कृषीमित्र) — Smart Agriculture AI Platform

An intelligent precision farming platform combining **Machine Learning Yield Prediction**, **Soil Nutrient Crop Recommendations**, **Real-Time Weather Telemetry**, **Multilingual Support (मराठी, हिन्दी, English)**, and **Interactive Voice Agronomist Chatbot**.

---

## ⚡ Quick Start (Windows — 1-Click Launch)

If you are on Windows, simply **double-click** the file:
```
start_project.bat
```
This script will automatically:
1. Set up the Python virtual environment and install backend dependencies.
2. Install frontend Node modules (if not already installed).
3. Start the Flask backend on `http://127.0.0.1:5000`.
4. Start the React Vite frontend on `http://localhost:5173`.
5. Open your default web browser directly to KrushiMitra!

---

## 🛠️ Manual Setup & Execution (Any Operating System)

### Prerequisites:
- **Python 3.9+** ([Download Python](https://www.python.org/downloads/))
- **Node.js 18+** ([Download Node.js](https://nodejs.org/))

### Step 1: Start the Backend (Terminal 1)
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS / Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*Backend API will run at `http://127.0.0.1:5000`*

### Step 2: Start the Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run at `http://localhost:5173`*

---

## 🔐 Default Demo Accounts

You can register a new account anytime or sign in with the pre-seeded accounts:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **🌾 Registered Farmer** | `ramesh.patil@krushimitra.in` | `password123` | Demo farmer profile with history and reports |
| **🛡️ System Admin** | `admin@krushimitra.in` | `adminpassword` | Full admin analytics, farmers directory & controls |

---

## 🗄️ Database Architecture
- **Automatic Fallback Engine**: If MySQL is not running on your machine, KrushiMitra **automatically and seamlessly switches to the pre-seeded SQLite database (`backend/krushimitra.db`)**.
- No database installation or manual configuration is required for reviewers.
- For production MySQL setups, configuration options are located in `backend/.env`.

---

## 🌟 Key Features
- **Yield Prediction**: Random Forest regressor trained on Maharashtra agricultural datasets.
- **Crop Recommendation**: Multi-class classifier evaluating Soil N-P-K, pH, temperature, and rainfall.
- **Real-Time Weather**: OpenWeatherMap integration with agronomist guidance.
- **Multilingual Support**: Dynamic runtime translation across Marathi, Hindi, and English.
- **Bilingual Voice Input**: Speech-to-text form filling in Marathi, Hindi, and English.
- **Official PDF Reports**: A4 formatted farm telemetry exports.
