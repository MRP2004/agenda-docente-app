import { useState } from 'react';

const initialState = {
  title: '',
  date: '',
  start_time: '08:00',
  end_time: '09:00',
  location: '',
  category: 'subject',
  notes: '',
  recurrence: 'none',
  recurrence_rule: '',
};

export default function EventQuickAdd({ onCreate }) {
  const [form, setForm] = useState(initialState);

  const submit = async (e) => {
    e.preventDefault();
    await onCreate({
      ...form,
      recurrence: form.recurrence === 'none' ? null : form.recurrence,
      recurrence_rule: form.recurrence_rule || null,
    });
    setForm(initialState);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Carga rápida de evento</h3>
      <input value={form.title} placeholder="Título" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <div className="grid-2">
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="subject">Materia</option>
          <option value="practice">Práctica</option>
          <option value="exam">Evaluación</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      <div className="grid-2">
        <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
        <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
      </div>
      <input value={form.location} placeholder="Lugar" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <select value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })}>
        <option value="none">Sin recurrencia</option>
        <option value="daily">Diaria</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
        <option value="custom">Personalizada</option>
      </select>
      {form.recurrence === 'custom' && (
        <input placeholder="Regla personalizada" value={form.recurrence_rule} onChange={(e) => setForm({ ...form, recurrence_rule: e.target.value })} />
      )}
      <textarea placeholder="Notas" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button type="submit">Agregar evento</button>
    </form>
  );
}
