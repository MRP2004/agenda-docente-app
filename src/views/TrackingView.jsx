export default function TrackingView({ students, observations }) {
  const statusColor = {
    bien: '🟢',
    en_proceso: '🟡',
    atencion: '🔴',
  };

  return (
    <section className="view-stack">
      <article className="card">
        <h2>Seguimiento pedagógico</h2>
        <p>Vista general por alumno con estado.</p>
        <ul className="list clean-list">
          {students.map((student) => (
            <li key={student.id}>
              <div className="status-row">
                <span>{statusColor[student.progress_status] || '🟡'}</span>
                <strong>{student.full_name}</strong>
                <small>{student.group_name || 'Sin sala'}</small>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Observaciones recientes</h3>
        <ul className="list compact">
          {observations.slice(0, 10).map((item) => (
            <li key={item.id}>{item.date} · Alumno #{item.student_id} · {item.behavior_mood || 's/d'} · {item.participation || 's/d'}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
