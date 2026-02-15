from datetime import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    events = relationship("Event", back_populates="owner", cascade="all,delete")
    tasks = relationship("Task", back_populates="owner", cascade="all,delete")
    reminders = relationship("Reminder", back_populates="owner", cascade="all,delete")
    students = relationship("Student", back_populates="owner", cascade="all,delete")
    observations = relationship("Observation", back_populates="owner", cascade="all,delete")
    attendance_records = relationship("Attendance", back_populates="owner", cascade="all,delete")
    plannings = relationship("Planning", back_populates="owner", cascade="all,delete")
    daily_contents = relationship("DailyContent", back_populates="owner", cascade="all,delete")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[Time] = mapped_column(Time, nullable=False)
    end_time: Mapped[Time] = mapped_column(Time, nullable=False)
    location: Mapped[str | None] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    color: Mapped[str] = mapped_column(String(20), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    recurrence: Mapped[str | None] = mapped_column(String(50))
    recurrence_rule: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="events")
    tasks = relationship("Task", back_populates="event")


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    event_id: Mapped[int | None] = mapped_column(ForeignKey("events.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    due_date: Mapped[Date | None] = mapped_column(Date)
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    notes: Mapped[str | None] = mapped_column(Text)
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)

    owner = relationship("User", back_populates="tasks")
    event = relationship("Event", back_populates="tasks")


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    event_id: Mapped[int | None] = mapped_column(ForeignKey("events.id"), nullable=True)
    task_id: Mapped[int | None] = mapped_column(ForeignKey("tasks.id"), nullable=True)
    minutes_before: Mapped[int] = mapped_column(Integer, nullable=False)
    custom_message: Mapped[str | None] = mapped_column(String(255))
    daily_summary: Mapped[bool] = mapped_column(Boolean, default=False)

    owner = relationship("User", back_populates="reminders")


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int | None] = mapped_column(Integer)
    birthday: Mapped[Date | None] = mapped_column(Date)
    group_name: Mapped[str | None] = mapped_column(String(120))
    guardian_contact: Mapped[str | None] = mapped_column(String(255))
    progress_status: Mapped[str] = mapped_column(String(20), default="en_proceso")

    owner = relationship("User", back_populates="students")
    observations = relationship("Observation", back_populates="student", cascade="all,delete")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all,delete")
    daily_contents = relationship("DailyContent", back_populates="student", cascade="all,delete")


class Observation(Base):
    __tablename__ = "observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False, index=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    behavior_mood: Mapped[str | None] = mapped_column(String(120))
    participation: Mapped[str | None] = mapped_column(String(120))
    notes: Mapped[str] = mapped_column(Text, nullable=False)

    owner = relationship("User", back_populates="observations")
    student = relationship("Student", back_populates="observations")


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id"), nullable=False, index=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False)

    owner = relationship("User", back_populates="attendance_records")
    student = relationship("Student", back_populates="attendance_records")


class Planning(Base):
    __tablename__ = "plannings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    week_start: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    weekday: Mapped[str] = mapped_column(String(20), nullable=False)
    activities: Mapped[str] = mapped_column(Text, nullable=False)

    owner = relationship("User", back_populates="plannings")


class DailyContent(Base):
    __tablename__ = "daily_contents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    student_id: Mapped[int | None] = mapped_column(ForeignKey("students.id"), nullable=True)
    date: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    topic: Mapped[str] = mapped_column(String(120), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)

    owner = relationship("User", back_populates="daily_contents")
    student = relationship("Student", back_populates="daily_contents")
