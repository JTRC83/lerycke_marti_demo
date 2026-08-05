# 03a Plan maestro con IA (pestana Plan)

Pestana Plan de la ficha del proyecto. La IA procesa la visita al cliente y genera
un plan maestro editable con estancias, trabajos, materiales y analisis de estilo.
Admite carga de texto en distintos campos, notas de voz (simuladas) e imagenes, con
historico.

## Resumen

El Plan maestro es el nucleo del proyecto. El usuario introduce el input de la visita
(texto, notas de voz, imagenes, esbozos), la IA lo procesa y genera un plan
estructurado con estancias, m2 totales, presupuesto estimado, trabajos, materiales
sugeridos y analisis de estilo. El plan es editable: se pueden anadir comentarios,
eliminar elementos y regenerar el plan con observaciones.

Esta pestana admite carga de multimedia (texto, notas de voz, imagenes) en diferentes
campos, y mantiene un historico de las entradas anadidas, igual que el apartado Datos
del proyecto (PRD 02b). Reutiliza el componente `MediaUploader`.

Vive dentro del shell de la ficha (PRD `03-project-sheet.md`); no tiene sidebar ni
topbar propios ni boton de export propio (la exportacion es unica, desde la cabecera
de la ficha).

## Objetivos

- Recoger el input de la visita (texto, notas de voz, imagenes, esbozos, archivo).
- Simular la generacion del plan maestro por IA a partir del input.
- Presentar el plan generado de forma estructurada y editable.
- Permitir regenerar el plan con observaciones del usuario.
- Admitir carga de texto, notas de voz (simuladas) e imagenes en distintos campos, con historico.
- Verificar el plan; la verificacion se refleja en el Resumen de la ficha.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/05_plan_maestro_con_ia.png` | Input del plan maestro: textarea, botones de audio y fotos, subida de archivo, resumen de inputs, boton "Generar plan con IA". |
| `04_app_ui/06_plan_maestro_generado_1.png` | Plan generado (parte 1): cabecera con metricas (6 estancias, 136.3 m2, ~42.000 EUR), boton "Regenerar con observaciones", lista de estancias, lista de trabajos. |
| `04_app_ui/07_plan_maestro_generado_2.png` | Plan generado (parte 2): materiales sugeridos por categoria, analisis de estilo, observaciones generales, boton "Verificar plan y continuar". |

## Layout y componentes

### Layout

Dentro del `SheetContent` de la ficha (PRD 03). El contenido cambia entre la vista de
input y la vista de plan generado.

### Vista A: Input del plan maestro

| Componente | Descripcion |
|------------|-------------|
| Titulo | "Plan maestro" |
| Subtitulo | "Sube el texto de la visita, graba un audio, o anade fotos/esbozos. La IA lo procesara todo." |
| MediaUploader | Reutiliza el componente del PRD 02b: `ImageDropzone` (drag & drop + preview + galeria), `VoiceRecorder` (grabacion simulada con animacion), textarea. |
| Area de texto | Textarea grande con placeholder: "Pega aqui el texto de la visita al cliente, notas del proyecto, o el briefing completo..." |
| Contador de caracteres | Debajo del textarea. |
| Subida de archivo | "Subir archivo: Seleccionar archivo / Ningun archivo seleccionado". |
| Resumen de inputs | Panel con conteo: "1 fotos", "2 notas de voz", etc. |
| Boton primario | "Generar plan con IA" |

### Vista B: Plan maestro generado

Cabecera con metricas y acciones:

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Plan maestro generado" |
| Subtitulo | "Edita cualquier campo, anade comentarios o elimina elementos. Al regenerar, la IA tendra en cuenta tus observaciones." |
| Metrica: Estancias | "6" + etiqueta "Estancias" + subetiqueta "Estancias detectadas" |
| Metrica: m2 totales | "136.3" + etiqueta "m2 totales" |
| Metrica: Presupuesto est. | "~42.000 EUR" + etiqueta "Presupuesto est." |
| Boton accion | "Regenerar con observaciones" |
| Boton secundario | "+ Anadir estancia" |

**Lista de estancias** (fila editable cada una):

| Nombre | Tag | m2 | Tipo reforma | Detalle |
|--------|-----|----|--------------|---------|
| Salon-Comedor | living | 27.3 m2 | Reforma completa | Apertura cocina-salon, vigas vista |
| Cocina | kitchen | 14.0 m2 | Nueva cocina | Peninsula, encimera cuarzo |
| Dormitorio Principal | bedroom | 12.6 m2 | Ropero integrado | Cabecero madera |
| Bano 1 | bathroom | 12.0 m2 | Reforma completa | Ducha obra, microcemento |
| Bano 2 | bathroom | 4.0 m2 | Reforma completa | Compacto |
| Terraza | outdoor | 40.6 m2 | Mobiliario | Zona chill-out |

**Lista de trabajos a realizar** (chips):

Demolicion, Albaileria, Fontaneria, Electricidad, Carpinteria, Pintura,
Microcemento, Iluminacion, Mobiliario. Boton "+ Anadir trabajo".

**Materiales sugeridos (por categoria)** - cada categoria con material + comentarios:

| Categoria | Material sugerido | Marca/Modelo |
|-----------|-------------------|--------------|
| Pavimentos | Porcelanico arcilla 60x60cm | Keraben Mixit |
| Sanitarios | Inodoro suspendido The Gap Square | Roca |
| Griferia | Termostatico empotrado 2 vias | TRES |
| Aluminio | COR 70 acabado PE7012TD | Cortizo |
| Mecanismos | Enchufes LS 990 | JUNG |
| Pintura | Cornforth White mate | Farrow & Ball |

Cada categoria: material con marca/modelo (icono X para eliminar), campo de
comentarios debajo, boton "+ Anadir material".

**Analisis de estilo** (texto generado por IA + comentarios):

> Rustico mediterraneo con materiales naturales: porcelanico arcilla, microcemento
> en banos, madera maciza en mobiliario, vigas vistas. Paleta en tonos terracota,
> arena y blanco caldeo. Iluminacion calida 2700-3000K.

**Observaciones generales para regenerar** (textarea + nota explicativa):

> Estas observaciones se enviaran a la IA junto con los comentarios de cada campo al
> pulsar "Regenerar".

Placeholder: "Ej: El cliente quiere mas luz natural en el salon, cambiar la cocina a
estilo industrial, anadir una oficina en el distribuidor..."

**Carga multimedia en el plan** (nuevo respecto al PRD 03 original):

Ademas del input inicial, en la vista de plan generado se pueden anadir entradas al
historico del plan en cualquier campo:

| Campo donde se admite multimedia | Tipo admitido |
|----------------------------------|---------------|
| Detalle de cada estancia | Texto + imagenes (esbozos/fotos de la estancia) |
| Comentarios de cada categoria de material | Texto + imagenes (referencia de material) |
| Analisis de estilo | Texto + imagenes (mood board) |
| Observaciones generales | Texto + notas de voz + imagenes |

Cada entrada queda en el historico del plan (reutiliza `TimelineMedia` del PRD 02b),
visible dentro de esta pestana.

**Boton inferior**

| Boton | Accion |
|-------|--------|
| Verificar plan | Marca el plan como verificado y actualiza el Resumen de la ficha. |

Nota: el boton "Anterior" desaparece porque la navegacion es por el submenú lateral
de la ficha; para volver a Cliente se usa el submenú.

## Datos y estado

### Entidad PlanMaestro

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | string | Identificador del plan. |
| proyectoId | string | Referencia al proyecto. |
| input | object | { texto, notasVoz: [], imagenes: [], archivo: null } |
| estancias | array | Lista de estancias detectadas. |
| trabajos | array | Lista de oficios/trabajos. |
| materiales | array | Lista de materiales por categoria. |
| analisisEstilo | string | Texto de analisis de IA. |
| presupuestoEstimado | number | Estimacion automatica (42000). |
| m2Totales | number | Suma de m2 de estancias. |
| observaciones | string | Observaciones generales para regenerar. |
| historico | array | Entradas `MultimediaEntry` del plan (ver PRD 02b). |
| estado | enum | "no_generado" / "generado" / "verificado" |

### Entidad Estancia

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "est-01" |
| nombre | string | "Salon-Comedor" |
| tag | string | "living" |
| m2 | number | 27.3 |
| tipoReforma | string | "Reforma completa" |
| detalle | string | "Apertura cocina-salon, vigas vista" |

### Entidad Material

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "mat-01" |
| categoria | string | "Pavimentos" |
| descripcion | string | "Porcelanico arcilla 60x60cm" |
| marca | string | "Keraben" |
| modelo | string | "Mixit" |
| comentarios | string | "" |

### Estado de la pestana

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| fase | enum | "input" / "generado" / "regenerando" |
| cargando | boolean | Simula la generacion de IA. |
| historicoVisible | boolean | Mostrar/ocultar el timeline de multimedia. |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Escribir en textarea | Actualiza el contador de caracteres. |
| Grabar nota de voz (input) | Anade nota al resumen de inputs y al historico. |
| Arrastrar imagenes (input) | Anade previews al resumen de inputs y al historico. |
| Click en "Generar plan con IA" | Muestra estado de carga y despues la vista de plan generado. |
| Click en "Regenerar con observaciones" | Toma observaciones y comentarios, muestra carga y regenera. |
| Editar campo de estancia | Modifica el valor en el estado del plan. |
| Click en "+ Anadir estancia" | Anade estancia vacia editable. |
| Click en X de material | Elimina el material de la categoria. |
| Click en "+ Anadir material" | Anade material vacio a la categoria. |
| Anadir imagen/esbozo a un detalle de estancia | Anade entrada "imagen" al historico del plan. |
| Grabar nota de voz en observaciones | Anade entrada "nota_voz" al historico del plan. |
| Click en "Verificar plan" | Marca el plan como verificado y actualiza el Resumen de la ficha. |
| Cambiar de pestaña en el submenú | El estado del plan se conserva. |

## Reglas de negocio

- La generacion del plan es simulada: datos mock tras un breve estado de carga.
- El presupuesto estimado (~42.000 EUR) es orientativo, no vinculante.
- Los m2 totales se calculan sumando los m2 de todas las estancias.
- Las observaciones generales y los comentarios de cada campo se combinan al regenerar.
- El plan admite carga de texto, notas de voz (simuladas) e imagenes en multiples campos; cada entrada queda en el historico del plan.
- Las notas de voz son simuladas (animacion, sin MediaRecorder); las imagenes son funcionales (drag & drop + preview).
- El plan verificado se refleja en el Resumen de la ficha (PRD 03) y habilita la generacion del presupuesto (PRD 04).
- Las marcas y modelos de materiales provienen de un catalogo mock (Keraben, Roca, TRES, Cortizo, JUNG, Farrow & Ball, Beneito Faure).
- No hay boton "Anterior" ni de export propio; la navegacion es por el submenú lateral y la exportacion es unica desde la cabecera de la ficha.

## Criterios de aceptacion

- [ ] La vista de input muestra el titulo "Plan maestro" y el subtitulo explicativo.
- [ ] El textarea tiene el placeholder correcto y el contador de caracteres funciona.
- [ ] El MediaUploader permite imagenes (drag & drop + preview) y notas de voz (simuladas).
- [ ] El resumen de inputs muestra el conteo de fotos/notas subidas.
- [ ] Al pulsar "Generar plan con IA", se muestra carga y despues la vista de plan generado.
- [ ] La cabecera del plan generado muestra las 3 metricas: estancias (6), m2 totales (136.3), presupuesto est. (~42.000 EUR).
- [ ] La lista de estancias muestra las 6 estancias con nombre, tag, m2, tipo de reforma y detalle.
- [ ] La lista de trabajos muestra los 9 oficios como chips.
- [ ] Las 6 categorias de materiales muestran marca y modelo reales con campo de comentarios.
- [ ] El analisis de estilo muestra el texto generado por IA.
- [ ] El campo de observaciones generales tiene el placeholder correcto.
- [ ] El boton "Regenerar con observaciones" esta en la cabecera.
- [ ] Se pueden anadir imagenes y notas de voz a detalles de estancia, comentarios de material, analisis de estilo y observaciones; quedan en el historico del plan.
- [ ] El historico del plan es visible dentro de la pestana.
- [ ] El boton "Verificar plan" esta presente; al pulsarlo actualiza el Resumen de la ficha.
- [ ] No hay boton de export propio ni boton "Anterior" (navegacion por submenú lateral de la ficha).

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `PlanInput`, `PlanGenerated`, `PlanMetrics`, `EstanciaCard`, `TrabajoChip`, `MaterialCategory`, `AnalisisEstilo`, `ObservacionesField`, `MediaUploader` (de PRD 02b), `TimelineMedia` (de PRD 02b). |
| Capturas de referencia | `04_app_ui/05_plan_maestro_con_ia.png`, `04_app_ui/06_plan_maestro_generado_1.png`, `04_app_ui/07_plan_maestro_generado_2.png`. |
| Datos mock | Objeto `planMaestroMock` en `src/data/plan-maestro.ts` con estancias, trabajos, materiales y analisis de estilo basados en SON POU. |
| Simulacion de IA | Funcion `generarPlan(input)` que devuelve una `Promise` con los datos mock tras un `setTimeout` de 1-2 segundos. |
| Catalogo de materiales | `src/data/catalogo-materiales.ts` con marcas y modelos reales. |
| Multimedia + historico | Reutilizar `MediaUploader` y `TimelineMedia` del PRD 02b; el historico del plan es un array independiente del de Datos del proyecto. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Transcripcion real de audio a texto.
- Procesamiento real de imagenes con IA.
- Generacion real del plan con un LLM: es simulacion con datos mock.
- Exportacion del plan maestro como documento independiente (la exportacion es unica, desde la ficha).
- Edicion de planos 2D/3D integrada.
- Versionado del plan con diff entre regeneraciones (el historico es lineal de multimedia, no de versiones del plan).