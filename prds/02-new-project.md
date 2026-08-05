# 02 Nuevo proyecto (stepper)

Pantalla unica de creacion de un nuevo proyecto de interiorismo. Dos pasos con
stepper: Paso 1 Cliente, Paso 2 Datos del proyecto + multimedia. Al guardar, se
genera la ficha del proyecto y se redirige a ella.

## Resumen

El nuevo proyecto se crea en una sola pantalla con un stepper de dos pasos. Paso 1:
datos del cliente (seleccion de cliente existente o alta de uno nuevo). Paso 2:
datos del proyecto (nombre, tipo, estilo, observaciones del cliente) y carga de
multimedia (imagenes, notas de voz, texto) con historico. Al pulsar "Guardar", se
crea el proyecto en estado "borrador" y se redirige a su ficha (PRD
`03-project-sheet.md`), donde se continuan plan, presupuesto, renders y memoria.

No hay wizard multipantalla; el stepper vive en una unica vista y cambia su
contenido sin cambiar de ruta.

## Objetivos

- Recoger los datos minimos del cliente (existente o nuevo) y asociarlo al proyecto.
- Definir nombre, tipo, estilo y observaciones del proyecto.
- Permitir cargar imagenes, notas de voz (simuladas) y texto de la visita, con historico.
- Mostrar el progreso del stepper (Cliente -> Datos+multimedia -> Guardar).
- Validar los campos obligatorios antes de avanzar y de guardar.
- Al guardar, crear el proyecto y redirigir a su ficha.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/02_datos_cliente.png` | Formulario "Datos del cliente": seleccion de cliente existente o campos de nuevo cliente (Nombre*, Email, Ciudad, Telefono, Direccion, Codigo postal). |
| `04_app_ui/03_flujo_proyecto_nuevo.png` | Cabecera "Nuevo proyecto" con tagline "De la visita al cliente a la memoria de calidades, un solo flujo" y paso Cliente activo. |
| `04_app_ui/04_tipo_proyecto.png` | Formulario de datos del proyecto: Nombre del proyecto*, Tipo de proyecto (dropdown), Estilo / concepto (dropdown). |

## Layout y componentes

### Layout global

Sidebar y topbar fijos (ver PRD `01-dashboard.md`). El contenido principal muestra el
stepper. El topbar mantiene el titulo "Proyectos" y el boton "+ Nuevo proyecto".

### Componentes propios

**StepperHeader**

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Nuevo proyecto" (tipografia grande). |
| Tagline | "De la visita al cliente a la memoria de calidades, un solo flujo" |
| Stepper | Indicador visual de 2 pasos: "1. Cliente" y "2. Datos del proyecto". Paso activo resaltado, paso siguiente atenuado. No incluye los pasos de la ficha (plan, presupuesto, etc.); esos viven en la ficha. |

**Paso 1: Datos del cliente**

| Campo | Tipo | Obligatorio | Placeholder / Ejemplo |
|-------|------|-------------|-----------------------|
| Cliente existente | Selector / dropdown | No | "Selecciona un cliente existente o crea uno nuevo" |
| Nombre | text | Si | "Nombre del cliente" |
| Email | email | No | "cliente@email.com" |
| Ciudad | text | No | "Soller, Mallorca" |
| Telefono | tel | No | "+34 6XX XXX XXX" |
| Direccion | text | No | "C/ Nombre, numero" |
| Codigo postal | text | No | "07100" |

Si se selecciona un cliente existente, los campos se autocompletan. Si se crea uno
nuevo, el campo Nombre es obligatorio (marcado con *).

**Paso 2: Datos del proyecto + multimedia**

Bloque A - Datos del proyecto:

| Campo | Tipo | Obligatorio | Placeholder / Ejemplo |
|-------|------|-------------|-----------------------|
| Nombre del proyecto | text | Si | "Ej: SON POU, Ramon Llull 31..." |
| Tipo de proyecto | dropdown | No | "Seleccionar..." |
| Estilo / concepto | dropdown | No | "Rustico mediterraneo, minimalista..." |
| Observaciones del cliente | textarea | No | "Notas de la visita, peticiones del cliente..." |

Bloque B - Multimedia de la visita (ver PRD `02b-datos-proyecto.md` para el detalle
del componente de carga). En este paso se incluye la zona de carga:

- Imagenes: drag & drop + preview + galeria (funcional).
- Notas de voz: boton de grabar con animacion simulada (no MediaRecorder real).
- Texto: textarea ya cubierto por "Observaciones del cliente".

Todo lo cargado aqui queda guardado en el historico del proyecto y se ve despues
dentro de la pestana Cliente de la ficha (PRD 03 / 02b).

**Navegacion del stepper**

| Boton | Accion |
|-------|--------|
| Anterior | Vuelve al paso previo (en paso 1, vuelve al dashboard). |
| Siguiente | Valida paso 1 y avanza a paso 2. |
| Guardar | Valida paso 2, crea el proyecto en estado "borrador" y redirige a la ficha (PRD 03). |

## Datos y estado

### Entidad Cliente

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "cli-001" |
| nombre | string | "Xisca i Llorenc" |
| email | string | "xisca@email.com" |
| telefono | string | "+34 6XX XXX XXX" |
| direccion | string | "C/ Son Pou, 12" |
| ciudad | string | "Soller, Mallorca" |
| codigoPostal | string | "07100" |

### Entidad Proyecto (campos del stepper)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "prj-001" |
| nombre | string | "SON POU" |
| tipo | enum | "Reforma integral vivienda" |
| estilo | string | "Rustico mediterraneo" |
| observacionesCliente | string | "Quiere mas luz natural en el salon..." |
| clienteId | string | "cli-001" |
| estado | enum | "borrador" (estado inicial al crear) |
| multimedia | object | { imagenes: [], notasVoz: [], textos: [] } |

### Estado del stepper

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| step | number | Paso actual (1: cliente, 2: datos+multimedia). |
| clienteSeleccionado | object / null | Cliente existente elegido o null si es nuevo. |
| errors | object | Errores de validacion por campo. |
| guardando | boolean | Estado de carga al guardar. |

### Tipos de proyecto (opciones del dropdown)

- Reforma integral vivienda
- Reforma integral comercial
- Diseno de interiores
- Vivienda unifamiliar
- Rehabilitacion rustica

### Estilos / conceptos (opciones del dropdown)

- Rustico mediterraneo
- Minimalista
- Industrial
- Nordico
- Japandi
- Contemporaneo

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Seleccionar cliente existente | Autocompleta todos los campos del paso 1. |
| Escribir nombre nuevo (sin seleccionar existente) | Crea un cliente nuevo. Nombre obligatorio. |
| Click en "Siguiente" con paso 1 valido | Avanza a paso 2. |
| Click en "Siguiente" con paso 1 invalido | Muestra errores en los campos obligatorios. |
| Click en "Anterior" en paso 2 | Vuelve a paso 1. |
| Arrastrar imagenes al dropzone (paso 2) | Se anaden a la galeria con preview. |
| Click en "Grabar nota de voz" (paso 2) | Inicia animacion de grabacion simulada; al parar, anade una nota al historico. |
| Click en "Guardar" con paso 2 valido | Crea el proyecto en "borrador" y redirige a la ficha (PRD 03). |
| Click en "Guardar" con paso 2 invalido | Muestra errores (nombre del proyecto vacio). |

## Reglas de negocio

- El campo Nombre del cliente es obligatorio (*); el resto de campos del cliente son opcionales.
- El campo Nombre del proyecto es obligatorio (*); tipo, estilo y observaciones son opcionales pero recomendados.
- Al crear el proyecto, se asigna automaticamente el estado "borrador".
- Si se selecciona un cliente existente, no se crea un cliente duplicado.
- El stepper vive en una sola ruta; cambiar de paso no cambia la URL.
- La multimedia cargada en paso 2 se guarda en el historico del proyecto y es visible despues en la pestana Cliente de la ficha (PRD 03 / 02b).
- Las notas de voz son simuladas: animacion de grabacion sin MediaRecorder real (maqueta pura).
- Las imagenes son funcionales: drag & drop, preview y galeria real.

## Criterios de aceptacion

- [ ] La cabecera muestra "Nuevo proyecto" y la tagline "De la visita al cliente a la memoria de calidades, un solo flujo".
- [ ] El stepper muestra 2 pasos: "1. Cliente" y "2. Datos del proyecto", con el activo resaltado.
- [ ] Paso 1 muestra el formulario de cliente con los 7 campos.
- [ ] El selector de "Cliente existente" autocompleta los campos al elegir uno.
- [ ] El campo Nombre del cliente muestra el asterisco de obligatorio.
- [ ] Paso 2 muestra los campos Nombre del proyecto*, Tipo, Estilo, Observaciones y la zona de carga multimedia.
- [ ] Los dropdowns de tipo y estilo muestran las opciones definidas.
- [ ] El dropzone de imagenes acepta drag & drop y muestra previews en galeria.
- [ ] El boton de nota de voz simula grabacion con animacion.
- [ ] Los botones "Anterior", "Siguiente" y "Guardar" estan presentes segun el paso.
- [ ] La validacion bloquea el avance/guardado si los campos obligatorios estan vacios.
- [ ] Al guardar, se redirige a la ficha del proyecto (PRD 03).

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `StepperHeader`, `StepIndicator`, `ClientForm`, `ProjectForm`, `MediaUploader`, `FormField`, `Dropdown`. |
| Capturas de referencia | `04_app_ui/02_datos_cliente.png`, `04_app_ui/03_flujo_proyecto_nuevo.png`, `04_app_ui/04_tipo_proyecto.png`. |
| Datos mock | Array `clientes` en `src/data/clientes.ts` con los clientes de los 3 proyectos reales (Xisca i Llorenc, Cafe BOU, Magdalena i Pere, Toni Oliver / Ramon Llull 31, Joana Ribot Bosch / Joan Binimelis). |
| Gestion de estado | `useState` local por paso o contexto compartido (`NewProjectContext`). |
| Validacion | Funcion `validateStep(step, data)` que devuelve errores por campo. |
| MediaUploader | Reutilizar el componente de carga multimedia definido en PRD `02b-datos-proyecto.md`. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Edicion de clientes existentes desde el stepper.
- Gestion de multiples direcciones por cliente.
- Subida de avatar o foto del cliente.
- Integracion con CRM externo.
- Transcripcion real de audio a texto (las notas de voz son simuladas).
- La pantalla de listado de Clientes (destino del sidebar) no se implementa en este PRD.