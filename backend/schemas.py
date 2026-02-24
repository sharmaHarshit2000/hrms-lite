from datetime import date
from pydantic import BaseModel, EmailStr, Field
from typing import Literal

class EmployeeCreate(BaseModel):
    employee_id: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    department: str = Field(min_length=1, max_length=100)

class EmployeeOut(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    date: date
    status: Literal["Present", "Absent"]

class AttendanceOut(BaseModel):
    id: int
    date: date
    status: str

    class Config:
        from_attributes = True