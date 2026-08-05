// Mock renders for SON POU (PRD 05). 8 modos de generación + 4 renders.

export const modosGeneracion = [
  {
    id: 1,
    nombre: 'Esbozo > Render',
    descripcion: 'Subir dibujo a mano y generar render realista',
    imagen: '/renders/ejemplos/esbozo_render.png',
    explicacion: 'Convierte un esbozo o boceto dibujado a mano en un render fotorrealista. La IA interpreta las líneas, proporciones y distribución del dibujo para generar una imagen 3D realista con materiales, iluminación y acabados. Ideal para presentar ideas rápidas al cliente de forma visual.',
  },
  {
    id: 2,
    nombre: 'Plano > Render 3D',
    descripcion: 'Embellecer plano 2D con colores y materiales',
    imagen: '/renders/ejemplos/plano_render.png',
    explicacion: 'Toma un plano 2D (planta, alzado o sección) y lo embellece con colores, texturas y materiales reales. El resultado es un plano con acabado profesional que muestra cómo se verá cada espacio con sus materiales definitivos. Útil para presentaciones técnicas comprensibles para el cliente.',
  },
  {
    id: 3,
    nombre: 'Google Street View',
    descripcion: 'Render de fachada desde Street View',
    imagen: '/renders/ejemplos/google_street_view.png',
    explicacion: 'Utiliza una imagen de Google Street View de la fachada del edificio como punto de partida y genera un render con la propuesta de diseño exterior. Permite mostrar al cliente cómo quedará la fachada reformada en su contexto real de calle.',
  },
  {
    id: 4,
    nombre: 'Render > Foto real',
    descripcion: 'Aplicar diseño sobre render real (img2img)',
    imagen: '/renders/ejemplos/render_to_photo.png',
    explicacion: 'Parte de un render ya generado y lo lleva a un nivel de fotorrealismo superior, añadiendo detalles, texturas y iluminación que lo acercan a una fotografía real. Perfecto para presentaciones finales donde el cliente necesita ver el resultado más realista posible.',
  },
  {
    id: 5,
    nombre: 'Variaciones mobiliario',
    descripcion: 'Cambiar sofá, mesa, textiles, iluminación',
    imagen: '/renders/ejemplos/variantes.png',
    explicacion: 'Genera múltiples variaciones de un mismo espacio cambiando el mobiliario: sofás, mesas, textiles, lámparas y elementos decorativos. El cliente puede comparar opciones y decidir qué combinación le gusta más sin necesidad de renders desde cero.',
  },
  {
    id: 6,
    nombre: 'Puntos de vista',
    descripcion: 'Frontal, esquina, puerta, cenital, contrapicado',
    imagen: '/renders/ejemplos/diferentes_puntos_vista.png',
    explicacion: 'Genera renders de la misma estancia desde distintos ángulos de cámara: frontal, esquina, desde la puerta, cenital (desde arriba) y contrapicado. Permite al cliente recorrer visualmente el espacio y entender las dimensiones reales.',
  },
  {
    id: 7,
    nombre: 'Estilos de referencia',
    descripcion: 'Usar mood board como guía estética',
    imagen: '/renders/ejemplos/estilos_referencia.png',
    explicacion: 'Sube un mood board o imágenes de referencia (estilo, materiales, paleta de colores) y la IA genera renders coherentes con esa estética. Garantiza que todos los renders de un proyecto mantengan un estilo visual consistente.',
  },
  {
    id: 8,
    nombre: 'Horas del día',
    descripcion: 'Amanecer, mediodía, atardecer, nocturna',
    imagen: '/renders/ejemplos/horas_dia.png',
    explicacion: 'Genera renders de la misma estancia en diferentes momentos del día: amanecer, mediodía, atardecer (golden hour) y nocturno. Muestra cómo cambia la atmósfera y la iluminación natural del espacio a lo largo del día.',
  },
  {
    id: 9,
    nombre: '3D > Render',
    descripcion: 'Convertir un modelo 3D en render fotorrealista',
    imagen: '/renders/ejemplos/3d_to_render.png',
    explicacion: 'Convierte un modelo 3D (de SketchUp, Archicad, 3ds Max u otros) en un render fotorrealista con materiales, iluminación y acabados realistas. Ideal cuando ya se tiene el modelo modelado y se necesita una presentación visual de calidad.',
  },
  {
    id: 10,
    nombre: 'Antes/Después Exterior',
    descripcion: 'Comparativa del estado original y la propuesta final',
    imagen: '/renders/ejemplos/antes_despues_exterior.png',
    explicacion: 'Muestra una comparación lado a lado del estado actual del exterior y la propuesta de reforma. El cliente ve claramente la transformación y el impacto del diseño.',
  },
  {
    id: 11,
    nombre: 'Antes/Después Interior',
    descripcion: 'Comparativa del estado original y la propuesta final',
    imagen: '/renders/ejemplos/antes_despues_interior.png',
    explicacion: 'Muestra una comparación lado a lado del estado actual del interior y la propuesta de reforma. Perfecto para que el cliente aprecie el antes y el después en una sola imagen.',
  },
  {
    id: 12,
    nombre: 'Foto a Decoración',
    descripcion: 'Generar propuesta de decoración a partir de una foto',
    imagen: '/renders/ejemplos/foto_a_decoracion_articulos.png',
    explicacion: 'A partir de una foto real del espacio, la IA genera una propuesta de decoración completa con mobiliario, textiles y accesorios. Útil para reformas de espacios que ya existen y necesitan una propuesta de interiorismo.',
  },
]

export const rendersMock = [
  {
    id: 'rnd-01',
    nombre: 'Salón-Comedor',
    m2: 27.3,
    iluminacion: 'Golden hour',
    enfoque: 'wide_angle',
    tipoLuz: 'Luz cálida',
    imagen: '/renders/rerender_ejemplo_01.png',
    descripcion: 'Suelo arcilla, vigas madera, sofá lino arena, mesa olivo, lámpara cerámica.',
    materiales: ['Porcelánico arcilla', 'Lino natural', 'Madera olivo'],
    tag: '#SALON-COMEDOR',
  },
  {
    id: 'rnd-02',
    nombre: 'Cocina',
    m2: 14.0,
    iluminacion: 'Luz natural',
    enfoque: 'perspective',
    tipoLuz: 'Luz diurna',
    imagen: '/renders/rerender_ejemplo_02.png',
    descripcion: 'Muebles madera lacada crema, encimera cuarzo blanco, campana cobre, LED.',
    materiales: ['Madera lacada crema', 'Cuarzo blanco', 'Cobre'],
    tag: '#COCINA',
  },
  {
    id: 'rnd-03',
    nombre: 'Dormitorio Principal',
    m2: 12.6,
    iluminacion: 'Luz matutina',
    enfoque: 'wide_angle',
    tipoLuz: 'Luz matutina',
    imagen: '/renders/rerender_ejemplo_01.png',
    descripcion: 'Cama madera natural, lino crudo, mesitas madera maciza, ropero integrado.',
    materiales: ['Madera natural', 'Lino crudo', 'Lino blanco'],
    tag: '#DORMITORIO-PRINCIPAL',
  },
  {
    id: 'rnd-04',
    nombre: 'Baño 1',
    m2: 12.0,
    iluminacion: 'Luz natural + cálida',
    enfoque: 'perspective',
    tipoLuz: 'Luz natural',
    imagen: '/renders/rerender_ejemplo_02.png',
    descripcion: 'Microcemento arcilla, ducha obra, mampara vidrio, inodoro suspendido, lavabo piedra.',
    materiales: ['Microcemento arcilla', 'Piedra natural', 'Vidrio 8mm'],
    tag: '#BANO-1',
  },
]

// Simulates generation. Returns the mock renders after a delay.
export function generarRenders(modoId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(rendersMock), 1500)
  })
}