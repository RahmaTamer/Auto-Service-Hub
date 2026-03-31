# Auto-Service Hub 🏎️

Auto-Service Hub is a full-stack web application designed for automobile workshops and vehicle owners. It streamlines the process of booking maintenance appointments, managing inventory, and tracking vehicle service histories.

## Features ✨

### 👥 Customer (Vehicle Owner)
- **Authentication**: Secure login and registration.
- **Garage Management**: Add and maintain a list of personal vehicles (Make, Model, Year, Plate Number).
- **Service Bookings**: Schedule maintenance, repair, or inspection appointments for any of their registered vehicles.
- **Service Tracker**: View the recent service tickets and upcoming bookings.

### 🛠️ Manager (Workshop Owner)
- **Vehicle Search**: Quickly find any vehicle in the system using its unique license plate.
- **Inventory Management**: Add and track spare parts and their current stock quantities.
- **Maintenance Tickets**: Create detailed service tickets for vehicles, including repair descriptions and estimated costs.

## Tech Stack 💻

- **Frontend:** React 19, Vite, React Router, Axios, Custom CSS (Glassmorphism & dark theme).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (using Mongoose).
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.
- **Validation:** Joi.

## Project Structure 📂

```text
fullstack/
├── frontend/       # React + Vite application
└── backend/        # Node + Express server
```

## Getting Started 🚀

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/Auto-Service-Hup`)

### 1. Setup Backend
```bash
cd backend
npm install
node app.js
```
*The server will start on port 5000.*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*The client will start on port 5173 (http://localhost:5173).*

## API Endpoints Overview 🛣️
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/vehicles/add` - Add new vehicle
- `POST /api/vehicles/search` - Search vehicle by license plate
- `POST /api/bookings/create` - Book an appointment
- `POST /api/maintenance/create` - Submit a maintenance ticket with cost
- `POST /api/parts/add` - Add a spare part to inventory

---

*Designed and developed for seamless auto-service management.*
