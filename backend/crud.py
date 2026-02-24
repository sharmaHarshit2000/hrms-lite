from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Employee, Attendance, AttendanceStatus
from schemas import EmployeeCreate, AttendanceCreate

def get_employees(db: Session) -> list[Employee]:
    return list(db.scalars(select(Employee).order_by(Employee.id.desc())).all())

def create_employee(db: Session, payload: EmployeeCreate) -> Employee:
    emp = Employee(
        employee_id=payload.employee_id.strip(),
        full_name=payload.full_name.strip(),
        email=str(payload.email).strip().lower(),
        department=payload.department.strip(),
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

def delete_employee(db: Session, employee_db_id: int) -> bool:
    emp = db.get(Employee, employee_db_id)
    if not emp:
        return False
    db.delete(emp)
    db.commit()
    return True

def create_or_update_attendance(db: Session, employee_db_id: int, payload: AttendanceCreate) -> Attendance:
    emp = db.get(Employee, employee_db_id)
    if not emp:
        raise ValueError("Employee not found")

    status_enum = AttendanceStatus.present if payload.status == "Present" else AttendanceStatus.absent

    existing = db.scalar(
        select(Attendance).where(
            Attendance.employee_id_fk == employee_db_id,
            Attendance.date == payload.date,
        )
    )
    if existing:
        existing.status = status_enum
        db.commit()
        db.refresh(existing)
        return existing

    rec = Attendance(employee_id_fk=employee_db_id, date=payload.date, status=status_enum)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

def get_attendance_for_employee(db: Session, employee_db_id: int) -> list[Attendance]:
    emp = db.get(Employee, employee_db_id)
    if not emp:
        raise ValueError("Employee not found")

    return list(
        db.scalars(
            select(Attendance)
            .where(Attendance.employee_id_fk == employee_db_id)
            .order_by(Attendance.date.desc())
        ).all()
    )