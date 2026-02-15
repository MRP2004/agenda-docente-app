# Agenda Docente Digital (PWA)

Producto web mobile-first para maestras de jardín de infantes, construido sobre la base existente (FastAPI + SQLite + React PWA) **sin romper** autenticación, calendario, eventos, tareas ni recordatorios.

## Navegación SPA

- **Móvil**: barra inferior con Home, Calendario, Alumnos, Seguimiento, Ajustes.
- **Desktop**: sidebar fija con las mismas secciones.

## Módulos principales

- **Home**: próximos eventos, clases del día, recordatorios activos y resumen rápido.
- **Calendario**: mes/semana/día, categorías por color, eventos y exportación PDF.
- **Alumnos**: listado con buscador y acceso al perfil.
- **Perfil de alumno** (tabs):
  - Seguimiento pedagógico
  - Asistencias históricas
  - Observaciones
  - Contenidos vistos
- **Seguimiento**: estado por alumno con colores (🟢 bien, 🟡 en proceso, 🔴 atención).
- **Ajustes**: perfil docente, idioma español, recordatorios pedagógicos y cierre de sesión.

## Backend actualizado

Se mantienen tablas originales `users`, `events`, `tasks`, `reminders` y se extiende con:

- `students`
- `attendance`
- `observations`
- `plannings`
- `daily_contents`

Todas relacionadas por usuario autenticado.

### Endpoints nuevos

- `POST/GET/GET(id)/PUT/DELETE /api/students`
- `GET /api/students/{id}/profile`
- `POST/GET /api/pedagogical/observations`
- `POST/GET/PUT /api/pedagogical/attendance`
- `POST/GET /api/pedagogical/plannings`
- `POST/GET /api/pedagogical/contents`

## Puesta en marcha

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Variable opcional:

```bash
VITE_API_URL=http://localhost:8000
```
