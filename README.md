# HRMS Lite — Full‑Stack Coding Assignment

A lightweight Human Resource Management System (HRMS Lite) that allows an admin to:
- Manage employee records
- Track daily attendance (Present / Absent)

## Live Links
- **Live Frontend (Vercel):** https://hrms-lite-one-opal.vercel.app/
- **GitHub Repository:** https://github.com/sharmaHarshit2000/hrms-lite
- **Hosted Backend API:** *https://hrms-lite-9aov.onrender.com*  
  Example: `https://hrms-lite-9aov.onrender.com`  
  Health check should work at: `https://hrms-lite-9aov.onrender.com/health`

---

## Features

### 1) Employee Management
- Add new employee:
  - Employee ID (unique)
  - Full Name
  - Email Address (validated)
  - Department
- View list of all employees
- Delete an employee

### 2) Attendance Management
- Mark attendance for an employee:
  - Date
  - Status: Present / Absent
- View attendance records for each employee
- **Update behavior:** marking attendance again for the **same employee + same date** updates the status (Present ↔ Absent) instead of creating duplicates.

---

## Tech Stack
- **Frontend:** React (Vite), fetch API
- **Backend:** FastAPI (Python)
- **Database:** SQLite + SQLAlchemy ORM
- **Validation:** Pydantic (EmailStr), server-side checks
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## API Endpoints (Backend)
- `GET /health` — service health check
- `GET /employees` — list employees
- `POST /employees` — create employee
- `DELETE /employees/{employee_db_id}` — delete employee
- `POST /employees/{employee_db_id}/attendance` — create/update attendance for date
- `GET /employees/{employee_db_id}/attendance` — list attendance for employee

### Status Codes / Errors
- `201 Created` — employee created / attendance marked
- `204 No Content` — employee deleted
- `409 Conflict` — duplicate employee_id or email
- `404 Not Found` — employee not found
- `422 Unprocessable Entity` — invalid request (e.g., invalid email)

---

## Local Setup (Run Locally)

### Prerequisites
- Python **3.12+** (recommended: 3.12)
- Node.js **18+**

### 1) Backend (FastAPI)
```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend:
- Health: http://127.0.0.1:8000/health
- Swagger: http://127.0.0.1:8000/docs

#### Backend ENV (local)
Create `backend/.env` (optional):
```env
DB_PATH=./hrms.db
```
If not set, backend defaults to `./hrms.db`.

---

### 2) Frontend (React + Vite)
```bash
cd frontend
npm install
# local env
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

Frontend:
- http://localhost:5173

---

## Deployment Notes (Minimal)

### Backend on Render (recommended)
**Render ENV:**
- `DB_PATH=/var/data/hrms.db`  *(for persistent SQLite)*
Add a Render Disk mounted at `/var/data`.

**Start command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend on Vercel
**Vercel ENV:**
- `VITE_API_BASE_URL=https://hrms-lite-9aov.onrender.com`

Build settings:
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

---

## Assumptions / Limitations
- Single admin user (no authentication).
- Leave management, payroll, and advanced HR features are out of scope.
- SQLite used for simplicity; can be swapped with Postgres/MySQL if needed.
- Attendance “edit date” is not provided (not required). To correct a date, mark attendance for the correct date.

---

## Bonus (Implemented)
- Displays **total present days** per employee in the Attendance panel.

---

## Submission Checklist
- [x] Public GitHub repo: https://github.com/sharmaHarshit2000/hrms-lite
- [x] Live frontend: https://hrms-lite-one-opal.vercel.app/
- [x] Hosted backend API URL: *(https://hrms-lite-9aov.onrender.com/health)*
