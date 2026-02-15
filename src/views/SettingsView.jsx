export default function SettingsView({ reminders, onCreateReminder, onLogout }) {
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onCreateReminder({
      event_id: null,
      task_id: null,
      minutes_before: Number(formData.get('minutes_before')),
      custom_message: formData.get('custom_message') || 'Recordatorio pedagógico',
      daily_summary: formData.get('daily_summary') === 'on',
    });
    event.currentTarget.reset();
  };

  return (
    <section className="view-stack">
      <article className="card">
        <h2>Ajustes</h2>
        <ul className="list compact">
          <li>Idioma por defecto: Español</li>
          <li>Perfil docente: activo</li>
          <li>Notificaciones: habilitadas por navegador</li>
          <li>Exportar datos: disponible desde reportes PDF de calendario</li>
        </ul>
        <button onClick={onLogout}>Cerrar sesión</button>
      </article>

      <article className="card">
        <h3>Recordatorios pedagógicos</h3>
        <form onSubmit={submit} className="grid-2">
          <input name="minutes_before" type="number" min="1" placeholder="Minutos antes" required />
          <input name="custom_message" placeholder="Mensaje" />
          <label className="full checkbox"><input name="daily_summary" type="checkbox" /> Enviar resumen diario</label>
          <button className="full" type="submit">Guardar recordatorio</button>
        </form>
        <ul className="list compact">
          {reminders.slice(0, 8).map((item) => <li key={item.id}>{item.minutes_before} min · {item.custom_message || 'Recordatorio'} {item.daily_summary ? '(resumen diario)' : ''}</li>)}
        </ul>
      </article>
    </section>
  );
}
