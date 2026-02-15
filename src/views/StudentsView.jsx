import { useMemo, useState } from 'react';

export default function StudentsView({ students, onCreateStudent, onSelectStudent }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => students.filter((student) => student.full_name.toLowerCase().includes(query.toLowerCase())),
    [students, query],
  );

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateStudent({
      full_name: formData.get('full_name'),
      age: Number(formData.get('age')) || null,
      birthday: formData.get('birthday') || null,
      group_name: formData.get('group_name') || null,
      guardian_contact: formData.get('guardian_contact') || null,
      progress_status: 'en_proceso',
    });
    event.currentTarget.reset();
  };

  return (
    <section className="view-stack">
      <article className="card">
        <h2>Alumnos</h2>
        <input placeholder="Buscar alumno" value={query} onChange={(e) => setQuery(e.target.value)} />
        <form onSubmit={submit} className="grid-2">
          <input name="full_name" placeholder="Nombre" required />
          <input name="age" type="number" min="1" placeholder="Edad" />
          <input name="birthday" type="date" />
          <input name="group_name" placeholder="Sala / grupo" />
          <input className="full" name="guardian_contact" placeholder="Contacto familiar" />
          <button className="full" type="submit">Agregar alumno</button>
        </form>
      </article>

      <article className="card">
        <ul className="list clean-list">
          {filtered.map((student) => (
            <li key={student.id}>
              <button className="list-btn" onClick={() => onSelectStudent(student.id)}>
                <strong>{student.full_name}</strong>
                <small>{student.group_name || 'Sin sala'} · {student.age ? `${student.age} años` : 'edad s/d'}</small>
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
