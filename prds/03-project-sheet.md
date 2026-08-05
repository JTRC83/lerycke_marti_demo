# 03 Ficha del proyecto

Documento central del proyecto. Contiene un submenú lateral con pestañas (Cliente,
Plan, Presupuesto, Renders, Memoria) y un boton unico de exportacion de la ficha
completa en PDF. Integra el resumen final del proyecto (sustituye al antiguo PRD 07).

## Resumen

Tras guardar un proyecto nuevo (PRD `02-new-project.md`), se genera su ficha. La
ficha es el contenedor unico del proyecto: un shell con cabecera del proyecto, un
submenú lateral de pestañas y un area de contenido que cambia segun la pestaña
activa. Las pestañas son: Cliente, Plan, Presupuesto, Renders y Memoria. Cada
pestaña se documenta en su propio PRD y referencia este shell para el contenedor.

La ficha tambien incluye una seccion **Resumen** (metricas globales del proyecto y
estado de completitud) que sustituye a la antigua pantalla "Proyecto completado"
(PRD 07 eliminado). El boton **Exportar ficha (PDF)** genera un unico PDF con toda
la ficha, no por pestaña y no en ZIP.

## Objetivos

- Ser el contenedor unico de todo el trabajo del proyecto.
- Ofrecer navegacion lateral entre Cliente, Plan, Presupuesto, Renders y Memoria.
- Mostrar el estado global del proyecto y un resumen de metricas.
- Permitir exportar la ficha completa en un unico PDF.
- Reemplazar la pantalla de "proyecto completado" por una seccion de Resumen integrada.
- Mantener coherencia de datos entre el dashboard, la ficha y cada pestaña.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/15_proyecto_completado.png` | Referencia del resumen final (4 tarjetas: Presupuesto, Renders, Memoria, Estancias) que aqui se integra como seccion Resumen de la ficha. |
| `04_app_ui/01_dashboard_clientes.png` | Referencia de cabecera de proyecto (nombre, cliente, estado) replicada en la cabecera de la ficha. |

El shell de la ficha con submenú lateral es nuevo; no hay captura previa del layout
con pestañas laterales. Se disena nuevo siguiendo la paleta de marca.

## Layout y componentes

### Layout global

Sidebar y topbar fijos (ver PRD `01-dashboard.md`). Dentro del `MainContent`, la
ficha anade su propio sub-layout:

| Zona | Componente | Descripcion |
|------|------------|-------------|
| Cabecera de ficha | `SheetHeader` | Nombre del proyecto, cliente, estado (badge) y boton "Exportar ficha (PDF)". Fija arriba del contenido. |
| Submenú lateral | `SheetTabs` | Menu vertical a la izquierda del contenido, dentro del MainContent. Items: Cliente, Plan, Presupuesto, Renders, Memoria, Resumen. Item activo resaltado. |
| Contenido de pestaña | `SheetContent` | Area derecha del submenú. Renderiza la pestaña activa. |

### Estructura del submenú lateral (SheetTabs)

| Orden | Pestana | PRD de contenido |
|-------|---------|------------------|
| 1 | Cliente | PRD `02b-datos-proyecto.md` (datos + multimedia + historico) |
| 2 | Plan | PRD `03a-plan-maestro-ia.md` |
| 3 | Presupuesto | PRD `04-presupuesto.md` |
| 4 | Renders | PRD `05-renders.md` |
| 5 | Memoria | PRD `06-memoria-calidades.md` |
| 6 | Resumen | Seccion propia de este PRD (ver mas abajo) |

Notas:

- Es un submenú lateral, NO tabs horizontales.
- El orden refleja el flujo logico (Cliente -> Plan -> Presupuesto -> Renders -> Memoria -> Resumen).
- Resumen es la ultima pestana y reemplaza a la antigua pantalla 07.

### SheetHeader

| Elemento | Contenido |
|----------|-----------|
| Nombre del proyecto | Ej. "SON POU" (tipografia grande). |
| Cliente | Ej. "Xisca i Llorenc" (subtitulo). |
| Badge de estado | "borrador" / "activo" / "completado". |
| Boton "Exportar ficha (PDF)" | Boton primario a la derecha. Genera un unico PDF con toda la ficha. |

### Seccion Resumen (pestana 6, integrada del antiguo PRD 07)

Muestra metricas globales del proyecto y estado de completitud. Es lo que antes era
la pantalla "Proyecto completado".

Cabecera:

| Elemento | Contenido |
|----------|-----------|
| Icono de completado | Check grande (solo si estado === "completado"). |
| Titulo | "Resumen del proyecto" |
| Mensaje | "Estado de los documentos del proyecto" |

**Tarjetas de metricas (4)**

| Tarjeta | Valor | Etiqueta |
|---------|-------|----------|
| Presupuesto | 46.898,39 EUR | Presupuesto total |
| Renders | 4 generados | Renders |
| Memoria | 8 categorias | Memoria |
| Estancias | 6 | Estancias |

Notas de coherencia de datos:

- Estancias: usar el valor del plan maestro (6 estancias detectadas en SON POU) como fuente unica de verdad para ficha y resumen. El dashboard puede mostrar 9 por un conteo distinto (subestancias); en la ficha se usa el del plan.
- Memoria: 8 categorias, coherente con PRD 06.
- Presupuesto: 46.898,39 EUR, coherente con PRD 04.
- Renders: 4, coherente con PRD 05.

**Checklist de completitud**

| Documento | Estado |
|-----------|--------|
| Cliente + datos | OK / pendiente |
| Plan maestro | generado / pendiente |
| Presupuesto | generado / pendiente |
| Renders | generados / pendiente |
| Memoria | generada / pendiente |

Cuando los 5 estan OK, el proyecto pasa a estado "completado" y aparece el icono de
check grande en la cabecera del Resumen.

## Datos y estado

### Estado de la ficha (shell)

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| proyectoId | string | Proyecto activo. |
| pestanaActiva | enum | "cliente" / "plan" / "presupuesto" / "renders" / "memoria" / "resumen". |
| exportando | boolean | Estado de carga al exportar PDF. |

### Entidad Proyecto (campos de cabecera)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "prj-son-pou" |
| nombre | string | "SON POU" |
| cliente | string | "Xisca i Llorenc" |
| estado | enum | borrador / activo / completado |
| documentos | object | { cliente, plan, presupuesto, renders, memoria } cada uno booleano o estado. |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Abrir ficha desde dashboard (click en card) | Carga la ficha con pestana "cliente" activa por defecto. |
| Click en item del submenú lateral | Cambia `pestanaActiva` y renderiza esa pestaña. |
| Click en "Exportar ficha (PDF)" | `exportando=true`, genera un unico PDF con toda la ficha y lo descarga. |
| Completar los 5 documentos desde sus pestañas | El proyecto pasa a estado "completado"; Resumen muestra el check grande. |
| Click en "Ir al dashboard" (en Resumen) | Vuelve al dashboard (PRD 01). El proyecto aparece con badge "completado". |

## Reglas de negocio

- La ficha es la unica vista de detalle del proyecto; no hay pantallas sueltas por documento fuera de la ficha.
- El submenú lateral es vertical, no tabs horizontales.
- La exportacion es un unico PDF con toda la ficha; no hay export por pestaña ni descarga ZIP.
- El estado del proyecto se calcula: si los 5 documentos estan completos, pasa a "completado"; si al menos uno esta en curso, "activo"; si ninguno, "borrador".
- Resumen reemplaza a la antigua pantalla 07; el ZIP desaparece y se sustituye por el PDF unico de ficha.
- Cada pestaña referencia este PRD para el shell y describe solo su contenido propio.
- Los datos del proyecto (clientes, plan, presupuesto, renders, memoria) se mantienen en una fuente unica (`src/data/projects.ts`) para coherencia con el dashboard.

## Criterios de aceptacion

- [ ] La cabecera de la ficha muestra nombre del proyecto, cliente, badge de estado y boton "Exportar ficha (PDF)".
- [ ] El submenú lateral muestra 6 items verticales: Cliente, Plan, Presupuesto, Renders, Memoria, Resumen.
- [ ] El item activo del submenú esta resaltado.
- [ ] Al cambiar de pestaña, solo cambia el contenido derecho; la cabecera y el submenú permanecen.
- [ ] La pestana Resumen muestra 4 tarjetas: Presupuesto (46.898,39 EUR), Renders (4), Memoria (8), Estancias (6).
- [ ] La pestana Resumen muestra la checklist de completitud de los 5 documentos.
- [ ] Cuando los 5 documentos estan completos, el proyecto pasa a "completado" y Resumen muestra el check grande.
- [ ] El boton "Exportar ficha (PDF)" genera un unico PDF con toda la ficha (no por pestaña, no ZIP).
- [ ] Al abrir la ficha desde el dashboard, la pestana por defecto es "cliente".
- [ ] La paleta y tipografia coinciden con la identidad de marca.

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `ProjectSheet`, `SheetHeader`, `SheetTabs`, `SheetContent`, `ResumenTab`, `ResumenCard`, `CompletitudChecklist`. |
| Layout | `ProjectSheet` monta `SheetHeader` + grid 2 col: `SheetTabs` (col estrecha izq) + `SheetContent` (col ancha der). |
| Ruta | `/proyectos/:id` con pestana como query param o estado local (`?tab=plan`). |
| Export PDF | Funcion `exportarFichaPDF(proyecto)` que recorre todas las pestañas y genera un unico PDF. Puede usar `window.print()` con un layout de impresion, o una libreria de PDF si esta disponible. |
| Datos mock | Fuente unica en `src/data/projects.ts`; cada pestaña lee su seccion del proyecto. |
| Coherencia de estancias | Usar el valor del plan maestro (6) como fuente unica para ficha y resumen. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Edicion del nombre/estado del proyecto desde la cabecera de la ficha (solo lectura en cabecera; la edicion vive en cada pestaña).
- Compartir la ficha via enlace publico.
- Versionado de la ficha con historial de cambios global.
- Descarga ZIP de documentos (eliminado; reemplazado por PDF unico).
- Export por pestaña individual (eliminado; solo PDF completo).
- Notificaciones al cliente del estado del proyecto.