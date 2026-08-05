# 04 Presupuesto (pestana Presupuesto)

Pestana Presupuesto de la ficha del proyecto. Genera y visualiza el presupuesto con
capitulos por oficio, base imponible, IVA (21%) y total. Verificar el presupuesto
habilita la pestaña Renders.

## Resumen

El presupuesto se genera a partir del plan maestro verificado (PRD `03a`). En la
primera vista se muestra un estado "no generado" con boton para generarlo. Tras la
generacion, se presenta una tabla estructurada por capitulos (Demolicion,
Albaileria, Carpinteria, Mobiliario, Honorarios), cada uno con sus partidas (REF,
descripcion, unidad, cantidad, precio, importe) y subtotal. Al final se calcula la
base imponible, el IVA del 21% y el total.

Vive dentro del shell de la ficha (PRD `03-project-sheet.md`). No tiene boton de
export propio ni boton "Anterior"; la exportacion es unica desde la cabecera de la
ficha y la navegacion se hace por el submenú lateral.

## Objetivos

- Generar el presupuesto a partir del plan maestro verificado.
- Presentar las partidas agrupadas por capitulos con subtotales.
- Calcular automaticamente base imponible, IVA (21%) y total.
- Verificar el presupuesto para habilitar Renders y reflejarlo en el Resumen.

## Pantallas y capturas de referencia

| Archivo | Que muestra |
|---------|-------------|
| `04_app_ui/08_generar_presupuesto.png` | Estado "Presupuesto no generado": mensaje explicativo y boton "Generar presupuesto". |
| `04_app_ui/09_presupuesto_generado.png` | Presupuesto generado con tablas por capitulo, subtotales, base imponible, IVA 21%, total (46.898,39 EUR). |

## Layout y componentes

### Layout

Dentro del `SheetContent` de la ficha (PRD 03). El contenido cambia entre estado "no
generado" y presupuesto generado.

### Vista A: Presupuesto no generado

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Presupuesto" |
| Estado | Badge "No generado" |
| Mensaje | "El presupuesto se genera a partir del plan maestro verificado" |
| Boton primario | "Generar presupuesto" |

### Vista B: Presupuesto generado

Cabecera:

| Elemento | Contenido |
|----------|-----------|
| Titulo | "Presupuesto" |
| Estado | Badge "Generado, pendiente revision" |

**Tablas por capitulo**

Cabecera de cada tabla: `REF | DESCRIPCION | UD | CANT | PRECIO | IMPORTE`

Capitulos y partidas mock (proyecto SON POU):

**DEMOLICION**

| REF | Descripcion | UD | CANT | Precio | Importe |
|-----|-------------|----|------|--------|---------|
| D-01 | Demolicion tabiqueria existente | m2 | 45,00 | 18,00 EUR | 810,00 EUR |
| D-02 | Retirada pavimento existente | m2 | 95,00 | 12,00 EUR | 1.140,00 EUR |
| D-09 | Vaciado y retirada escombros | m3 | 12,00 | 28,00 EUR | 336,00 EUR |

Subtotal DEMOLICION: 2.566,00 EUR

**ALBANILERIA**

| REF | Descripcion | UD | CANT | Precio | Importe |
|-----|-------------|----|------|--------|---------|
| A-01 | Tabique nuevo ladrillo 7cm | m2 | 38,00 | 32,00 EUR | 1.216,00 EUR |
| A-03 | Trasdosado placa yeso + banda | m2 | 120,00 | 28,00 EUR | 3.360,00 EUR |
| A-04 | Solado porcelanico 60x60cm | m2 | 95,00 | 25,00 EUR | 2.375,00 EUR |

Subtotal ALBANILERIA: 8.847,00 EUR (incluye partidas adicionales no visibles en la captura recortada).

**CARPINTERIA**

| REF | Descripcion | UD | CANT | Precio | Importe |
|-----|-------------|----|------|--------|---------|
| C-01 | Puerta lacada blanco mate 80x210cm | ud | 7,00 | 280,00 EUR | 1.960,00 EUR |
| C-03 | Ropero a medida | m | 12,00 | 450,00 EUR | 5.400,00 EUR |
| C-04 | Mueble cocina a medida | m | 8,00 | 520,00 EUR | 4.160,00 EUR |

Subtotal CARPINTERIA: 13.230,00 EUR (incluye partidas adicionales no visibles).

**MOBILIARIO**

| REF | Descripcion | UD | CANT | Precio | Importe |
|-----|-------------|----|------|--------|---------|
| M-01 | Sofa lino color arena | ud | 1,00 | 1.200,00 EUR | 1.200,00 EUR |
| M-07 | Mesa comedor olivo | ud | 1,00 | 850,00 EUR | 850,00 EUR |

Subtotal MOBILIARIO: 5.300,00 EUR (incluye partidas adicionales no visibles).

**HONORARIOS**

| REF | Descripcion | UD | CANT | Precio | Importe |
|-----|-------------|----|------|--------|---------|
| H-01 | Proyecto interiorismo | lote | 1,00 | 2.500,00 EUR | 2.500,00 EUR |
| H-02 | Direccion de obra (3 meses) | mes | 3,00 | 800,00 EUR | 2.400,00 EUR |

Subtotal HONORARIOS: 6.400,00 EUR (incluye una partida adicional).

**Resumen fiscal**

| Concepto | Importe |
|----------|---------|
| Base imponible | 38.759,00 EUR |
| IVA (21%) | 8.139,39 EUR |
| TOTAL | 46.898,39 EUR |

**Boton inferior**

| Boton | Accion |
|-------|--------|
| Verificar presupuesto | Marca el presupuesto como verificado, habilita Renders y actualiza el Resumen de la ficha. |

## Datos y estado

### Entidad Presupuesto

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| id | string | Identificador. |
| proyectoId | string | Referencia al proyecto. |
| capitulos | array | Lista de capitulos con partidas. |
| baseImponible | number | Suma de subtotales. |
| iva | number | 21 (porcentaje). |
| ivaImporte | number | baseImponible * 0,21. |
| total | number | baseImponible + ivaImporte. |
| estado | enum | "no_generado" / "generado" / "verificado" |

### Entidad Capitulo / Partida

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| id | string | "cap-demolicion" |
| nombre | string | "DEMOLICION" |
| partidas | array | Lista de partidas. |
| subtotal | number | 2566.00 |

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| ref | string | "D-01" |
| descripcion | string | "Demolicion tabiqueria existente" |
| ud | string | "m2" |
| cantidad | number | 45.00 |
| precio | number | 18.00 |
| importe | number | cantidad * precio |

### Estados

- `no_generado`: pendiente de generacion.
- `generado`: pendiente de revision.
- `verificado`: aprobado, habilita Renders.

## Interacciones y flujos

| Accion | Resultado |
|--------|-----------|
| Click en "Generar presupuesto" | Muestra carga y genera las tablas con partidas mock. |
| Click en "Verificar presupuesto" | Marca como verificado, habilita la pestaña Renders y actualiza el Resumen de la ficha. |

## Reglas de negocio

- El presupuesto solo se puede generar si el plan maestro esta verificado (PRD 03a).
- Cada partida: `importe = cantidad * precio`.
- Cada capitulo: `subtotal = suma de importes de sus partidas`.
- Base imponible = suma de subtotales.
- IVA = 21% sobre la base imponible.
- Total = base imponible + IVA.
- Los numeros usan formato europeo (coma decimal, punto de miles).
- Las partidas se generan a partir de los trabajos y materiales del plan maestro.
- No hay boton de export propio; el PDF de la ficha se genera desde la cabecera (PRD 03).
- No hay boton "Anterior"; la navegacion es por el submenú lateral de la ficha.

### Capitulos estandar (orden)

1. Demolicion
2. Albaileria
3. Fontaneria
4. Electricidad
5. Carpinteria
6. Pintura / Microcemento
7. Mobiliario
8. Honorarios

### Codigos de referencia (prefijos)

| Prefijo | Capitulo |
|---------|----------|
| D- | Demolicion |
| A- | Albaileria |
| F- | Fontaneria |
| E- | Electricidad |
| C- | Carpinteria |
| P- | Pintura |
| M- | Mobiliario |
| H- | Honorarios |

## Criterios de aceptacion

- [ ] La vista "no generado" muestra titulo, badge "No generado", mensaje y boton "Generar presupuesto".
- [ ] Al pulsar "Generar presupuesto", se muestran las tablas con partidas mock tras carga.
- [ ] La cabecera del presupuesto generado muestra el badge "Generado, pendiente revision".
- [ ] Cada capitulo muestra una tabla con cabecera REF/DESCRIPCION/UD/CANT/PRECIO/IMPORTE.
- [ ] Cada partida muestra sus datos correctos.
- [ ] Cada capitulo muestra su subtotal al final de la tabla.
- [ ] El resumen fiscal muestra base imponible (38.759,00 EUR), IVA 21% (8.139,39 EUR) y TOTAL (46.898,39 EUR).
- [ ] El IVA se calcula como el 21% de la base imponible.
- [ ] El total es la suma de base imponible + IVA.
- [ ] El boton "Verificar presupuesto" esta presente y actualiza el Resumen de la ficha.
- [ ] No hay boton de export propio ni boton "Anterior".
- [ ] Los numeros usan formato europeo.

## Notas de implementacion

| Tema | Decision |
|------|----------|
| Stack | React + Tailwind CSS. |
| Componentes sugeridos | `PresupuestoEmpty`, `PresupuestoTable`, `CapituloTable`, `PartidaRow`, `ResumenFiscal`, `EstadoBadge`. |
| Capturas de referencia | `04_app_ui/08_generar_presupuesto.png`, `04_app_ui/09_presupuesto_generado.png`. |
| Datos mock | Objeto `presupuestoMock` en `src/data/presupuesto.ts` con los capitulos, partidas y totales de SON POU (46.898,39 EUR). |
| Formato de moneda | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`. |
| Calculo | `calcularSubtotal`, `calcularBaseImponible`, `calcularIVA`, `calcularTotal`. |
| Tabla responsive | En mobile, scroll horizontal o layout de tarjetas. |
| Naming | Componentes en PascalCase, archivos en kebab-case. |

## Fuera de alcance

- Edicion manual de partidas y precios en la demo (se muestra como generado por IA).
- Gestion de proveedores y costes reales.
- Comparativa de presupuestos (versiones A/B).
- Presupuestos en multiples monedas.
- Descuentos por capitulo o globales.
- Exportacion propia del presupuesto a PDF (la exportacion es unica, desde la ficha).