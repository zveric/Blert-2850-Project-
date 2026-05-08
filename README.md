# Blert-2850 Project
 
 
---
 
## About
 
- Blert is a moovement tracker we designed in partnership with our colleagues from the University of Fort Hare. 
- We have created a web-based livestock herd environmental monitoring system. 
- The goal with our dashboard is to help people understand the current condition of their livestock, spot issues and to respond appropriately.
- Our system allows users to view the current location and condition of the tracked livestock, see a clear status of the livestock, view historical trends presented using charts, view animal locations on a simple map view and to read active alerts.
 
---
 
## Tech stack

### backend
- Django REST framework
- DRF GIS (for maps) 
- Pandas
- Pytest
- Factory Boy
- psycopg 
- Africa's talking (SMS)

### data
- SQLite
- PostgreSQL (legacy)

### frontend
- React
- Vite
- Chart.js
- Leaflet
- Bootstrap
- jsPDF
- ESLint

### Dev tools
- Git
- Python
- Node.js

---
## Repository
 
**GitHub:** [zveric/Blert-2850-Project-](https://github.com/zveric/Blert-2850-Project-)
 
**Branches:**
- `main` - main error free finished branch
- `dev` - main development branch

---
 
## Running the Project
 
The frontend and backend run separately. Open two terminal windows and follow the steps below.
 
### Frontend (React + Vite)
 
```bash
cd frontend
npm install
npm run dev
```
 
The frontend will be available at `http://localhost:5173` by default.
 
### Backend (Python + Django REST Framework)
 
```bash
cd backend
pip install -r requirements.txt
python populate.py
python manage.py runserver
```
 
The backend server will be available at `http://localhost:8000` by default.
 
> Make sure the backend is running before using the frontend.
 
## API-Endpoints
User Management
- GET /api/user/ - List all users
- POST /api/user/ - Create user
- GET /api/user/{id}/ - Get specific user
- PUT /api/user/{id}/ - Update user
- DELETE /api/user/{id}/ - Delete user

Livestock
- `GET /api/livestock/` - List all livestock
- `POST /api/livestock/` - Create livestock record
- `GET /api/livestock/{id}/` - Get specific livestock
- `PUT /api/livestock/{id}/` - Update livestock
- `DELETE /api/livestock/{id}/` - Delete livestock

Sensor Readings
- `GET /api/readings/` - List readings (supports query params: `livestock`, `start_time`, `end_time`, `limit`)
- `POST /api/readings/` - Create reading
- `GET /api/readings/{id}/` - Get specific reading
- `PUT /api/readings/{id}/` - Update reading
- `DELETE /api/readings/{id}/` - Delete reading

Alerts
- `GET /api/alerts/` - List all alerts
- `POST /api/alerts/` - Create alert
- `GET /api/alerts/{id}/` - Get specific alert
- `PUT /api/alerts/{id}/` - Update alert
- `DELETE /api/alerts/{id}/` - Delete alert

Authentication
- `POST /api/login/` - Login (obtain auth token)
- `POST /api/register/` - Register new user

SMS & Communication
- `POST /api/sms/send/` - Send manual SMS (requires `phone_number`, `message`)

Utilities
- `GET /api/update-database/` - Trigger database update
- `GET /api/csv/` - Download livestock tracking CSV file
- `GET /utils/update-database/` - Alternative database update endpoint
