# 06 Memoria de calidades (pestana Memoria)

Pestana Memoria de la ficha del proyecto. Recopila automaticamente los materiales del
plan, presupuesto y renders y genera una memoria estructurada en 8 categorias con
formato #designestudio. Verificar la memoria completa el proyecto.

## Resumen

La memoria de calidades es el documento final que recopila todos los materiales y
acabados del proyecto. Se genera a partir del plan maestro, el presupuesto, los
renders y los materiales sugeridos. En la primera vista se muestra el estado "no
generada" con boton para iniciar la generacion. Tras generarla, se presentan 8
secciones (04.1 Pavimentos a 04.8 Mobiliario), cada una con fichas de materiales
(marca, modelo, descripcion, ubicacion).

Vive dentro del shell de la ficha (PRD `03-project-sheet.md`). No tiene boton de
export propio ni boton "Anterior"; la exportacion es unica desde la cabecera de la
ficha y la navegacion se hace por el submenú lateral. Al verificar la memoria, el
proyecto puede pasar a "completado" en el Resumen de la ficha.

## Objetivos

- Recopilar automaticamente los materiales del plan maestro, presupuesto y renders.
- Estructurar la memoria en 8 categorias estandar.
- Presentar cada material con marca, modelo, descripcion y ubicacion de aplicacion.
- Verificar la memoria para completar el proyecto y reflejarlo en el Resumen.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/12_memoria_calidades_inicio.png` | Estado "Memoria de calidades no generada": descripcion de fuentes (Plan maestro, Presupuesto, Renders, Materiales) y boton "Generar memoria de calidades". |
| `04_app_ui/13_memoria_calidades_1.png` | Memoria generada (parte 1): secciones 04.1 Pavimentos, 04.2 Revestimientos, 04.3 Falsos techos, 04.4 Carpinteria. |
| `04_app_ui/14_memoria_calidades_2.png` | Memoria generada (parte 2): secciones 04.5 a 04.8, con fichas de materiales. |

## Layout y componentes

### Layout

Dentro del `SheetContent` de la ficha (PRD 03). El contenido cambia entre estado "no
generada" y memoria generada.

### Vista A: Memoria no generada

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Memoria de calidades" |
| Estado | Badge "No generada" |
| Descripcion | "La memoria recopila automaticamente todo el trabajo realizado:" |
| Checklist de fuentes | 4 items con iconos: Plan maestro, Presupuesto, Renders, Materiales |
| Formato | "Formato #designestudio - A4 horizontal - Estetica Lerycke Marti Design" |
| Boton primario | "Generar memoria de calidades" |

### Vista B: Memoria generada

Cabecera:

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Memoria de calidades" |
| Estado | Badge "Generada, pendiente revision" |
| Subtitulo | "Memoria generada con 8 categorias - Formato #designestudio" |

**Secciones de la memoria (8 categorias)** - cada seccion con numeracion (04.1 a
04.8), titulo y fichas de material. Cada ficha: imagen, nombre, marca + modelo,
descripcion tecnica, ubicacion.

**04.1 PAVIMENTOS**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Porcelanico arcilla 60x60cm | Keraben - Mixit beige | Alta resistencia, aspecto barro cocido. Absorcion <0,5%. | Salon, cocina, dormitorios |
| Microcemento arcilla | Topciment - Maren Arcilla | Revestimiento continuo 3 capas. Sellado poliuretano. | Banos |

**04.2 REVESTIMIENTOS**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Pintura Cornforth White | Farrow & Ball | Alta calidad, acabado mate. 2 manos. Sin VOC. | Todas las paredes |

**04.3 FALSOS TECHOS**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Escayola continua | Placo | Falso techo continuo. Acabado liso. Iluminacion empotrada. | Salon, cocina, banos |
| Vigas madera vista | Madera recuperada | Vigas originales tratadas. Anti-xilofagos, aceitado. | Salon-comedor |

**04.4 CARPINTERIA**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Puerta lacada blanco mate | Mab - Model 4G | Ciegas, lacadas blanco mate. Marco MDF. Bisagra oculta. | 7 estancias |
| Aluminio COR 70 | Cortizo - PE7012TD | Perfileria aluminio texturizado mate. Persianas pala plana. | Ventanas exterior |

**04.5 SANITARIOS Y GRIFERIA**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Inodoro suspendido | Roca - The Gap Square | Cisterna Geberit oculta. Tapa soft-close. Doble descarga. | Banos 1 y 2 |
| Griferia termostatica | TRES - Therm-Box | 2 vias niquel cepillado. Para ducha. | Banos |

**04.6 ILUMINACION**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Foco empotrable | Beneito Faure - 3,5W 3000K | LED integrado. Color 3000K. Empotrable yeso. | Salon, pasillo, banos |
| Lampara ceramica | Artesania mallorquina | Difusor esmaltado. Cable textil. E27. LED 2700K. | Salon, comedor |

**04.7 MECANISMOS**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Enchufes e interruptores | JUNG - LS 990 | Serie LS 990. Enchufes, interruptores, TV/datos. | Toda la vivienda |

**04.8 MOBILIARIO**

| Material | Marca - Modelo | Descripcion | Ubicacion |
|----------|----------------|-------------|-----------|
| Sofa lino arena | Lerycke Marti - 3 plazas | Lino natural. Estructura madera. Cojines plumas. | Salon-comedor |
| Mesa comedor olivo | Lerycke Marti | Madera maciza olivo. Borde natural. Base metal negro. | Salon-comedor |

**Boton inferior**

| Boton | Accion |
|-------|--------|
| Verificar memoria | Marca la memoria como verificada, completa el proyecto (si los demas documentos lo estan) y actualiza el Resumen de la ficha. |

## Datos y estado

### Entidad MemoriaCalidades

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | string | Identificador. |
| proyectoId | string | Referencia al proyecto. |
| secciones | array | Lista de 8 secciones. |
| totalCategorias | number | 8 |
| estado | enum | "no_generada" / "generada" / "verificada" |
| formato | string | "A4 horizontal - Estetica Lerycke Marti Design" |

### Entidad SeccionMemoria / FichaMaterial

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "sec-04-1" |
| numero | string | "04.1" |
| titulo | string | "PAVIMENTOS" |
| materiales | array | Lista de fichas. |

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "fic-01" |
| nombre | string | "Porcelanico arcilla 60x60cm" |
| marca | string | "Keraben" |
| modelo | string | "Mixit beige" |
| descripcion | string | "Alta resistencia, aspecto barro cocido. Absorcion <0,5%." |
| ubicacion | string | "Salon, cocina, dormitorios" |
| imagen | string | URL o path de la imagen. |

### Secciones estandar (8 categorias)

| Numero | Titulo |
|--------|--------|
| 04.1 | PAVIMENTOS |
| 04.2 | REVESTIMIENTOS |
| 04.3 | FALSOS TECHOS |
| 04.4 | CARPINTERIA |
| 04.5 | SANITARIOS Y GRIFERIA |
| 04.6 | ILUMINACION |
| 04.7 | MECANISMOS |
| 04.8 | MOBILIARIO |

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Click en "Generar memoria de calidades" | Muestra carga y genera las 8 secciones con materiales mock. |
| Scroll vertical | Permite ver todas las secciones. |
| Click en "Verificar memoria" | Marca la memoria como verificada; si los demas documentos estan completos, el proyecto pasa a "completado" en el Resumen de la ficha. |

## Reglas de negocio

- La memoria solo se puede generar si los renders estan verificados (PRD 05).
- La memoria recopila automaticamente los materiales del plan, presupuesto y renders; no requiere entrada manual.
- Las 8 categorias son fijas y estandar para todos los proyectos.
- Cada material se presenta con marca, modelo, descripcion tecnica y ubicacion.
- El formato de exportacion es A4 horizontal con estetica Lerycke Marti Design y #designestudio (aplica al PDF unico de la ficha, no a un export propio).
- Los materiales de mobiliario de marca propia se etiquetan como "Lerycke Marti".
- La memoria debe estar verificada para completar el proyecto.
- No hay boton de export propio ni boton "Anterior".

### Fuentes de datos para la memoria

| Fuente | Contribuye con |
|--------|----------------|
| Plan maestro | Materiales sugeridos por categoria. |
| Presupuesto | Partidas de materiales con precios. |
| Renders | Materiales visibles en cada estancia. |
| Materiales (plan) | Marcas y modelos concretos. |

## Criterios de aceptacion

- [ ] La vista "no generada" muestra titulo, badge "No generada" y la descripcion.
- [ ] La checklist de fuentes muestra: Plan maestro, Presupuesto, Renders, Materiales.
- [ ] El formato indicado es "A4 horizontal - Estetica Lerycke Marti Design".
- [ ] El boton "Generar memoria de calidades" esta presente.
- [ ] Al pulsar el boton, se muestran las 8 secciones tras carga.
- [ ] La cabecera de la memoria generada muestra el badge "Generada, pendiente revision" y "8 categorias".
- [ ] Cada seccion muestra su numeracion (04.1 a 04.8) y titulo.
- [ ] Cada ficha de material muestra imagen, nombre, marca + modelo, descripcion y ubicacion.
- [ ] Las marcas y modelos mock coinciden con los datos reales (Keraben Mixit, Roca The Gap Square, TRES Therm-Box, Cortizo COR 70, JUNG LS 990, Farrow & Ball Cornforth White, Beneito Faure).
- [ ] El boton "Verificar memoria" esta presente y, al pulsarlo, actualiza el Resumen de la ficha.
- [ ] No hay boton de export propio ni boton "Anterior".

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `MemoriaEmpty`, `MemoriaGenerada`, `SeccionMemoria`, `FichaMaterial`. |
| Capturas de referencia | `04_app_ui/12_memoria_calidades_inicio.png`, `04_app_ui/13_memoria_calidades_1.png`, `04_app_ui/14_memoria_calidades_2.png`. |
| Datos mock | Objeto `memoriaMock` en `src/data/memoria-calidades.ts` con las 8 secciones y fichas de SON POU. |
| Catalogo de marcas | Reutilizar `src/data/catalogo-materiales.ts` del PRD 03a con marcas reales. |
| Imagenes de materiales | Placeholders con `[ imagen material ]` o imagenes reales de productos si disponibles. |
| Simulacion de generacion | Funcion `generarMemoria(fuentes)` que devuelve una `Promise` con las secciones mock tras un `setTimeout`. |
| Scroll | Documento largo con scroll vertical; considerar anchor links por seccion. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Edicion manual de fichas de material en la demo.
- Anadir categorias personalizadas mas alla de las 8 estandar.
- Inclusion de planos tecnicos dentro de la memoria.
- Versiones en multiples idiomas.
- Memorias por planta (PB, P1, P2) como en el proyecto real Joan Binimelis.
- Exportacion propia de la memoria a PDF (la exportacion es unica, desde la ficha).