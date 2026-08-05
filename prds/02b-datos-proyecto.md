# 02b Datos del proyecto y multimedia

Apartado previo al Plan maestro donde se recogen los datos del proyecto (nombre,
tipo, estilo, observaciones del cliente) y la multimedia de la visita (imagenes,
notas de voz, texto). Todo queda guardado en un historico visible despues en la
pestana Cliente de la ficha.

## Resumen

Este modulo aparece en dos puntos del flujo:

1. Durante la creacion del proyecto, como Paso 2 del stepper (PRD `02-new-project.md`).
2. Dentro de la ficha del proyecto, como contenido de la pestana Cliente (PRD
   `03-project-sheet.md`), donde se puede seguir anadiendo multimedia y consultar el
   historico.

Recoge los datos descriptivos del proyecto y la multimedia de la visita al cliente.
La multimedia incluye: imagenes (drag & drop + preview + galeria, funcional), notas
de voz (grabacion simulada con animacion, maqueta pura) y texto (observaciones). Cada
entrada queda fechada en un historico que se ve dentro de la pestana Cliente de la
ficha.

## Objetivos

- Recoger nombre, tipo, estilo y observaciones del proyecto.
- Permitir cargar imagenes de la visita con drag & drop, preview y galeria.
- Simular la grabacion de notas de voz con animacion (sin MediaRecorder real).
- Guardar texto de observaciones del cliente.
- Mantener un historico fechado de toda la multimedia y los datos editados.
- Mostrar ese historico dentro de la pestana Cliente de la ficha del proyecto.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/04_tipo_proyecto.png` | Campos Nombre del proyecto*, Tipo de proyecto, Estilo / concepto. Base para el bloque de datos. |
| `04_app_ui/05_plan_maestro_con_ia.png` | Referencia de zona de carga (audio, fotos, texto) que aqui se adapta al apartado Datos del proyecto. |

No existe captura propia del apartado Datos del proyecto como pestana; se disena nueva
reutilizando los patrones de carga de la captura 05.

## Layout y componentes

### Componentes propios

**Bloque Datos del proyecto**

| Campo | Tipo | Obligatorio | Placeholder / Ejemplo |
|-------|------|-------------|-----------------------|
| Nombre del proyecto | text | Si (en creacion) | "Ej: SON POU, Ramon Llull 31..." |
| Tipo de proyecto | dropdown | No | "Seleccionar..." |
| Estilo / concepto | dropdown | No | "Rustico mediterraneo, minimalista..." |
| Observaciones del cliente | textarea | No | "Notas de la visita, peticiones del cliente..." |

**MediaUploader (componente compartido)**

Zona de carga con tres tipos de input:

| Tipo | Componente | Comportamiento |
|------|------------|----------------|
| Imagenes | `ImageDropzone` | Drag & drop + click para seleccionar. Preview en miniatura. Galeria en grid. Funcional: usa `URL.createObjectURL` para preview local. |
| Notas de voz | `VoiceRecorder` | Boton "Grabar nota de voz". Al pulsar, animacion de grabacion (onda/pulso + cronometro). Al parar, anade una entrada de nota al historico. No usa MediaRecorder; es maqueta pura. |
| Texto | `ObservacionesField` | Textarea para texto adicional de la visita. |

**Historico (TimelineMedia)**

Lista vertical cronologica (mas reciente arriba) de todas las entradas anadidas. Cada
entrada:

| Elemento | Contenido |
|----------|-----------|
| Fecha y hora | Ej. "05/08/2025 10:32" |
| Tipo | Icono + etiqueta: "Imagen", "Nota de voz", "Texto", "Datos editados" |
| Contenido | Preview (imagen), nombre de nota (voz), texto (observaciones) o resumen de campos editados. |
| Acciones | Eliminar entrada (icono X). |

## Datos y estado

### Entidad MultimediaEntry (item del historico)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "med-001" |
| tipo | enum | "imagen" / "nota_voz" / "texto" / "datos_editados" |
| fecha | datetime | "2025-08-05T10:32:00" |
| contenido | object | { url, nombre, texto, camposEditados } segun tipo |
| proyectoId | string | "prj-001" |

### Estado del MediaUploader

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| imagenes | array | Lista de imagenes cargadas con preview. |
| grabando | boolean | True mientras simula grabacion de voz. |
| duracionGrabacion | number | Segundos transcurridos en la grabacion simulada. |
| historico | array | Lista de `MultimediaEntry` ordenada por fecha. |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Arrastrar imagen al dropzone | Se anade a `imagenes` con preview local y al historico como entrada "imagen". |
| Click en dropzone y seleccionar archivo | Igual que arrastrar. |
| Click en "Grabar nota de voz" | Inicia animacion de grabacion (cronometro + pulso). |
| Click en "Detener" | Termina la grabacion simulada y anade una entrada "nota_voz" al historico con duracion. |
| Escribir en observaciones | Al guardar (blur o boton), anade/actualiza entrada "texto" en el historico. |
| Editar campos de datos | Al guardar cambios, anade entrada "datos_editados" con los campos modificados. |
| Click en X de una entrada del historico | Elimina esa entrada del historico. |
| Abrir pestana Cliente en la ficha | Muestra el historico completo cargado aqui. |

## Reglas de negocio

- Las imagenes son funcionales: drag & drop, preview y galeria reales (no simuladas).
- Las notas de voz son simuladas: animacion de grabacion sin MediaRecorder; no se almacena audio real, solo el registro de la nota con su duracion.
- Todo entry del historico queda fechado y asociado al proyecto.
- El historico es la fuente unica de verdad de la multimedia del proyecto; se ve en la pestana Cliente de la ficha.
- En modo creacion (Paso 2 del stepper), el historico empieza vacio y se va llenando segun se carga multimedia; al guardar el proyecto, el historico se persiste con el proyecto.
- En modo ficha (pestana Cliente), se puede seguir anadiendo multimedia al historico en cualquier momento.
- Las imagenes se almacenan como `URL.createObjectURL` en la demo; no hay subida a servidor.

## Criterios de aceptacion

- [ ] El bloque Datos del proyecto muestra Nombre, Tipo, Estilo y Observaciones.
- [ ] El ImageDropzone acepta imagenes por drag & drop y por click.
- [ ] Las imagenes cargadas muestran preview en una galeria en grid.
- [ ] El boton "Grabar nota de voz" inicia una animacion de grabacion con cronometro.
- [ ] Al detener la grabacion, se anade una entrada "nota_voz" al historico.
- [ ] El textarea de observaciones permite guardar texto en el historico.
- [ ] El historico muestra las entradas ordenadas por fecha (mas reciente arriba).
- [ ] Cada entrada del historico muestra fecha, tipo, contenido y boton de eliminar.
- [ ] El historico es accesible desde la pestana Cliente de la ficha (PRD 03).
- [ ] No se usa MediaRecorder; la grabacion es una maqueta con animacion.

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `ProjectDataForm`, `MediaUploader`, `ImageDropzone`, `VoiceRecorder`, `ObservacionesField`, `TimelineMedia`, `MediaEntry`. |
| Capturas de referencia | `04_app_ui/04_tipo_proyecto.png`, `04_app_ui/05_plan_maestro_con_ia.png`. |
| Datos mock | Entradas de historico mock en `src/data/multimedia.ts` para los proyectos existentes (SON POU, Cafe BOU, Magdalena i Pere). |
| Preview de imagenes | `URL.createObjectURL(file)` para preview local sin servidor. |
| Grabacion simulada | `useState` + `setInterval` para el cronometro; animacion con Tailwind (pulse/onda). |
| Historico | Array en estado del proyecto; persistir junto al proyecto en `src/data/projects.ts`. |
| Reutilizacion | `MediaUploader` se usa en el Paso 2 del stepper (PRD 02) y en la pestana Cliente de la ficha (PRD 03). |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Grabacion real de audio con MediaRecorder.
- Subida de imagenes a servidor o almacenamiento en la nube.
- Transcripcion de notas de voz a texto.
- Edicion avanzada de imagenes (recorte, rotacion, filtros).
- Compartir multimedia con el cliente via enlace.
- Versionado de datos del proyecto con diff entre versiones (el historico es lineal, sin comparacion).