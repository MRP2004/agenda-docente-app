import { useState } from 'react';

const tabs = ['seguimiento', 'asistencias', 'observaciones', 'contenidos'];

export default function StudentProfileView({ profile, onBack, onCreateAttendance, onCreateObservation, onCreateContent, onUpdateStudent }) {
  const [activeTab, setActiveTab] = useState('seguimiento');

  if (!profile) return null;

  const { student, attendance, observations, contents } = profile;

  return (
    <section className="view-stack">
      <article className="card">
        <button className="link" onClick={onBack}>← Volver a alumnos</button>
        <h2>{student.full_name}</h2>
        <p>{student.age || 'Edad s/d'} · Cumpleaños: {student.birthday || 's/d'} · {student.group_name || 'Sin sala'}</p>
        <p>Contacto familiar: {student.guardian_contact || 's/d'}</p>
        <div className="seg-status">
          <label>Estado general:</label>
          <select value={student.progress_status} onChange={(e) => onUpdateStudent(student.id, { progress_status: e.target.value })}>
            <option value="bien">🟢 bien</option>
            <option value="en_proceso">🟡 en proceso</option>
            <option value="atencion">🔴 atención</option>
          </select>
        </div>
      </article>

      <article className="card">
        <div className="tabs">
          {tabs.map((tab) => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {activeTab === 'seguimiento' && (
          <ul className="list compact">
            <li>Observaciones totales: {observations.length}</li>
            <li>Asistencias registradas: {attendance.length}</li>
            <li>Contenidos vistos: {contents.length}</li>
          </ul>
        )}

        {activeTab === 'asistencias' && (
          <TabAttendance studentId={student.id} attendance={attendance} onCreateAttendance={onCreateAttendance} />
        )}

        {activeTab === 'observaciones' && (
          <TabObservations studentId={student.id} observations={observations} onCreateObservation={onCreateObservation} />
        )}

        {activeTab === 'contenidos' && (
          <TabContents studentId={student.id} contents={contents} onCreateContent={onCreateContent} />
        )}
      </article>
    </section>
  );
}

function TabAttendance({ studentId, attendance, onCreateAttendance }) {
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateAttendance({ student_id: studentId, date: formData.get('date'), status: formData.get('status') });
    event.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={submit} className="grid-2">
        <input name="date" type="date" required />
        <select name="status"><option value="presente">Presente</option><option value="ausente">Ausente</option><option value="tarde">Tarde</option></select>
        <button className="full" type="submit">Registrar asistencia</button>
      </form>
      <ul className="list compact">{attendance.map((item) => <li key={item.id}>{item.date} · {item.status}</li>)}</ul>
    </>
  );
}

function TabObservations({ studentId, observations, onCreateObservation }) {
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateObservation({
      student_id: studentId,
      date: formData.get('date'),
      behavior_mood: formData.get('behavior_mood'),
      participation: formData.get('participation'),
      notes: formData.get('notes'),
    });
    event.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={submit} className="grid-2">
        <input name="date" type="date" required />
        <input name="behavior_mood" placeholder="Comportamiento/ánimo" />
        <input name="participation" placeholder="Participación" />
        <textarea className="full" name="notes" placeholder="Observación" required />
        <button className="full" type="submit">Guardar observación</button>
      </form>
      <ul className="list compact">{observations.map((item) => <li key={item.id}>{item.date} · {item.notes}</li>)}</ul>
    </>
  );
}

function TabContents({ studentId, contents, onCreateContent }) {
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateContent({ student_id: studentId, date: formData.get('date'), topic: formData.get('topic'), notes: formData.get('notes') });
    event.currentTarget.reset();
  };

  return (
    <>
      <form onSubmit={submit} className="grid-3">
        <input name="date" type="date" required />
        <select name="topic"><option>colores</option><option>números</option><option>juegos</option><option>canciones</option><option>temas trabajados</option></select>
        <input name="notes" placeholder="Notas" />
        <button className="full" type="submit">Agregar contenido</button>
      </form>
      <ul className="list compact">{contents.map((item) => <li key={item.id}>{item.date} · {item.topic}</li>)}</ul>
    </>
  );
}
