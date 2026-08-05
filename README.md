# Lerycke Martí — Demo de gestión de proyectos de interiorismo

Demo web para el estudio de interiorismo **Lerycke Martí #designstudio**. Permite gestionar proyectos de reforma de principio a fin: desde la visita al cliente hasta la memoria de calidades, pasando por el plan maestro con IA, presupuesto, renders y verificación final.

## Stack

- **Vite** + **React** (JSX)
- **Tailwind CSS** v3.4
- **React Router** v6
- **Context API** (auth y proyectos)
- Sin librerías UI externas, sin TypeScript

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
cd web
npm install
npm run dev
```

La app se abre en `http://localhost:5173` (o el primer puerto libre).

## Login de demo

```
Email:    admin@example.com
Password: secret
```

Las credenciales se muestran en la propia pantalla de login.

## Estructura del proyecto

```
lerycke_marti_demo/
├── web/                        # Aplicación React + Tailwind
│   ├── public/
│   │   ├── brand/              # Logos de la marca
│   │   └── renders/            # Imágenes de ejemplo de renders
│   ├── src/
│   │   ├── components/
│   │   │   ├── login/          # Pantalla de acceso
│   │   │   ├── new-project/    # Stepper de nuevo proyecto + multimedia
│   │   │   └── project-sheet/  # Ficha del proyecto y pestañas
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Sesión (login/registro/logout)
│   │   │   └── ProjectsContext.jsx # Store de proyectos en memoria
│   │   ├── data/
│   │   │   ├── projects.js         # 3 proyectos mock (SON POU, Cafe BOU, Magdalena i Pere)
│   │   │   ├── clientes.js         # 5 clientes mock
│   │   │   ├── plan-maestro.js     # Plan IA simulado (estancias, trabajos, materiales)
│   │   │   ├── presupuesto.js      # Presupuesto con capítulos, partidas, IVA
│   │   │   ├── renders.js          # 12 modos de generación + 4 renders mock
│   │   │   └── memoria-calidades.js # 8 secciones con marcas reales
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── NewProjectPage.jsx
│   │   │   ├── ProjectSheetPage.jsx
│   │   │   ├── ClientesPage.jsx
│   │   │   ├── PresupuestosPage.jsx
│   │   │   ├── RendersPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── utils/
│   │   │   ├── format.js           # Fechas, IDs, moneda
│   │   │   └── project.js          # Helpers de cliente, estancias, completitud
│   │   ├── App.jsx                 # Rutas
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Tailwind + estilos de impresión
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── prds/                       # 9 PRDs (documentación de producto)
│   ├── 00-login.md
│   ├── 01-dashboard.md
│   ├── 02-new-project.md
│   ├── 02b-datos-proyecto.md
│   ├── 03-project-sheet.md
│   ├── 03a-plan-maestro-ia.md
│   ├── 04-presupuesto.md
│   ├── 05-renders.md
│   └── 06-memoria-calidades.md
├── 01_brand/                   # Logos de la marca (JPG)
├── 02_projects/                # Memorias de calidades y planos (PDF, DWG)
├── 03_budgets/                 # Presupuestos reales (PDF)
├── 04_app_ui/                  # Capturas de pantalla de referencia (PNG)
└── 05_renders_examples/        # Ejemplos de renders (PNG)
```

## Funcionalidades

### Login
Pantalla de acceso obligatoria. Login y registro en una misma pantalla con tabs. Sesión simulada (sin backend).

### Dashboard
KPIs del estudio (proyectos totales, activos, borradores, documentos generados) y cards de proyectos con cliente, ubicación, m², estancias, presupuesto, estado de documentos y badge de estado.

### Nuevo proyecto
Stepper de 2 pasos en una sola pantalla:
1. **Cliente**: seleccionar existente o crear nuevo (nombre, email, teléfono, dirección, ciudad, código postal)
2. **Datos del proyecto + multimedia**: nombre, tipo, estilo, observaciones + carga de imágenes (drag & drop), notas de voz (simuladas con transcripción) y notas de texto. Todo queda en un histórico.

Al guardar se crea el proyecto en estado "borrador" y se redirige a su ficha.

### Ficha del proyecto
Contenedor único con cabecera (nombre, cliente, estado, exportar PDF) y submenú lateral con 6 pestañas:

| Pestaña | Contenido |
|---------|-----------|
| **Cliente** | Datos del cliente, datos del proyecto editables, multimedia (imágenes, notas de voz con transcripción, notas de texto), histórico, botón "Pasar a Plan" |
| **Plan** | Input con texto + multimedia + histórico con checkboxes para seleccionar qué documentos incluir. Generación de plan maestro con IA simulada: estancias, trabajos, materiales sugeridos (Keraben, Roca, TRES, Cortizo, JUNG, Farrow & Ball), análisis de estilo. Botón "Verificar plan" |
| **Presupuesto** | Tablas por capítulo (Demolición, Albañilería, Carpintería, Mobiliario, Honorarios) con partidas, subtotales, base imponible, IVA 21% y total. Botón "Verificar presupuesto" |
| **Renders** | 8 modos de generación (Esbozo, Plano 3D, Street View, Render > Foto real, Variaciones mobiliario, Puntos de vista, Estilos de referencia, Horas del día) + modos adicionales (3D > Render, Antes/Después, Foto a Decoración). Cada modo con modal explicativo. Galería de renders por estancia. Botón "Verificar renders" |
| **Memoria** | 8 secciones (04.1 Pavimentos a 04.8 Mobiliario) con fichas de material (marca, modelo, descripción, ubicación). Botón "Verificar memoria" |
| **Resumen** | 4 métricas (presupuesto, renders, memoria, estancias) + checklist de completitud de los 5 documentos. Check grande cuando todo está verificado |

### Páginas del sidebar

| Página | Contenido |
|--------|-----------|
| **Clientes** | Listado de clientes con modal de información (datos de contacto + proyectos asociados) |
| **Presupuestos** | KPIs (valor total, generados, verificados) + cards por proyecto con total y estado |
| **Renders** | 12 modos de generación con imagen de ejemplo y modal explicativo + renders por proyecto con barra de progreso y galería en modal |

### Exportar ficha (PDF)
Botón en la cabecera de la ficha que genera un PDF único con todo el contenido mediante `window.print()` y estilos de impresión.

## Datos mock

Los proyectos, clientes, materiales y presupuestos están basados en proyectos reales del estudio:

- **SON POU** — Vivienda unifamiliar rústica, Sòller, 136.3 m², 46.898,39 €
- **Cafe BOU** — Reforma integral comercial, Palma, 85 m², 32.450,00 €
- **Magdalena i Pere** — Diseño de interiores, Sòller, 72 m², 18.750,00 €

## Notas

- La autenticación es simulada (sin backend, sin persistencia).
- La generación del plan maestro, presupuesto, renders y memoria es simulada con datos mock y `setTimeout`.
- Las notas de voz son simuladas con animación (sin MediaRecorder) e incluyen una transcripción mock.
- Las imágenes se previsualizan con `URL.createObjectURL` (sin subida a servidor).
- Al recargar la página la sesión se pierde (comportamiento de demo).

## Scripts

```bash
cd web
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Previsualizar build de producción
```