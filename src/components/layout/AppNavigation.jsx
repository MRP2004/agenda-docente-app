const ITEMS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'calendar', label: 'Calendario', icon: '📅' },
  { key: 'students', label: 'Alumnos', icon: '👧' },
  { key: 'tracking', label: 'Seguimiento', icon: '📝' },
  { key: 'settings', label: 'Ajustes', icon: '⚙️' },
];

export default function AppNavigation({ currentView, onChangeView }) {
  return (
    <>
      <aside className="sidebar">
        <h2>Agenda Docente</h2>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-btn ${currentView === item.key ? 'active' : ''}`}
            onClick={() => onChangeView(item.key)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </aside>

      <nav className="bottom-nav">
        {ITEMS.map((item) => (
          <button key={item.key} className={currentView === item.key ? 'active' : ''} onClick={() => onChangeView(item.key)}>
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </>
  );
}
