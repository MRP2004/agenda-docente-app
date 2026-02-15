import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';

export default function CalendarBoard({ events }) {
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: `${event.date}T${event.start_time}`,
    end: `${event.date}T${event.end_time}`,
    backgroundColor: event.color,
    borderColor: event.color,
  }));

  const exportPdf = (scope) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Agenda Docente - Vista ${scope}`, 10, 15);
    doc.setFontSize(10);
    events.forEach((event, index) => {
      const line = `${event.date} ${event.start_time}-${event.end_time} | ${event.title} | ${event.category}`;
      doc.text(line, 10, 25 + index * 7);
    });
    doc.save(`agenda-${scope}.pdf`);
  };

  return (
    <div className="card">
      <div className="toolbar">
        <h3>Calendario</h3>
        <div className="grid-3">
          <button onClick={() => exportPdf('dia')}>PDF día</button>
          <button onClick={() => exportPdf('semana')}>PDF semana</button>
          <button onClick={() => exportPdf('mes')}>PDF mes</button>
        </div>
      </div>
      <FullCalendar
        locale="es"
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek',
        }}
        buttonText={{ today: 'Hoy', day: 'Día', week: 'Semana', month: 'Mes', listWeek: 'Próximos 7 días' }}
        events={calendarEvents}
        height="auto"
      />
    </div>
  );
}
