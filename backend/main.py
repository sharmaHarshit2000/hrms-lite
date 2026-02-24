from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from db import Base, engine, SessionLocal
from schemas import EmployeeCreate, EmployeeOut, AttendanceCreate, AttendanceOut
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# CORS (for local + deployed frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/employees", response_model=list[EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@app.post("/employees", response_model=EmployeeOut, status_code=201)
def add_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_employee(db, payload)
    except IntegrityError:
        db.rollback()
        # Could be duplicate employee_id OR duplicate email
        raise HTTPException(
            status_code=409,
            detail="Duplicate employee_id or email already exists",
        )

@app.delete("/employees/{employee_db_id}", status_code=204)
def remove_employee(employee_db_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_employee(db, employee_db_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Employee not found")
    return

@app.post("/employees/{employee_db_id}/attendance", response_model=AttendanceOut, status_code=201)
def mark_attendance(employee_db_id: int, payload: AttendanceCreate, db: Session = Depends(get_db)):
    try:
        rec = crud.create_or_update_attendance(db, employee_db_id, payload)
        return rec
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/employees/{employee_db_id}/attendance", response_model=list[AttendanceOut])
def get_attendance(employee_db_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_attendance_for_employee(db, employee_db_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))