from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import get_current_user
from ..database import get_db
from ..models import Attendance, DailyContent, Observation, Student, User

router = APIRouter(prefix="/api/students", tags=["students"])


@router.post("", response_model=schemas.StudentOut, status_code=201)
def create_student(payload: schemas.StudentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = Student(owner_id=current_user.id, **payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("", response_model=list[schemas.StudentOut])
def list_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), q: str | None = None):
    query = db.query(Student).filter(Student.owner_id == current_user.id)
    if q:
        query = query.filter(Student.full_name.ilike(f"%{q}%"))
    return query.order_by(Student.full_name).all()


@router.get("/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id, Student.owner_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    return student


@router.get("/{student_id}/profile", response_model=schemas.StudentProfile)
def get_student_profile(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id, Student.owner_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    attendance = (
        db.query(Attendance)
        .filter(Attendance.owner_id == current_user.id, Attendance.student_id == student_id)
        .order_by(Attendance.date.desc())
        .all()
    )
    observations = (
        db.query(Observation)
        .filter(Observation.owner_id == current_user.id, Observation.student_id == student_id)
        .order_by(Observation.date.desc())
        .all()
    )
    contents = (
        db.query(DailyContent)
        .filter(DailyContent.owner_id == current_user.id, DailyContent.student_id == student_id)
        .order_by(DailyContent.date.desc())
        .all()
    )
    return schemas.StudentProfile(student=student, attendance=attendance, observations=observations, contents=contents)


@router.put("/{student_id}", response_model=schemas.StudentOut)
def update_student(student_id: int, payload: schemas.StudentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id, Student.owner_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id, Student.owner_id == current_user.id).first()
    if student:
        db.delete(student)
        db.commit()
