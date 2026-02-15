import CalendarBoard from '../components/CalendarBoard';
import EventQuickAdd from '../components/EventQuickAdd';

export default function CalendarView({ events, onCreateEvent }) {
  return (
    <section className="view-stack">
      <EventQuickAdd onCreate={onCreateEvent} />
      <CalendarBoard events={events} />
    </section>
  );
}
