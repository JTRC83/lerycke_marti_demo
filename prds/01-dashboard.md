# 01 Dashboard / Pagina principal

Pantalla de inicio del SaaS LERYCKEMARTI #designestudio. Muestra KPIs del estudio,
cards de proyectos (abiertos y realizados) y define la navegacion global (sidebar +
topbar) comun a toda la app. Requiere login previo.

## Resumen

El dashboard es la landing page tras iniciar sesion. Presenta un panel superior con
KPIs globales (proyectos totales, activos, borradores, documentos generados) y una
rejilla de cards de proyectos. Cada card resume un proyecto con cliente, ubicacion,
m2, estancias, presupuesto total, estado de documentos y estado del proyecto. Desde
aqui se accede a cualquier proyecto existente o se inicia uno nuevo con el boton
"Nuevo proyecto" del topbar.

## Objetivos

- Dar una vision de conjunto del estudio: cuantos proyectos hay, en que estado estan.
- Permitir acceder a cualquier proyecto con un click sobre su card (abre la ficha).
- Mostrar el progreso de documentos de cada proyecto (presupuesto, plan, renders, memoria).
- Iniciar nuevos proyectos desde el boton "Nuevo proyecto".
- Definir la navegacion global (sidebar + topbar) que el resto de PRDs referencian.
- Reflejar la identidad de marca LERYCKEMARTI #designestudio con estetica premium.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/01_dashboard_clientes.png` | Dashboard completo: sidebar izquierdo, topbar, KPIs superiores, rejilla de 3 cards de proyectos (SON POU, Cafe BOU, Magdalena i Pere). |

## Layout y componentes

### Layout global (comun a toda la app, definido aqui y referenciado en el resto de PRDs)

| Zona | Componente | Descripcion |
|------|------------|-------------|
| Sidebar izquierdo (fijo) | `Sidebar` | Logo LERYCKEMARTI arriba, tagline "designestudio", navegacion con tres items: Clientes, Presupuestos, Renders. Fondo de marca, sans-serif de alto contraste. |
| Topbar (superior, fijo) | `Topbar` | Breadcrumb o titulo "Proyectos" a la izquierda, boton primario "+ Nuevo proyecto" a la derecha. |
| Contenido principal | `MainContent` | Area derecha del sidebar, debajo del topbar. Contenido variable por pantalla. |

### Componentes propios del dashboard

**KPI Cards (fila superior)**

Cuatro tarjetas numericas en una fila, cada una con icono, numero grande y etiqueta
inferior.

Datos mock segun captura:

| KPI | Valor |
|-----|-------|
| Proyectos totales | 3 |
| Activos | 1 |
| Borradores | 2 |
| Documentos generados | 8 |

**Project Cards (rejilla principal)**

Rejilla responsive de tarjetas, una por proyecto. Estructura de cada card:

| Elemento | Contenido |
|----------|-----------|
| Nombre proyecto | Ej. "SON POU" (cabecera de la card, tipografia grande). |
| Cliente | Ej. "Xisca i Llorenc" (subtitulo). |
| Direccion | Icono pin + "C/ Son Pou, 12". |
| m2 | Icono + "136.3 m2". |
| Estancias | Icono + "9 estancias". |
| Ubicacion + fecha | "Soller, Mallorca" + "Diciembre 2025". |
| Estilo/concepto | "Rustico mediterraneo" (etiqueta tag). |
| Seccion DOCUMENTOS | Checklist con 4 items: Presupuesto, Plan, Memoria, Renders. Cada item con icono check si generado, circulo vacio si pendiente. Contador "Generados X/4". |
| Presupuesto total | Cifra destacada, ej. "46.898,39 EUR". |
| Estado | Badge: "borrador", "activo" o "completado". |

### Datos de las 3 cards mock (de la captura)

| Campo | SON POU | Cafe BOU | Magdalena i Pere |
|-------|---------|----------|-------------------|
| Nombre | SON POU | Cafe BOU | Magdalena i Pere |
| Cliente | Xisca i Llorenc | Cafe BOU | Magdalena i Pere |
| Direccion | C/ Son Pou, 12 | Av. Sagrada Familia, 8 | C/ Sant Miquel, 45 |
| m2 | 136.3 m2 | 85.0 m2 | 72.0 m2 |
| Estancias | 9 | 4 | 4 |
| Presupuesto | 46.898,39 EUR | 32.450,00 EUR | 18.750,00 EUR |
| Ubicacion | Soller, Mallorca | Palma, Mallorca | Soller, Mallorca |
| Fecha | Diciembre 2025 | Octubre 2025 | Noviembre 2025 |
| Estilo | Rustico mediterraneo | Reforma integral comercial | Diseno de interiores |
| Estado | borrador | activo | borrador |
| Presupuesto | Generado | Generado | Generado |
| Plan | Pendiente | Generado | Pendiente |
| Memoria | Pendiente | Generado | Pendiente |
| Renders | Generados 3/4 | Generados 4/4 | Generados 1/4 |
| Documentos totales | 2/4 | 4/4 | 2/4 |

## Datos y estado

### Entidad Proyecto (campos visibles en la card)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "prj-son-pou" |
| nombre | string | "SON POU" |
| cliente | string | "Xisca i Llorenc" |
| direccion | string | "C/ Son Pou, 12" |
| ciudad | string | "Soller, Mallorca" |
| m2 | number | 136.3 |
| estancias | number | 9 |
| presupuestoTotal | number | 46898.39 |
| fecha | date | "2025-12" |
| estilo | string | "Rustico mediterraneo" |
| estado | enum | borrador / activo / completado |
| docs.presupuesto | boolean | true |
| docs.plan | boolean | false |
| docs.memoria | boolean | false |
| docs.renders | object | { generados: 3, total: 4 } |

### Estados de proyecto

- `borrador`: proyecto creado, documentos parciales.
- `activo`: proyecto en curso con documentos generados.
- `completado`: todos los documentos generados y verificados.

### Entidad KPI (derivada)

| KPI | Calculo |
|-----|---------|
| Proyectos totales | `proyectos.length` |
| Activos | `proyectos.filter(p => p.estado === 'activo').length` |
| Borradores | `proyectos.filter(p => p.estado === 'borrador').length` |
| Documentos generados | Suma de documentos completados en todos los proyectos. |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Click en card de proyecto | Navega a la ficha del proyecto (PRD `03-project-sheet.md`). |
| Click en "+ Nuevo proyecto" (topbar) | Navega al stepper de nuevo proyecto (PRD `02-new-project.md`). |
| Click en "Clientes" (sidebar) | Navega a la vista de clientes (lista de clientes del estudio). |
| Click en "Presupuestos" (sidebar) | Navega a la vista de presupuestos (lista de todos los presupuestos). |
| Click en "Renders" (sidebar) | Navega a la vista de renders (galeria general de renders). |
| Acceder a la app sin sesion | Redirige al login (PRD `00-login.md`). |

## Reglas de negocio

- El dashboard requiere sesion iniciada; sin ella, redirige al login.
- Los proyectos se ordenan por fecha (mas recientes primero) o por estado (activos primero).
- El contador de documentos de cada card refleja el progreso real: Presupuesto, Plan, Memoria, Renders.
- El badge de estado usa la paleta de marca: verde oscuro para activo/completado, tono neutro para borrador.

## Criterios de aceptacion

- [ ] El sidebar fijo muestra el logo LERYCKEMARTI y los tres items: Clientes, Presupuestos, Renders.
- [ ] El topbar muestra el titulo "Proyectos" y el boton "+ Nuevo proyecto".
- [ ] Se renderizan 4 KPI cards con los valores mock: 3, 1, 2, 8.
- [ ] Se renderizan 3 project cards con los datos de SON POU, Cafe BOU y Magdalena i Pere.
- [ ] Cada card muestra nombre, cliente, direccion, m2, estancias, ubicacion, fecha, estilo, checklist de documentos, presupuesto total y badge de estado.
- [ ] El checklist de documentos muestra iconos de check (generado) y circulo (pendiente) con contador X/4.
- [ ] El click en una card navega a la ficha del proyecto (PRD 03).
- [ ] El click en "+ Nuevo proyecto" navega al stepper (PRD 02).
- [ ] Sin sesion iniciada, se redirige al login (PRD 00).
- [ ] La paleta y tipografia coinciden con la identidad de marca (verde oscuro sobre blanco, sans-serif de alto contraste).

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `Sidebar`, `Topbar`, `KpiCard`, `ProjectCard`, `DocumentChecklist`, `StatusBadge`. |
| Layout global | `AppShell` que monta `Sidebar` + `Topbar` + `MainContent`; reutilizado por todas las pantallas con chrome. |
| Ubicacion de assets | Logo y monograma en `01_brand/` (LOGOpinche-web_COMPLETO.jpg para web, LOGOpinche-INSTA_LM.jpg para monograma LM). |
| Captura de referencia | `04_app_ui/01_dashboard_clientes.png`. |
| Datos mock | Array `projects` en `src/data/projects.ts` con los 3 proyectos. Array `kpis` derivado. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |
| Responsive | Rejilla de cards en grid responsive (1 col mobile, 2 col tablet, 3 col desktop). |
| Rutas | `/dashboard` protegida; redirige a `/login` si `sesionIniciada === false`. |

## Fuera de alcance

- Vista detallada de Clientes, Presupuestos y Renders como secciones independientes (navegacion del sidebar). En la demo son destinos de navegacion; no se implementan como pantallas completas en este PRD.
- Filtros y busqueda avanzada de proyectos.
- Edicion de proyectos desde el dashboard.
- Autenticacion multiusuario y roles (el login es demo, un solo usuario mock).