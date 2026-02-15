import { useEffect, useState } from 'react';
import { request } from './api';

import AuthPanel from './components/AuthPanel';
import AppNavigation from './components/layout/AppNavigation';

import HomeView from './views/HomeView';
import CalendarView from './views/CalendarView';
import StudentsView from './views/StudentsView';
import StudentProfileView from './views/StudentProfileView';
import TrackingView from './views/TrackingView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentView, setCurrentView] = useState('home');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [data, setData] = useState({
    events: [],
    tasks: [],
    reminders: [],
    students: [],
    observations: [],
    attendance: [],
    plannings: [],
    contents: [],
  });

  const [studentProfile, setStudentProfile] = useState(null);

  // ================= AUTH =================

  const auth = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCurrentView('home');
    setSelectedStudentId(null);
    setStudentProfile(null);
  };

  // ================= LOAD DATA =================

  const loadData = async () => {
    const [
      events,
      tasks,
      reminders,
      students,
      observations,
      attendance,
      plannings,
      contents,
    ] = await Promise.all([
      request('/api/events', { token }),
      request('/api/tasks', { token }),
      request('/api/reminders', { token }),
      request('/api/students', { token }),
      request('/api/pedagogical/observations', { token }),
      request('/api/pedagogical/attendance?view=weekly', { token }),
      request('/api/pedagogical/plannings', { token }),
      request('/api/pedagogical/contents', { token }),
    ]);

    setData({
      events,
      tasks,
      reminders,
      students,
      observations,
      attendance,
      plannings,
      contents,
    });
  };

  const loadStudentProfile = async (studentId) => {
    const profile = await request(`/api/students/${studentId}/profile`, { token });
    setStudentProfile(profile);
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  useEffect(() => {
    if (token && selectedStudentId) {
      loadStudentProfile(selectedStudentId);
    }
  }, [token, selectedStudentId]);

  // ================= CREATE HELPERS =================

  const create = async (path, payload) => {
    await request(path, { method: 'POST', body: payload, token });
    await loadData();
    if (selectedStudentId) await loadStudentProfile(selectedStudentId);
  };

  const toggleTask = async (task) => {
    await request(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: { is_done: !task.is_done },
      token,
    });
    await loadData();
  };

  const updateStudent = async (studentId, payload) => {
    await request(`/api/students/${studentId}`, {
      method: 'PUT',
      body: payload,
      token,
    });
    await loadData();
    if (selectedStudentId) await loadStudentProfile(selectedStudentId);
  };

  // ================= VIEW RENDER =================

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            events={data.events}
            tasks={data.tasks}
            plannings={data.plannings}
            onCreateTask={(p) => create('/api/tasks', p)}
            onToggleTask={toggleTask}
            onCreatePlanning={(p) => create('/api/pedagogical/plannings', p)}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            events={data.events}
            onCreateEvent={(p) => create('/api/events', p)}
          />
        );

      case 'students':
        if (selectedStudentId && studentProfile) {
          return (
            <StudentProfileView
              profile={studentProfile}
              onBack={() => {
                setSelectedStudentId(null);
                setStudentProfile(null);
              }}
              onCreateAttendance={(p) => create('/api/pedagogical/attendance', p)}
              onCreateObservation={(p) => create('/api/pedagogical/observations', p)}
              onCreateContent={(p) => create('/api/pedagogical/contents', p)}
              onUpdateStudent={updateStudent}
            />
          );
        }

        return (
          <StudentsView
            students={data.students}
            onCreateStudent={(p) => create('/api/students', p)}
            onSelectStudent={setSelectedStudentId}
          />
        );

      case 'tracking':
        return (
          <TrackingView
            students={data.students}
            observations={data.observations}
          />
        );

      case 'settings':
      default:
        return (
          <SettingsView
            reminders={data.reminders}
            onCreateReminder={(p) => create('/api/reminders', p)}
            onLogout={logout}
          />
        );
    }
  };

  // ================= AUTH SCREEN =================

  if (!token) {
    return (
      <main className="container auth-layout">
        <AuthPanel onAuth={auth} />
      </main>
    );
  }

  // ================= APP SHELL =================

  return (
    <div className="app-shell">
      <AppNavigation
        currentView={currentView}
        onChangeView={(view) => {
          setSelectedStudentId(null);
          setStudentProfile(null);
          setCurrentView(view);
        }}
      />
      <main className="content">{renderView()}</main>
    </div>
  );
}
