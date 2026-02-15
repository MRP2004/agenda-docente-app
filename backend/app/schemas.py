import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ================= AUTH =================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=8)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str


# ================= EVENTS =================

class EventBase(BaseModel):
    title: str
    date: datetime.date
    start_time: datetime.time
    end_time: datetime.time
    location: Optional[str] = None
    category: str
    notes: Optional[str] = None
    recurrence: Optional[str] = None
    recurrence_rule: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[datetime.date] = None
    start_time: Optional[datetime.time] = None
    end_time: Optional[datetime.time] = None
    location: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None
    recurrence: Optional[str] = None
    recurrence_rule: Optional[str] = None


class EventOut(EventBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    color: str


# ================= TASKS =================

class TaskBase(BaseModel):
    title: str
    due_date: Optional[datetime.date] = None
    priority: str = "medium"
    notes: Optional[str] = None
    event_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    due_date: Optional[datetime.date] = None
    priority: Optional[str] = None
    notes: Optional[str] = None
    is_done: Optional[bool] = None
    event_id: Optional[int] = None


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    is_done: bool


# ================= REMINDERS =================

class ReminderBase(BaseModel):
    event_id: Optional[int] = None
    task_id: Optional[int] = None
    minutes_before: int = Field(ge=0)
    custom_message: Optional[str] = None
    daily_summary: bool = False


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    minutes_before: Optional[int] = Field(default=None, ge=0)
    custom_message: Optional[str] = None
    daily_summary: Optional[bool] = None


class ReminderOut(ReminderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= STUDENTS =================

class StudentBase(BaseModel):
    full_name: str
    age: Optional[int] = None
    birthday: Optional[datetime.date] = None
    group_name: Optional[str] = None
    guardian_contact: Optional[str] = None
    progress_status: str = "en_proceso"


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    birthday: Optional[datetime.date] = None
    group_name: Optional[str] = None
    guardian_contact: Optional[str] = None
    progress_status: Optional[str] = None


class StudentOut(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= OBSERVATIONS =================

class ObservationBase(BaseModel):
    student_id: int
    date: datetime.date
    behavior_mood: Optional[str] = None
    participation: Optional[str] = None
    notes: str


class ObservationCreate(ObservationBase):
    pass


class ObservationUpdate(BaseModel):
    date: Optional[datetime.date] = None
    behavior_mood: Optional[str] = None
    participation: Optional[str] = None
    notes: Optional[str] = None


class ObservationOut(ObservationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= ATTENDANCE =================

class AttendanceBase(BaseModel):
    student_id: int
    date: datetime.date
    status: str


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    date: Optional[datetime.date] = None
    status: Optional[str] = None


class AttendanceOut(AttendanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= PLANNING =================

class PlanningBase(BaseModel):
    week_start: datetime.date
    weekday: str
    activities: str


class PlanningCreate(PlanningBase):
    pass


class PlanningUpdate(BaseModel):
    week_start: Optional[datetime.date] = None
    weekday: Optional[str] = None
    activities: Optional[str] = None


class PlanningOut(PlanningBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= DAILY CONTENT =================

class DailyContentBase(BaseModel):
    student_id: Optional[int] = None
    date: datetime.date
    topic: str
    notes: Optional[str] = None


class DailyContentCreate(DailyContentBase):
    pass


class DailyContentUpdate(BaseModel):
    student_id: Optional[int] = None
    date: Optional[datetime.date] = None
    topic: Optional[str] = None
    notes: Optional[str] = None


class DailyContentOut(DailyContentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int


# ================= STUDENT PROFILE (AGREGADO FINAL) =================

class StudentProfile(BaseModel):
    student: StudentOut
    attendance: list[AttendanceOut]
    observations: list[ObservationOut]
    contents: list[DailyContentOut]
