# 05 Renders (pestana Renders)

Pestana Renders de la ficha del proyecto. Genera renders fotorrealistas por estancia
con multiples modos de generacion y galeria de resultados. Verificar los renders
habilita la pestaña Memoria.

## Resumen

La pestana Renders permite generar imagenes fotorrealistas de cada estancia del
proyecto. En una primera vista se selecciona el modo de generacion entre 8 opciones
(esbozo a render, plano a 3D, Street View, foto real, variaciones de mobiliario,
puntos de vista, estilos de referencia y horas del dia). Tras la generacion, se
presenta una galeria con los renders de cada estancia, con descripcion de materiales,
iluminacion y enfoque.

Vive dentro del shell de la ficha (PRD `03-project-sheet.md`). No tiene boton de
export propio ni boton "Anterior"; la exportacion es unica desde la cabecera de la
ficha y la navegacion se hace por el submenú lateral.

## Objetivos

- Ofrecer multiples modos de generacion de renders segun el input disponible.
- Generar un render por estancia del plan maestro.
- Presentar los renders en una galeria con descripciones de materiales e iluminacion.
- Verificar los renders para habilitar la pestaña Memoria y reflejarlo en el Resumen.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/10_generacion_renders.png` | Seleccion de modo: 8 opciones en grid (Esbozo > Render, Plano > Render 3D, Street View, Foto real > Render, Variaciones mobiliario, Puntos de vista, Estilos de referencia, Horas del dia). |
| `04_app_ui/11_renders_generados.png` | Galeria de renders: 4 estancias (Salon-Comedor, Cocina, Dormitorio Principal, Bano 1) con imagen, descripcion, materiales e iluminacion. |

## Layout y componentes

### Layout

Dentro del `SheetContent` de la ficha (PRD 03). El contenido cambia entre seleccion
de modo y galeria de renders.

### Vista A: Seleccion de modo de generacion

Cabecera:

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Renders" |
| Estado | Badge "No generados" |
| Subtitulo | "Selecciona el tipo de generacion de imagen" |

**Grid de 8 modos de generacion** (grid 2x4 o 4x2):

| Num | Modo | Descripcion |
|-----|------|-------------|
| 1 | Esbozo > Render | Subir dibujo a mano y generar render realista |
| 2 | Plano > Render 3D | Embellecer plano 2D con colores y materiales |
| 3 | Google Street View | Render de fachada desde Street View |
| 4 | Foto real > Render | Aplicar diseno sobre foto real (img2img) |
| 5 | Variaciones mobiliario | Cambiar sofa, mesa, textiles, iluminacion |
| 6 | Puntos de vista | Frontal, esquina, puerta, cenital, contrapicado |
| 7 | Estilos de referencia | Usar mood board como guia estetica |
| 8 | Horas del dia | Amanecer, mediodia, atardecer, nocturna |

Cada tarjeta: numero, nombre del modo, descripcion, icono.

### Vista B: Galeria de renders generados

Cabecera:

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Renders" |
| Estado | Badge "Generados, pendiente revision" |

**Galeria por estancia** (una tarjeta por estancia con render):

| Estancia | m2 + Luz | Enfoque | Descripcion | Materiales |
|----------|----------|---------|-------------|------------|
| Salon-Comedor | 27.3 m2 - Golden hour | wide_angle / Luz calida | Suelo arcilla, vigas madera, sofa lino arena, mesa olivo, lampara ceramica. | Porcelanico arcilla - Lino natural - Madera olivo |
| Cocina | 14.0 m2 - Luz natural | perspective / Luz diurna | Muebles madera lacada crema, encimera cuarzo blanco, campana cobre, LED. | Madera lacada crema - Cuarzo blanco - Cobre |
| Dormitorio Principal | 12.6 m2 - Luz matutina | wide_angle / Luz matutina | Cama madera natural, lino crudo, mesitas madera maciza, ropero integrado. | Madera natural - Lino crudo - Lino blanco |
| Bano 1 | 12.0 m2 - Luz natural + calida | perspective / Luz natural | Microcemento arcilla, ducha obra, mampara vidrio, inodoro suspendido, lavabo piedra. | Microcemento arcilla - Piedra natural - Vidrio 8mm |

Cada tarjeta: nombre de estancia (cabecera), m2 + iluminacion, enfoque + tipo luz,
imagen render, descripcion, tag de estancia, lista de materiales.

**Botones inferiores**

| Boton | Accion |
|-------|--------|
| + Nuevo render | Vuelve a la seleccion de modo o anade un render a una estancia sin render. |
| Verificar renders | Marca los renders como verificados, habilita Memoria y actualiza el Resumen de la ficha. |

## Datos y estado

### Entidad Render

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "rnd-01" |
| estanciaId | string | Referencia a la estancia del plan maestro. |
| nombre | string | "Salon-Comedor" |
| m2 | number | 27.3 |
| iluminacion | string | "Golden hour" |
| enfoque | string | "wide_angle" |
| tipoLuz | string | "Luz calida" |
| imagen | string | URL o path de la imagen render. |
| descripcion | string | "Suelo arcilla, vigas madera..." |
| materiales | array | ["Porcelanico arcilla", "Lino natural", "Madera olivo"] |
| tag | string | "#SALON-COMEDOR" |

### Entidad ModoGeneracion

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | number | 1 |
| nombre | string | "Esbozo > Render" |
| descripcion | string | "Subir dibujo a mano y generar render realista" |
| icono | string | Referencia al icono. |

### Estado de la pestana

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| fase | enum | "seleccion_modo" / "generando" / "galeria" |
| modoSeleccionado | number / null | Modo elegido. |
| renders | array | Lista de renders generados. |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Click en un modo de generacion | Selecciona el modo e inicia la generacion de renders. |
| Generacion completada | Muestra la galeria de renders generados. |
| Click en "+ Nuevo render" | Vuelve a la seleccion de modo o anade un render. |
| Click en "Verificar renders" | Marca los renders como verificados, habilita Memoria y actualiza el Resumen de la ficha. |

## Reglas de negocio

- Los renders se generan a partir de las estancias del plan maestro verificado.
- Cada estancia del plan maestro debe tener al menos un render en la galeria.
- El contador de documentos del dashboard ("Renders: Generados X/4") se actualiza con el numero de renders generados sobre el total de estancias.
- El modo de generacion seleccionado determina el input necesario, pero en la demo la generacion es simulada.
- Los renders deben estar verificados para habilitar Memoria.
- No hay boton de export propio (el portfolio va en el PDF unico de la ficha) ni boton "Anterior".

### Horas del dia / condiciones de luz disponibles

- Amanecer
- Mediodia
- Golden hour
- Atardecer
- Nocturna

### Puntos de vista disponibles

- Frontal
- Esquina
- Puerta
- Cenital
- Contrapicado
- wide_angle
- perspective

## Criterios de aceptacion

- [ ] La vista de seleccion muestra titulo "Renders", badge "No generados" y subtitulo.
- [ ] Se muestran 8 tarjetas de modos en grid, cada una con numero, nombre, descripcion e icono.
- [ ] Al seleccionar un modo, se muestra carga y despues la galeria de renders.
- [ ] La galeria muestra el badge "Generados, pendiente revision".
- [ ] Cada tarjeta de render muestra nombre de estancia, m2 + iluminacion, enfoque + tipo luz, imagen, descripcion y materiales.
- [ ] Los 4 renders mock (Salon-Comedor, Cocina, Dormitorio Principal, Bano 1) se muestran con sus datos correctos.
- [ ] El boton "+ Nuevo render" esta presente.
- [ ] El boton "Verificar renders" esta presente y actualiza el Resumen de la ficha.
- [ ] No hay boton de export propio ni boton "Anterior".

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `RendersEmpty`, `ModoGeneracionGrid`, `ModoCard`, `RendersGallery`, `RenderCard`. |
| Capturas de referencia | `04_app_ui/10_generacion_renders.png`, `04_app_ui/11_renders_generados.png`. |
| Datos mock | Array `modosGeneracion` en `src/data/modos-render.ts`. Array `rendersMock` en `src/data/renders.ts` con los 4 renders de SON POU. |
| Imagenes render | Usar las imagenes de ejemplo en `05_renders_examples/` como placeholders o imagenes de Unsplash/Pexels de interiores. |
| Simulacion de generacion | Funcion `generarRenders(modo, estancias)` que devuelve una `Promise` con los renders mock tras un `setTimeout`. |
| Galeria responsive | Grid de 1-2 columnas en mobile, 2-3 en desktop. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Generacion real de renders con IA de imagen (Stable Diffusion, Midjourney, etc.).
- Edicion de renders (rotar, recortar, ajustar).
- Comparacion before/after de renders.
- Render en 360 grados o tour virtual.
- Renders de exteriores mas alla de fachada Street View.
- Exportacion propia del portfolio PDF (la exportacion es unica, desde la ficha).