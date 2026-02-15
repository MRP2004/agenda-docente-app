import { useState } from 'react';

export default function TaskPanel({ tasks, events, onCreateTask, onToggleDone }) {
  const [form, setForm] = useState({ title: '', due_date: '', priority: 'medium', notes: '', event_id: '' });

  const submit = async (e) => {
    e.preventDefault();
    await onCreateTask({ ...form, event_id: form.event_id ? Number(form.event_id) : null });
    setForm({ title: '', due_date: '', priority: 'medium', notes: '', event_id: '' });
  };

  return (
    <div className="card">
      <h3>Tareas</h3>
      <form onSubmit={submit}>
        <input value={form.title} placeholder="Título de tarea" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <div className="grid-2">
          <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <select value={form.event_id} onChange={(e) => setForm({ ...form, event_id: e.target.value })}>
          <option value="">Vincular a evento (opcional)</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
        <textarea value={form.notes} placeholder="Notas" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button type="submit">Agregar tarea</button>
      </form>

      <ul className="list">
        {tasks.map((task) => (
          <li key={task.id}>
            <button className="link" onClick={() => onToggleDone(task)}>
              {task.is_done ? '✅' : '⬜'} {task.title}
            </button>
            <small>{task.priority} · {task.due_date || 'sin fecha'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
