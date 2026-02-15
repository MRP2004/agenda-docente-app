from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..auth import get_current_user
from ..database import get_db
from ..models import Attendance, DailyContent, Observation, Planning, Student, User

router = APIRouter(prefix="/api/pedagogical", tags=["pedagogical"])


@router.post("/observations", response_model=schemas.ObservationOut, status_code=201)
def create_observation(payload: schemas.ObservationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == payload.student_id, Student.owner_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    observation = Observation(owner_id=current_user.id, **payload.model_dump())
    db.add(observation)
    db.commit()
    db.refresh(observation)
    return observation


@router.get("/observations", response_model=list[schemas.ObservationOut])
def list_observations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    student_id: int | None = None,
    target_date: date | None = None,
):
    query = db.query(Observation).filter(Observation.owner_id == current_user.id)
    if student_id:
        query = query.filter(Observation.student_id == student_id)
    if target_date:
        query = query.filter(Observation.date == target_date)
    return query.order_by(Observation.date.desc()).all()


@router.post("/attendance", response_model=schemas.AttendanceOut, status_code=201)
def create_attendance(payload: schemas.AttendanceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == payload.student_id, Student.owner_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    attendance = Attendance(owner_id=current_user.id, **payload.model_dump())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get("/attendance", response_model=list[schemas.AttendanceOut])
def list_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    view: str = "daily",
    target_date: date | None = None,
    student_id: int | None = None,
):
    base_date = target_date or date.today()
    query = db.query(Attendance).filter(Attendance.owner_id == current_user.id)

    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    if view == "daily":
        query = query.filter(Attendance.date == base_date)
    elif view == "weekly":
        query = query.filter(Attendance.date.between(base_date - timedelta(days=6), base_date))
    elif view == "monthly":
        month_start = base_date.replace(day=1)
        query = query.filter(Attendance.date.between(month_start, base_date))

    return query.order_by(Attendance.date.desc()).all()


@router.put("/attendance/{attendance_id}", response_model=schemas.AttendanceOut)
def update_attendance(attendance_id: int, payload: schemas.AttendanceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id, Attendance.owner_id == current_user.id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(attendance, key, value)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.post("/plannings", response_model=schemas.PlanningOut, status_code=201)
def create_planning(payload: schemas.PlanningCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    planning = Planning(owner_id=current_user.id, **payload.model_dump())
    db.add(planning)
    db.commit()
    db.refresh(planning)
    return planning


@router.get("/plannings", response_model=list[schemas.PlanningOut])
def list_plannings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), week_start: date | None = None):
    query = db.query(Planning).filter(Planning.owner_id == current_user.id)
    if week_start:
        query = query.filter(Planning.week_start == week_start)
    return query.order_by(Planning.week_start.desc(), Planning.weekday).all()


@router.post("/contents", response_model=schemas.DailyContentOut, status_code=201)
def create_daily_content(payload: schemas.DailyContentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.student_id:
        student = db.query(Student).filter(Student.id == payload.student_id, Student.owner_id == current_user.id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")
    content = DailyContent(owner_id=current_user.id, **payload.model_dump())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


@router.get("/contents", response_model=list[schemas.DailyContentOut])
def list_daily_content(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    target_date: date | None = None,
    student_id: int | None = None,
):
    query = db.query(DailyContent).filter(DailyContent.owner_id == current_user.id)
    if target_date:
        query = query.filter(DailyContent.date == target_date)
    if student_id:
        query = query.filter(DailyContent.student_id == student_id)
    return query.order_by(DailyContent.date.desc()).all()
