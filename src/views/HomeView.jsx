import TaskPanel from '../components/TaskPanel';

export default function HomeView({
  events = [],
  tasks = [],
  reminders = [],
  attendance = [],
  observations = [],
  plannings = [],
  onCreateTask,
  onToggleTask,
  onCreatePlanning
}) {
  const today = new Date().toISOString().slice(0, 10);

  const todayEvents = events.filter(event => event.date === today);
  const upcoming = events.slice(0, 5);
  const activeReminders = reminders.filter(item => !item.daily_summary).slice(0, 5);

  return (
    <section className="view-stack">
      <article className="card hero-docente">
        <h1>Hoy</h1>
        <p>Resumen rápido de la jornada docente.</p>

        <div className="grid-4 mini-stats">
          <div><strong>{todayEvents.length}</strong><span>clases hoy</span></div>
          <div><strong>{activeReminders.length}</strong><span>recordatorios activos</span></div>
          <div><strong>{attendance.length}</strong><span>asistencias registradas</span></div>
          <div><strong>{observations.length}</strong><span>observaciones</span></div>
        </div>
      </article>

      <article className="card">
        <h3>Próximos eventos</h3>
        <ul className="list compact">
          {upcoming.map(event => (
            <li key={event.id}>
              {event.date} · {event.start_time} · {event.title}
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Planificación semanal</h3>
        <PlanningQuickAdd onCreatePlanning={onCreatePlanning} />
        <ul className="list compact">
          {plannings.slice(0, 5).map(item => (
            <li key={item.id}>
              {item.weekday}: {item.activities}
            </li>
          ))}
        </ul>
      </article>

      <TaskPanel
        tasks={tasks}
        events={events}
        onCreateTask={onCreateTask}
        onToggleDone={onToggleTask}
      />
    </section>
  );
}

function PlanningQuickAdd({ onCreatePlanning }) {
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onCreatePlanning({
      week_start: formData.get('week_start'),
      weekday: formData.get('weekday'),
      activities: formData.get('activities'),
    });

    event.currentTarget.reset();
  };

  return (
    <form onSubmit={submit}>
      <div className="grid-3">
        <input name="week_start" type="date" required />
        <select name="weekday">
          <option>Lunes</option>
          <option>Martes</option>
          <option>Miércoles</option>
          <option>Jueves</option>
          <option>Viernes</option>
        </select>
        <input name="activities" placeholder="Actividad del día" required />
      </div>
      <button type="submit">Agregar planificación</button>
    </form>
  );
}
