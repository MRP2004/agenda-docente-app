import { useState } from 'react';

export default function PedagogicalPanel({
  students,
  observations,
  attendance,
  plannings,
  contents,
  onCreateStudent,
  onCreateObservation,
  onCreateAttendance,
  onCreatePlanning,
  onCreateContent,
}) {
  const [studentForm, setStudentForm] = useState({ full_name: '', group_name: 'Sala de 4', guardian_contact: '' });
  const [observationForm, setObservationForm] = useState({ student_id: '', date: '', behavior_mood: '', participation: '', notes: '' });
  const [attendanceForm, setAttendanceForm] = useState({ student_id: '', date: '', status: 'presente' });
  const [planningForm, setPlanningForm] = useState({ week_start: '', weekday: 'Lunes', activities: '' });
  const [contentForm, setContentForm] = useState({ date: '', topic: 'colores', notes: '' });

  return (
    <section className="card docente-panel">
      <h2>Módulos pedagógicos</h2>

      <div className="grid-2">
        <article className="subcard">
          <h3>Seguimiento por alumno</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onCreateStudent(studentForm);
              setStudentForm({ full_name: '', group_name: 'Sala de 4', guardian_contact: '' });
            }}
          >
            <input placeholder="Nombre del alumno" value={studentForm.full_name} onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })} required />
            <input placeholder="Sala/Grupo" value={studentForm.group_name} onChange={(e) => setStudentForm({ ...studentForm, group_name: e.target.value })} />
            <input placeholder="Contacto familiar" value={studentForm.guardian_contact} onChange={(e) => setStudentForm({ ...studentForm, guardian_contact: e.target.value })} />
            <button type="submit">Agregar alumno</button>
          </form>
          <ul className="list compact">
            {students.map((student) => (
              <li key={student.id}>{student.full_name} · {student.group_name || 'Sin sala'}</li>
            ))}
          </ul>
        </article>

        <article className="subcard">
          <h3>Observaciones diarias</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onCreateObservation({ ...observationForm, student_id: Number(observationForm.student_id) });
              setObservationForm({ student_id: '', date: '', behavior_mood: '', participation: '', notes: '' });
            }}
          >
            <select value={observationForm.student_id} onChange={(e) => setObservationForm({ ...observationForm, student_id: e.target.value })} required>
              <option value="">Seleccionar alumno</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}
            </select>
            <input type="date" value={observationForm.date} onChange={(e) => setObservationForm({ ...observationForm, date: e.target.value })} required />
            <input placeholder="Comportamiento / ánimo" value={observationForm.behavior_mood} onChange={(e) => setObservationForm({ ...observationForm, behavior_mood: e.target.value })} />
            <input placeholder="Participación" value={observationForm.participation} onChange={(e) => setObservationForm({ ...observationForm, participation: e.target.value })} />
            <textarea placeholder="Observación pedagógica" value={observationForm.notes} onChange={(e) => setObservationForm({ ...observationForm, notes: e.target.value })} required />
            <button type="submit">Guardar observación</button>
          </form>
          <ul className="list compact">
            {observations.slice(0, 5).map((item) => (
              <li key={item.id}>{item.date} · {item.behavior_mood || 'Sin ánimo'} · {item.participation || 'Sin participación'}</li>
            ))}
          </ul>
        </article>

        <article className="subcard">
          <h3>Asistencias</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onCreateAttendance({ ...attendanceForm, student_id: Number(attendanceForm.student_id) });
              setAttendanceForm({ student_id: '', date: '', status: 'presente' });
            }}
          >
            <select value={attendanceForm.student_id} onChange={(e) => setAttendanceForm({ ...attendanceForm, student_id: e.target.value })} required>
              <option value="">Seleccionar alumno</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}
            </select>
            <div className="grid-2">
              <input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} required />
              <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}>
                <option value="presente">Presente</option>
                <option value="ausente">Ausente</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
            <button type="submit">Registrar asistencia</button>
          </form>
          <ul className="list compact">
            {attendance.slice(0, 5).map((item) => <li key={item.id}>{item.date} · {item.status}</li>)}
          </ul>
        </article>

        <article className="subcard">
          <h3>Planificación semanal</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onCreatePlanning(planningForm);
              setPlanningForm({ week_start: '', weekday: 'Lunes', activities: '' });
            }}
          >
            <input type="date" value={planningForm.week_start} onChange={(e) => setPlanningForm({ ...planningForm, week_start: e.target.value })} required />
            <select value={planningForm.weekday} onChange={(e) => setPlanningForm({ ...planningForm, weekday: e.target.value })}>
              <option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option>
            </select>
            <textarea placeholder="Actividades del día" value={planningForm.activities} onChange={(e) => setPlanningForm({ ...planningForm, activities: e.target.value })} required />
            <button type="submit">Guardar planificación</button>
          </form>
          <ul className="list compact">
            {plannings.slice(0, 5).map((item) => <li key={item.id}>{item.weekday} · {item.activities.slice(0, 55)}</li>)}
          </ul>
        </article>

        <article className="subcard full-width">
          <h3>Contenidos del día</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onCreateContent(contentForm);
              setContentForm({ date: '', topic: 'colores', notes: '' });
            }}
          >
            <div className="grid-3">
              <input type="date" value={contentForm.date} onChange={(e) => setContentForm({ ...contentForm, date: e.target.value })} required />
              <select value={contentForm.topic} onChange={(e) => setContentForm({ ...contentForm, topic: e.target.value })}>
                <option value="colores">Colores</option>
                <option value="números">Números</option>
                <option value="juegos">Juegos</option>
                <option value="canciones">Canciones</option>
                <option value="temas trabajados">Temas trabajados</option>
              </select>
              <input placeholder="Notas" value={contentForm.notes} onChange={(e) => setContentForm({ ...contentForm, notes: e.target.value })} />
            </div>
            <button type="submit">Agregar contenido</button>
          </form>
          <ul className="list compact tags">
            {contents.slice(0, 8).map((item) => <li key={item.id}>{item.topic} · {item.date}</li>)}
          </ul>
        </article>
      </div>
    </section>
  );
}
