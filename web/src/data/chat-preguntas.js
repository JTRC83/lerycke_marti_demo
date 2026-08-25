// Guided questions the IA chat asks to build the master document.
// Each question has a category so the answers can be organized.

export const PREGUNTAS_CHAT = [
  {
    id: 'q-estancias',
    categoria: 'Estancias',
    pregunta: '¿Qué estancias necesita el cliente? Indica nombre, m² aproximados y tipo de reforma.',
    placeholder: 'Ej: Salón-comedor 27m² reforma completa, cocina 14m² nueva, 2 baños, 3 dormitorios...',
  },
  {
    id: 'q-pavimentos',
    categoria: 'Pavimentos',
    pregunta: '¿Qué materiales prefiere para pavimentos?',
    placeholder: 'Ej: Porcelánico arcilla 60x60cm en salón y cocina, microcemento en baños...',
  },
  {
    id: 'q-paredes',
    categoria: 'Paredes y revestimientos',
    pregunta: '¿Qué tratamiento quiere para las paredes?',
    placeholder: 'Ej: Pintura mate color arena, microcemento en ducha, azulejo cerámico en cocina...',
  },
  {
    id: 'q-carpinteria',
    categoria: 'Carpintería',
    pregunta: '¿Qué tipo de carpintería necesita? Puertas, ventanas, armarios...',
    placeholder: 'Ej: Puertas lacadas blanco mate, aluminio Cortizo en ventanas, ropero a medida en dormitorio...',
  },
  {
    id: 'q-cocina',
    categoria: 'Cocina',
    pregunta: '¿Cómo quiere la cocina? Muebles, encimera, electrodomésticos...',
    placeholder: 'Ej: Muebles lacados crema, encimera cuarzo blanco, península con isla, horno y placa integrados...',
  },
  {
    id: 'q-banos',
    categoria: 'Baños',
    pregunta: '¿Qué materiales y sanitarios quiere para los baños?',
    placeholder: 'Ej: Inodoro suspendido Roca The Gap, ducha de obra con microcemento, mampara de vidrio...',
  },
  {
    id: 'q-iluminacion',
    categoria: 'Iluminación',
    pregunta: '¿Qué tipo de iluminación necesita? ¿Cálida, fría, empotrada, colgante?',
    placeholder: 'Ej: LED empotrable 3000K en techo, lámparas colgantes en comedor, tiras LED bajo muebles cocina...',
  },
  {
    id: 'q-mecanismos',
    categoria: 'Mecanismos',
    pregunta: '¿Qué marca o serie de mecanismos (enchufes, interruptores) prefiere?',
    placeholder: 'Ej: JUNG LS 990 en toda la vivienda, enchufes con USB en cocina...',
  },
  {
    id: 'q-presupuesto',
    categoria: 'Presupuesto',
    pregunta: '¿Hay alguna restricción de presupuesto o partida prioritaria?',
    placeholder: 'Ej: Presupuesto máximo 45.000€, prioridad en cocina y baños, el salón puede esperar...',
  },
  {
    id: 'q-estilo',
    categoria: 'Estilo general',
    pregunta: '¿Cuál es el estilo o concepto general del proyecto?',
    placeholder: 'Ej: Rústico mediterráneo con materiales naturales, paleta en tonos arena y terracota...',
  },
  {
    id: 'q-observaciones',
    categoria: 'Observaciones',
    pregunta: '¿Hay alguna otra petición o detalle que el cliente haya mencionado?',
    placeholder: 'Ej: Quiere más luz natural en el salón, vigas vistas, mobiliario de madera maciza...',
  },
]