type State = { name: string; description: string }
type Item = { name: string; description: string }

type Guideline = {
  source: string
  title: string
  description: string
  sourceNote?: string
  use: string[]
  avoid: string[]
  anatomy: Item[]
  preview: { title: string; value: string; detail: string; secondary?: string; action: string }
  principles: Array<{ value: string; description: string }>
  rules: string[]
  states?: State[]
}

type OperationalGuidelineDefinition = {
  conditions: Array<{ when: string; outcome: string }>
  data: string[]
  behavior: string[]
  responsive: string[]
  accessibility: string[]
  validation: string[]
}

const standardStates: State[] = [
  { name: 'Normal', description: 'Presenta la información disponible y su acción principal.' },
  { name: 'Loading', description: 'Reserva la estructura mientras se recuperan los datos.' },
  { name: 'Sin datos', description: 'Explica por qué todavía no hay información para mostrar.' },
  { name: 'Error', description: 'Informa el problema y ofrece reintento cuando corresponde.' },
  { name: 'No disponible', description: 'Aclara que la funcionalidad no aplica a esa cuenta.' },
]

const a = (name: string, description: string): Item => ({ name, description })
const p = (value: string, description: string) => ({ value, description })

const guidelines: Record<string, Guideline> = {
  reputation: {
    source: 'Master · Card Reputación',
    title: 'Explicar cómo está la reputación y qué variable requiere atención',
    description: 'Combina el color actual, el termómetro y las variables de calidad. La medalla aparece cuando la cuenta pertenece a un nivel MercadoLíder.',
    use: ['Para comunicar el nivel vigente de reputación.', 'Cuando las variables de calidad ayudan a explicar ese nivel.', 'Cuando existe un destino para revisar y corregir una variable.'],
    avoid: ['Para métricas aisladas sin relación con reputación.', 'Para reemplazar el detalle completo de Reputación.', 'Para alertas operativas que deben resolverse el mismo día.'],
    anatomy: [a('Título', 'Identifica la card como Reputación.'), a('Estado principal', 'Muestra el color y, si aplica, la medalla.'), a('Termómetro', 'Ubica la cuenta dentro de los cinco niveles.'), a('Variables', 'Resume reclamos, cancelaciones, mediaciones y demoras.'), a('CTA', 'Dirige a Reputación.')],
    preview: { title: 'Reputación', value: 'Verde', detail: 'Reclamos · Canceladas por ti', secondary: 'Mediaciones · Demoradas', action: 'Ir a Reputación' },
    principles: [p('5 niveles', 'Mantener el orden y la semántica del termómetro.'), p('4 variables', 'Mostrar solo las habilitadas para el período.'), p('1 diagnóstico', 'El estado principal debe coincidir con los datos.')],
    rules: ['Verde está dentro del umbral; naranja anticipa riesgo y rojo requiere revisión inmediata.', 'Si no hay ventas suficientes, mostrar el estado sin color.', 'Mediaciones puede aparecer en períodos cortos y ocultarse en períodos largos.', 'No usar el color como única señal: acompañarlo con texto, icono o posición.'],
    states: [
      { name: 'Con reputación', description: 'Muestra color, termómetro y variables disponibles.' },
      { name: 'MercadoLíder', description: 'Suma la medalla correspondiente al nivel.' },
      { name: 'Sin color', description: 'La cuenta no reúne ventas suficientes.' },
      { name: 'Con advertencia', description: 'Una o más variables están en naranja o rojo.' },
      { name: 'Fallback', description: 'Conserva título y acceso sin inventar valores.' },
    ],
  },
  news: {
    source: 'Master · Alertas y Novedades Seller Home',
    title: 'Presentar novedades relevantes sin competir con las tareas críticas',
    description: 'Reúne comunicaciones editoriales o de producto. Puede destacar una novedad principal y listar otras con acceso a su detalle.',
    use: ['Para cambios de producto o herramientas que el seller debería conocer.', 'Cuando el contenido es informativo y tiene un destino claro.', 'Para agrupar varias novedades breves.'],
    avoid: ['Para pendientes urgentes o bloqueos operativos.', 'Para comunicaciones legales extensas.', 'Para mensajes sin vigencia, destino o valor concreto.'],
    anatomy: [a('Título', 'Identifica Novedades.'), a('Destacada', 'Jerarquiza el mensaje principal cuando existe.'), a('Descripción', 'Explica el cambio con lenguaje breve.'), a('Listado', 'Agrupa novedades secundarias.'), a('CTA', 'Abre el centro de Novedades.')],
    preview: { title: 'Novedades', value: 'Explora nuestro editor', detail: 'Transforma imágenes con inteligencia artificial.', secondary: 'Redujimos tu máximo de Envíos Flex.', action: 'Ir a Novedades' },
    principles: [p('1 destacada', 'Reservar el mayor énfasis para el mensaje principal.'), p('Breve', 'Resolver el contexto en título y una descripción corta.'), p('Con destino', 'Cada novedad accionable abre información relacionada.')],
    rules: ['La novedad destacada es opcional y puede variar por breakpoint.', 'Ordenar por relevancia y vigencia, no solo por fecha.', 'Evitar duplicar alertas críticas que ya viven en otra superficie.', 'Permitir ocultar comunicaciones cuando la definición lo contemple.'],
  },
  'business-metrics': {
    source: 'Master · Card Métricas de negocio',
    title: 'Dar contexto rápido sobre la evolución reciente del negocio',
    description: 'Prioriza ventas brutas, variación y evolución temporal. El gráfico acompaña al valor; no reemplaza su lectura.',
    use: ['Para un indicador que se comprende en pocos segundos.', 'Cuando existe un período comparable y una tendencia relevante.', 'Cuando el detalle vive en una sección especializada.'],
    avoid: ['Para análisis con muchos filtros o dimensiones.', 'Para datos sin período o unidad definidos.', 'Para tareas que exigen resolución inmediata.'],
    anatomy: [a('Título', 'Nombra el dominio de la métrica.'), a('Valor principal', 'Muestra ventas brutas con formato local.'), a('Variación', 'Compara el período e indica dirección.'), a('Período', 'Aclara los últimos 7 días.'), a('Gráfico', 'Representa la evolución.'), a('CTA', 'Abre Métricas de negocio.')],
    preview: { title: 'Métricas de negocio', value: '$ 500.000 · ▲ 20%', detail: 'Ventas brutas en los últimos 7 días', secondary: '22 sep ───────── 29 sep', action: 'Ir a Métricas de negocio' },
    principles: [p('1 métrica', 'Concentrar la jerarquía en un valor principal.'), p('7 días', 'Nombrar siempre el período.'), p('Comparación', 'Acompañar la variación con dirección y porcentaje.')],
    rules: ['Aplicar moneda, separadores y abreviaturas según el sitio.', 'No asumir que subir siempre es positivo.', 'Mantener referencias mínimas del gráfico para interpretar el período.', 'Si no hay comparación válida, ocultar la variación.'],
  },
  money: {
    source: 'Master · Card Tu dinero disponible',
    title: 'Mostrar el dinero disponible y facilitar su gestión',
    description: 'Separa el saldo disponible para usar o transferir del dinero en cuenta y ofrece acceso a Mercado Pago.',
    use: ['Para informar el saldo disponible.', 'Cuando transferir dinero es una acción frecuente y segura.', 'Para enlazar con la experiencia completa de Mercado Pago.'],
    avoid: ['Para reemplazar movimientos o extractos.', 'Cuando el monto no está actualizado o su moneda es ambigua.', 'Para mezclar facturación, deuda o crédito con saldo.'],
    anatomy: [a('Título', 'Define Tu dinero disponible.'), a('Disponible', 'Jerarquiza el monto utilizable.'), a('Acción contextual', 'Permite iniciar Transferir dinero.'), a('En cuenta', 'Informa el monto complementario.'), a('CTA', 'Abre Mercado Pago.')],
    preview: { title: 'Tu dinero disponible', value: '$ 200.200.000', detail: 'Disponible · Transferir dinero', secondary: '$ 100.200.000 en cuenta', action: 'Ir a Mercado Pago' },
    principles: [p('1 moneda', 'Usar el formato monetario del país.'), p('2 saldos', 'Diferenciar disponible y en cuenta.'), p('Acción segura', 'Confirmar cualquier movimiento en el flujo destino.')],
    rules: ['No abreviar montos si puede perderse precisión.', 'Mantener Transferir dinero como acción secundaria.', 'El CTA conduce al dominio completo y no repite la transferencia.', 'Respetar las reglas de privacidad de la cuenta.'],
  },
  billing: {
    source: 'Master · Card Facturación',
    title: 'Anticipar el saldo del período y cualquier pago pendiente',
    description: 'Combina el saldo del período con una advertencia sobre períodos cerrados y su fecha de vencimiento.',
    use: ['Cuando se necesita revisar saldo, deuda o vencimiento.', 'Para anticipar un pago sin desplegar comprobantes.', 'Cuando existe un acceso claro a Facturación.'],
    avoid: ['Para movimientos de Mercado Pago.', 'Para información fiscal extensa.', 'Cuando no puede explicarse el período del saldo.'],
    anatomy: [a('Título', 'Identifica Facturación.'), a('Saldo', 'Muestra el monto del período.'), a('Período', 'Aclara el alcance temporal.'), a('Aviso', 'Informa períodos cerrados por pagar.'), a('Vencimiento', 'Expone la fecha relevante.'), a('CTA', 'Abre Facturación.')],
    preview: { title: 'Facturación', value: '$ 15.000', detail: 'Saldo del período', secondary: '1 período por pagar · Vence el 23 jun', action: 'Ir a Facturación' },
    principles: [p('1 saldo', 'Jerarquizar el monto vigente.'), p('Fecha clara', 'Escribir el vencimiento sin ambigüedad.'), p('Advertencia', 'Destacar deuda solo cuando requiere atención.')],
    rules: ['Distinguir saldo informativo de deuda exigible.', 'Usar el tono de atención para vencimientos.', 'Localizar moneda y fecha según el sitio.', 'No ocultar el vencimiento si hay un período por pagar.'],
  },
  'shipping-collect': {
    source: 'Master · Card Envíos con colecta',
    title: 'Resumir el desempeño de colecta y su impacto en la exposición',
    description: 'Relaciona la semana actual y las últimas cuatro semanas con la exposición prevista para la semana siguiente.',
    use: ['Para explicar el desempeño reciente de colecta.', 'Cuando la exposición prevista orienta una mejora.', 'Para acceder al detalle de Métricas de envíos.'],
    avoid: ['Para listar envíos individuales.', 'Para prometer una exposición no respaldada por datos.', 'Para mezclar modalidades logísticas.'],
    anatomy: [a('Título', 'Identifica Envíos con colecta.'), a('Semana actual', 'Muestra el porcentaje reciente.'), a('Últimas 4 semanas', 'Aporta contexto histórico.'), a('Exposición prevista', 'Comunica nivel y destaque esperado.'), a('CTA', 'Abre Métricas de envíos.')],
    preview: { title: 'Envíos con colecta', value: '97% · 97%', detail: 'Semana actual · Últimas 4 semanas', secondary: 'Excelente, con destaque', action: 'Ir a Métricas de envíos' },
    principles: [p('2 períodos', 'Comparar semana actual y últimas cuatro semanas.'), p('1 pronóstico', 'Nombrarlo como previsto, no garantizado.'), p('Semántica', 'Combinar estado visual y descripción.')],
    rules: ['Mantener el mismo criterio de cálculo entre períodos.', 'Explicar la exposición con texto además del color.', 'No usar porcentajes sin identificar su período.', 'Mostrar recomendación solo con una acción concreta.'],
  },
  'shipping-flex': {
    source: 'Master · Card Envíos Flex',
    title: 'Hacer visible el desempeño semanal de Flex y la exposición prevista',
    description: 'Prioriza el resultado de la semana actual y el diagnóstico de exposición de la próxima semana.',
    use: ['Para seguimiento de Envíos Flex.', 'Cuando el diagnóstico orienta una acción operativa.', 'Para acceder a Métricas de envíos.'],
    avoid: ['Para pendientes de entregas de hoy.', 'Para informar otras modalidades.', 'Cuando no existe un período definido.'],
    anatomy: [a('Título', 'Identifica Envíos Flex.'), a('Métrica actual', 'Muestra el porcentaje semanal.'), a('Diagnóstico', 'Explica el nivel alcanzado.'), a('Exposición prevista', 'Aclara el impacto esperado.'), a('CTA', 'Abre Métricas de envíos.')],
    preview: { title: 'Envíos Flex', value: '94%', detail: 'Semana actual', secondary: 'Regular, sin destaque', action: 'Ir a Métricas de envíos' },
    principles: [p('1 período', 'La semana actual concentra la lectura.'), p('1 diagnóstico', 'Resultado y estado deben coincidir.'), p('Próxima semana', 'Expresar la exposición como previsión.')],
    rules: ['No extrapolar tendencias no entregadas por el servicio.', 'Reservar naranja o rojo para atención.', 'Mantener nombre y unidad estables.', 'Una recomendación debe llevar a una acción específica.'],
  },
  full: {
    source: 'Master · Card Uso de tus espacios en Full',
    title: 'Mostrar la ocupación de Full por tipo de espacio',
    description: 'Separa productos pequeños y medianos de grandes y extragrandes, y relaciona porcentaje con unidades ocupadas.',
    use: ['Para anticipar saturación o disponibilidad en Full.', 'Cuando porcentaje y unidades aportan contexto.', 'Para dirigir a métricas de stock Full.'],
    avoid: ['Para inventario por publicación o SKU.', 'Para capacidad total sin desglose.', 'Cuando porcentaje y unidades usan períodos distintos.'],
    anatomy: [a('Título', 'Define el uso de espacios en Full.'), a('Porcentaje', 'Jerarquiza la ocupación.'), a('Tipo de espacio', 'Distingue los grupos de tamaños.'), a('Progreso', 'Representa el nivel respecto del límite.'), a('Unidades', 'Aclara ocupación y capacidad.'), a('CTA', 'Abre Métricas de Stock Full.')],
    preview: { title: 'Uso de tus espacios en Full', value: '150%', detail: 'Pequeños y medianos', secondary: '1980 u. de 2000 u.', action: 'Ir a Métricas de Stock Full' },
    principles: [p('2 tamaños', 'Separar los grupos definidos.'), p('% + unidades', 'Conservar contexto complementario.'), p('Puede superar 100%', 'No recortar el valor real.')],
    rules: ['Mantener el porcentaje real aunque la barra llegue al límite.', 'No mostrar un grupo vacío como dato disponible.', 'Usar alerta cuando la ocupación compromete la operación.', 'Unidades, porcentaje y etiqueta describen el mismo grupo.'],
  },
  'price-competitiveness': {
    source: 'HO Pricing Tools Q1.26 · Card-Competitividad de precios-MLB',
    title: 'Explicar qué publicaciones tienen precios no competitivos y por dónde empezar',
    description: 'Combina velocímetro, diagnóstico, beneficios afectados y hasta tres publicaciones con mayor volumen de ventas.',
    sourceNote: 'El frame de desktop confirma la composición visual, la jerarquía y el límite visible de publicaciones. La elegibilidad, el cálculo del diagnóstico y los beneficios llegan desde los servicios de producto.',
    use: ['Para detectar oportunidades concretas de precio.', 'Cuando existe un diagnóstico del servicio de competitividad.', 'Para priorizar publicaciones con mayor impacto.'],
    avoid: ['Para comparaciones manuales sin fuente confiable.', 'Para prometer beneficios sin comprobar elegibilidad.', 'Para reemplazar la gestión completa de precios.'],
    anatomy: [a('Título', 'Identifica Competitividad de precios; puede llevar la etiqueta Nueva.'), a('Velocímetro', 'Resume el diagnóstico sin reemplazar el texto.'), a('Métrica', 'Indica publicaciones no competitivas.'), a('Beneficios', 'Explica oportunidades afectadas.'), a('Productos', 'Muestra hasta tres publicaciones priorizadas y una cuarta señal de continuidad.'), a('CTA', 'Abre Publicaciones filtradas.')],
    preview: { title: 'Competitividad de precios', value: 'Mala · 16 publicaciones', detail: 'Con precio no competitivo', secondary: 'Comienza por las publicaciones con más ventas', action: 'Ir a Publicaciones' },
    principles: [p('1 diagnóstico', 'Proviene del servicio de competitividad.'), p('Hasta 3 publicaciones', 'La cuarta posición comunica que hay más resultados y no expone una lista completa.'), p('Beneficios reales', 'Mostrar solo los recibidos.')],
    rules: ['No calcular localmente el diagnóstico ni su color.', 'Si falta todo el contenido, usar el empty state recibido.', 'Los productos funcionan como un único acceso filtrado.', 'Usar énfasis puntual, no párrafos extensos.'],
  },
  'my-page': {
    source: 'Master · Card Mi página',
    title: 'Resumir la fortaleza de la comunidad y proponer una acción de crecimiento',
    description: 'Combina nivel de seguidores, resultados de los últimos 30 días y una recomendación contextual que puede ocultarse.',
    use: ['Para seguimiento de comunidad y conversión.', 'Cuando existe una recomendación concreta.', 'Para acceder a Mi página o crear un cupón.'],
    avoid: ['Como plantilla universal para otras métricas.', 'Para mostrar catálogo de la tienda.', 'Cuando la recomendación no se relaciona con los datos.'],
    anatomy: [a('Título', 'Identifica Mi página.'), a('Nivel', 'Resume la fortaleza de la comunidad.'), a('Seguidores', 'Muestra cantidad y explicación.'), a('Últimos 30 días', 'Detalla nuevos seguidores y compradores.'), a('Recomendación', 'Propone una acción y puede ocultarse.'), a('CTA', 'Abre Mi página.')],
    preview: { title: 'Mi página', value: 'Débil · 10 seguidores', detail: 'Últimos 30 días: 2 nuevos', secondary: 'Aumenta tu comunidad creando descuentos', action: 'Ir a Mi página' },
    principles: [p('30 días', 'Mantener visible el período.'), p('1 nivel', 'Débil, regular o fuerte.'), p('Opcional', 'La recomendación depende del contexto.')],
    rules: ['No usar esta composición como patrón obligatorio.', 'El nivel no debe depender solo del gráfico.', 'La recomendación incluye beneficio, explicación y acción.', 'Respetar la decisión de ocultar la recomendación.'],
  },
  'advertising-metrics': {
    source: 'Master · Card Métricas de publicidad',
    title: 'Resumir resultados publicitarios y facilitar la creación de campañas',
    description: 'Muestra ventas por publicidad y clics recibidos, cada uno con su variación, y una acción para crear campaña.',
    use: ['Para indicadores publicitarios rápidos.', 'Cuando las variaciones tienen comparación válida.', 'Para activar la creación de una campaña.'],
    avoid: ['Para reportes completos.', 'Para mezclar métricas orgánicas y pagadas.', 'Cuando la variación no puede interpretarse.'],
    anatomy: [a('Título', 'Identifica Métricas de publicidad.'), a('Ventas', 'Muestra el resultado principal.'), a('Clics', 'Aporta el volumen de interacción.'), a('Tendencia', 'Indica dirección y porcentaje.'), a('CTA', 'Permite Crear campaña.')],
    preview: { title: 'Métricas de publicidad', value: '784 · ▲ 23%', detail: 'Ventas por publicidad', secondary: '1.346 clics · ▼ 17%', action: 'Crear campaña' },
    principles: [p('2 métricas', 'Ventas y clics conservan jerarquía.'), p('1 variación', 'Cada valor tiene su comparación.'), p('Acción', 'El CTA activa publicidad.')],
    rules: ['No asumir que una caída siempre significa error.', 'Mantener período y base de comparación consistentes.', 'Ocultar la variación si no está disponible.', 'El error debe decir “No pudimos mostrar estos datos”.'],
  },
  'credits-scoring': {
    source: 'Figma Créditos/Scoring · variante M1 + CreditCard productiva',
    title: 'Explicar el score de crédito y ofrecer una acción para mejorarlo',
    description: 'Combina explicación, indicador de score, recomendación opcional y acceso a préstamos. Admite velocímetro, circular o contenido sin score.',
    use: ['Para comunicar un score y su significado.', 'Cuando existe una recomendación relacionada.', 'Para acceder a préstamos o créditos.'],
    avoid: ['Para garantizar aprobación o monto.', 'Para exponer datos sin autorización.', 'Cuando el valor no proviene del servicio de scoring.'],
    anatomy: [a('Título', 'Nombra préstamos o créditos.'), a('Etiqueta Nueva', 'Se usa temporalmente al lanzar la card.'), a('Descripción', 'Explica la utilidad del score.'), a('Indicador', 'Representa la variante disponible.'), a('Recomendación', 'Propone una mejora y puede ocultarse.'), a('CTA', 'Abre Préstamos.')],
    preview: { title: 'Préstamos para tu negocio', value: '399', detail: 'Un buen score puede ayudarte a tener crédito.', secondary: 'Conecta datos de otros bancos', action: 'Ir a Préstamos' },
    principles: [p('0–1000', 'Validar el rango antes de representarlo.'), p('3 variantes', 'Velocímetro, circular o sin indicador.'), p('Opcional', 'Etiqueta y recomendación dependen del contexto.')],
    rules: ['Nunca presentar el score como garantía.', 'No prometer un resultado en la recomendación.', 'Mantener el mismo valor en texto e indicador.', 'La etiqueta Nueva sigue la regla de tres días.'],
  },
  'shipping-turbo': {
    source: 'Master · Panel de control + GenericCard productiva',
    title: 'Comunicar el estado operativo de Envíos Turbo',
    description: 'La referencia confirmada presenta Turbo dentro del panel logístico con estado y descripción breve, por ejemplo “Distancia ajustable”.',
    sourceNote: 'Referencia parcial: no se encontró una card dedicada de Turbo en el Master; no se definen métricas que todavía no fueron validadas.',
    use: ['Para comunicar el estado vigente de Turbo.', 'Cuando el dato tiene descripción y destino.', 'Para mantener consistencia con otras modalidades.'],
    avoid: ['Para inventar porcentajes o períodos.', 'Para listar envíos individuales.', 'Para mezclar Turbo con Flex o colecta.'],
    anatomy: [a('Título', 'Identifica Envíos Turbo.'), a('Estado', 'Comunica la evaluación recibida.'), a('Descripción', 'Explica la condición operativa.'), a('Indicador', 'Refuerza el estado de forma accesible.'), a('CTA', 'Dirige al destino configurado.')],
    preview: { title: 'Envíos Turbo', value: 'Excelente, con destaque', detail: 'Distancia ajustable', secondary: 'Estado operativo actualizado', action: 'Ir al detalle' },
    principles: [p('Dato recibido', 'No calcular localmente el estado.'), p('1 modalidad', 'La card habla solo de Turbo.'), p('Pendiente', 'Validar una card dedicada antes de ampliarla.')],
    rules: ['Usar estados entregados por backend.', 'Acompañar el color con texto e iconografía.', 'Alinear el CTA con el detalle disponible.', 'No tratar el preview actual como especificación definitiva.'],
  },
  'control-panel': {
    source: 'Master · Panel de control',
    title: 'Concentrar señales clave del negocio en una franja de lectura rápida',
    description: 'Reúne reputación, desempeño logístico, ventas brutas y dinero disponible. Cada segmento conserva su lectura y acceso.',
    use: ['Como resumen transversal superior.', 'Cuando varias señales independientes deben verse juntas.', 'Para acceder a reputación, logística, métricas o dinero.'],
    avoid: ['Como sustituto de las cards de detalle.', 'Para segmentos sin jerarquía o destino.', 'Dentro de una card estándar: tiene layout propio.'],
    anatomy: [a('Reputación', 'Muestra nivel y percepción.'), a('Logística', 'Resume modalidades con estado.'), a('Ventas brutas', 'Presenta monto, variación y período.'), a('Dinero disponible', 'Muestra saldo y acción contextual.'), a('Segmentos', 'Cada bloque abre su dominio.')],
    preview: { title: 'Panel de control', value: 'MercadoLíder Platinum · Logísticas', detail: '$ 500.000 ventas · ▲ 20%', secondary: '$ 200.200.000 disponibles', action: 'Cada segmento abre su detalle' },
    principles: [p('4 dominios', 'Reputación, logística, ventas y dinero.'), p('Independientes', 'Cada segmento conserva fuente y destino.'), p('Responsive', 'Prioriza lo esencial en mobile.')],
    rules: ['No convertirlo en una card vertical estándar.', 'Mantener separadores y jerarquías entre dominios.', 'En mobile, adaptar sin comprimir textos ilegibles.', 'Degradar cada dominio de forma independiente cuando sea posible.'],
  },
}

const operationalGuidelines: Record<string, OperationalGuidelineDefinition> = {
  'publication-tasks': {
    conditions: [
      { when: 'La categoría está resumida.', outcome: 'Mostrar nombre, dot si corresponde, chevron, métrica y etiqueta; ocultar el listado de tareas.' },
      { when: 'La categoría tiene detalle disponible.', outcome: 'Mostrar “Ver más”; al activarlo, desplegar en esa subcard hasta cuatro tareas de la categoría y cambiar el control a “Ver menos”, sin expandir las otras categorías.' },
      { when: 'Falla una sola categoría.', outcome: 'Mostrar “No pudimos mostrar estos datos” y “Reintentar” dentro de esa subcard sin bloquear las demás.' },
      { when: 'No se recupera ninguna categoría.', outcome: 'Conservar el título del módulo y reemplazar el contenido por un único fallback con reintento.' },
    ],
    data: ['La métrica agregada y su etiqueta llegan juntas; no se recalculan sumando las pills visibles.', 'Mostrar como máximo cuatro tareas por categoría en la variante desplegada.', 'Conservar el orden documentado: Preguntas, Publicaciones, Productos Full, Precios y Publicidad.', 'Dot y pills expresan los estados recibidos; no asignar color manualmente ni asumir que siempre coinciden.'],
    behavior: ['El chevron conduce al destino general de la categoría; cada tarea navega a su resolución cuando tiene evento.', '“Ver más” despliega en línea el detalle de tareas de esa categoría dentro de su subcard; cada categoría se expande de forma independiente y “Ver menos” vuelve al resumen.', 'Solo una falla completa reemplaza todo el contenido del módulo.', 'Reintentar una falla parcial actualiza la categoría afectada sin borrar las restantes.'],
    responsive: ['El HO validado cubre Desktop; no derivar de él una composición mobile.', 'En Desktop, conservar el ancho y el orden de las subcards dentro de la columna.', 'Si se define una versión mobile, debe preservar categoría, métrica, estado y acción sin depender de hover.'],
    accessibility: ['Anunciar nombre de la categoría, métrica y estado de atención sin depender del color.', 'Cada pill combina la tarea con su cantidad en el orden de lectura.', '“Ver más/menos” expone su estado mediante `aria-expanded` y referencia el contenido controlado.', 'Después de reintentar, comunicar el resultado sin mover el foco inesperadamente.'],
    validation: ['El orden de las cinco categorías coincide con el HO.', 'No hay más de cuatro tareas visibles por categoría.', 'Resumen y detalle usan la misma métrica recibida.', 'Se prueban error parcial, error total y reintento con los textos documentados.'],
  },
  'sales-tasks': {
    conditions: [
      { when: 'El módulo carga correctamente.', outcome: 'Mostrar Envíos de hoy antes de Posventa, cada uno con métrica, etiqueta y navegación propias.' },
      { when: 'Una categoría tiene detalle disponible.', outcome: 'Mostrar “Ver más”; al activarlo, desplegar en esa subcard el detalle de sus tareas y cambiar el control a “Ver menos”, sin expandir las otras categorías.' },
      { when: 'Falla Envíos de hoy o Posventa.', outcome: 'Mostrar el fallback únicamente en la categoría afectada y conservar la otra operativa.' },
      { when: 'Fallan ambas categorías.', outcome: 'Mantener “Pendientes en tus ventas” y mostrar un único fallback con “Reintentar”.' },
    ],
    data: ['Las categorías documentadas son Envíos de hoy y Posventa, en ese orden.', 'Métrica, etiqueta, dot y pills provienen de la fuente; no se recalculan en la card.', 'Envíos de hoy reúne Demorados y modalidades como Colecta, Turbo o Agencia con su ventana horaria.', 'Posventa reúne Reclamos y mediaciones, Devoluciones y Mensajes no leídos.'],
    behavior: ['Cada categoría se despliega, navega y falla de manera independiente.', '“Ver más” abre en línea el detalle de tareas de esa categoría dentro de su subcard; “Ver menos” lo vuelve a plegar.', 'El chevron abre el dominio de la categoría y las tareas dirigen a su resolución cuando tienen evento.', 'El color del dot y el de las pills no se derivan uno del otro.', 'Reintentar una categoría no debe alterar el estado de la otra.'],
    responsive: ['El HO validado cubre Desktop; la composición mobile requiere una referencia específica.', 'En cualquier adaptación futura, conservar Envíos de hoy antes de Posventa.', 'Modalidad y ventana horaria forman una sola unidad y no deben separarse ni truncarse de forma ambigua.'],
    accessibility: ['Anunciar categoría, métrica, tarea y cantidad sin depender del color.', 'Leer modalidad y ventana horaria como una misma tarea.', '“Ver más/menos” es operable con teclado y expone `aria-expanded`.', 'El resultado del reintento se comunica sin perder el foco.'],
    validation: ['Envíos de hoy aparece antes de Posventa.', 'La etiqueta es “Por despachar” para Envíos de hoy y “Por atender” para Posventa en los ejemplos documentados.', 'Se prueban error parcial y error total con reintento.', 'Todas las ventanas horarias se leen completas en Desktop.'],
  },
  reputation: {
    conditions: [
      { when: 'La cuenta alcanza el mínimo de ventas.', outcome: 'Mostrar color de reputación y posición correspondiente en el termómetro.' },
      { when: 'La cuenta todavía no alcanza el mínimo.', outcome: 'Mostrar estado sin color; nunca asumir verde por ausencia de penalizaciones.' },
      { when: 'La cuenta es MercadoLíder.', outcome: 'Agregar la medalla del nivel sin reemplazar el color de reputación.' },
      { when: 'El período es largo y Mediaciones no aplica.', outcome: 'Ocultar esa variable y redistribuir las restantes sin dejar un hueco.' },
    ],
    data: ['El backend define color, nivel y estado de cada variable.', 'Reclamos, cancelaciones, mediaciones y demoras usan sus propios umbrales.', 'Naranja anticipa riesgo; rojo indica el máximo nivel de atención.', 'No promediar variables localmente para construir una reputación.'],
    behavior: ['El CTA abre el detalle de Reputación.', 'Las variables pueden navegar a su explicación cuando existe un evento asociado.', 'El orden del termómetro permanece fijo de rojo a verde.', 'Los cambios de período actualizan variables y contexto juntos.'],
    responsive: ['Mantener la escala completa; no convertirla en un color aislado.', 'Las variables se distribuyen en dos columnas o una columna según el ancho.', 'Evitar que la medalla desplace o trunque el estado principal.'],
    accessibility: ['Anunciar el nivel en texto y la posición dentro de cinco niveles.', 'Cada variable incluye nombre y estado textual.', 'No comunicar advertencias solo mediante naranja o rojo.', 'La medalla tiene nombre accesible y no se anuncia como imagen decorativa.'],
    validation: ['Color, termómetro y texto coinciden.', 'El estado sin color se prueba con una cuenta sin ventas suficientes.', 'Mediaciones respeta la regla de período.', 'El CTA conserva un nombre claro y destino válido.'],
  },
  news: {
    conditions: [
      { when: 'Existe una novedad prioritaria vigente.', outcome: 'Mostrarla como destacada antes del listado en desktop.' },
      { when: 'La vista es mobile.', outcome: 'Ocultar el bloque destacado si así lo define NewsCard y conservar las filas navegables.' },
      { when: 'Una comunicación venció o fue descartada.', outcome: 'Retirarla del listado; no dejar espacios vacíos.' },
      { when: 'No hay novedades vigentes.', outcome: 'Ocultar la card o usar el vacío definido; no mostrar contenido histórico.' },
    ],
    data: ['El orden se define por relevancia y vigencia.', 'Cada fila necesita título, descripción breve y evento de navegación.', 'La novedad destacada es opcional y solo puede haber una.', 'Una alerta crítica no debe duplicarse aquí como contenido editorial.'],
    behavior: ['La fila completa es interactiva cuando conduce a un detalle.', 'Una comunicación descartable ofrece su acción en un menú secundario.', 'El CTA abre el centro de Novedades.', 'Ocultar una novedad no afecta a las demás.'],
    responsive: ['Priorizar título y mensaje; recortar ilustraciones antes que información.', 'No llevar la destacada de desktop a mobile sin validar su composición.', 'Las filas mantienen separación y áreas táctiles suficientes.'],
    accessibility: ['El nombre accesible de cada fila combina título y propósito.', 'Ilustraciones decorativas usan texto alternativo vacío.', 'El menú de opciones se opera con teclado y cierra con Escape.', 'La fecha o vigencia no se comunica únicamente por posición.'],
    validation: ['Solo una novedad puede estar destacada.', 'No aparecen comunicaciones vencidas.', 'Todas las filas tienen destino o se presentan como texto no interactivo.', 'La versión mobile se valida sin bloque destacado.'],
  },
  'business-metrics': {
    conditions: [
      { when: 'Existe valor y período válidos.', outcome: 'Mostrar ventas brutas como métrica principal.' },
      { when: 'Existe una base de comparación válida.', outcome: 'Mostrar delta, dirección y porcentaje.' },
      { when: 'No existe comparación.', outcome: 'Ocultar el delta; no mostrar 0% como reemplazo.' },
      { when: 'No hay suficientes puntos para el gráfico.', outcome: 'Conservar valor y período y ocultar la visualización incompleta.' },
    ],
    data: ['Valor, moneda, período, delta y serie provienen de la misma ventana temporal.', 'Aplicar formato monetario del sitio antes de abreviar.', 'El gráfico no calcula ni corrige datos.', 'Subir o bajar hereda la semántica de la métrica, no una regla universal.'],
    behavior: ['El CTA abre Métricas de negocio con el mismo contexto temporal cuando sea posible.', 'El gráfico es informativo; no introduce filtros dentro de la card.', 'Actualizar valor, delta y serie en una sola transición para evitar contradicciones.'],
    responsive: ['El valor principal nunca se trunca.', 'Simplificar etiquetas del eje antes que ocultar el período.', 'El gráfico conserva proporción y no genera scroll horizontal.'],
    accessibility: ['Entregar un resumen textual de valor, período y variación.', 'El gráfico decorativo no duplica todos los puntos al lector de pantalla.', 'La dirección de la variación se expresa con palabras además de flecha/color.'],
    validation: ['Valor, delta y serie usan el mismo período.', 'La moneda está localizada.', 'La card funciona sin delta y sin gráfico.', 'El CTA abre el dominio correcto.'],
  },
  money: {
    conditions: [
      { when: 'Existe saldo disponible.', outcome: 'Mostrarlo como monto principal con moneda del sitio.' },
      { when: 'La transferencia está habilitada.', outcome: 'Mostrar “Transferir dinero” como acción contextual.' },
      { when: 'La transferencia no está habilitada.', outcome: 'Ocultar la acción sin deshabilitar visualmente un control que no funciona.' },
      { when: 'Un saldo no puede recuperarse.', outcome: 'Mostrar estado de error; no reemplazarlo por $0.' },
    ],
    data: ['Disponible y En cuenta son conceptos distintos y no deben sumarse localmente.', 'Los montos llegan con moneda y precisión definidas por Mercado Pago.', 'Cero es un saldo real; ausencia de dato es un estado diferente.', 'No persistir ni exponer datos sensibles fuera de la sesión.'],
    behavior: ['Transferir dinero inicia un flujo seguro fuera de la card.', 'El CTA de pie abre Mercado Pago y no ejecuta una transferencia.', 'La card no confirma ni completa movimientos financieros.'],
    responsive: ['Mantener monto y moneda en una sola unidad de lectura.', 'Si el monto es extenso, ajustar tipografía dentro del rango permitido; no cortarlo.', 'Las dos acciones conservan jerarquías diferentes.'],
    accessibility: ['Leer el monto con moneda y separadores comprensibles.', 'Distinguir verbalmente Disponible de En cuenta.', 'Las acciones tienen nombres específicos y no dependen del icono.'],
    validation: ['Se diferencian saldo 0, loading y error.', 'La moneda coincide con el sitio.', 'Transferir aparece solo con evento habilitado.', 'El CTA no dispara operaciones financieras.'],
  },
  billing: {
    conditions: [
      { when: 'Existe un período cerrado por pagar.', outcome: 'Mostrar advertencia, cantidad de períodos y próximo vencimiento.' },
      { when: 'No hay deuda exigible.', outcome: 'Ocultar el bloque de advertencia; no mostrar una fecha vacía.' },
      { when: 'El vencimiento ya pasó.', outcome: 'Cambiar el mensaje a vencido según la respuesta; no conservar tiempo futuro.' },
      { when: 'Falta el saldo del período.', outcome: 'Usar loading/error y no inferir $0.' },
    ],
    data: ['Saldo del período, deuda y vencimiento son campos independientes.', 'Las fechas se localizan al sitio y zona horaria de facturación.', 'El tono de alerta responde al estado recibido.', 'No calcular recargos o deuda dentro de la card.'],
    behavior: ['El CTA abre Facturación.', 'La advertencia puede abrir directamente el período pendiente si existe ese evento.', 'La card es informativa y no procesa pagos.'],
    responsive: ['Monto, deuda y fecha conservan su orden de lectura.', 'No truncar la fecha de vencimiento.', 'El aviso puede crecer a dos líneas sin solaparse con el CTA.'],
    accessibility: ['Anunciar “por pagar” o “vencido” en texto.', 'No depender del indicador naranja.', 'La fecha se expone en un formato comprensible para lector de pantalla.'],
    validation: ['Se prueban sin deuda, por pagar y vencido.', 'La fecha coincide con la zona de facturación.', 'Saldo 0 no se confunde con ausencia.', 'El CTA abre Facturación.'],
  },
  'shipping-collect': {
    conditions: [
      { when: 'Existen datos de semana actual y últimas cuatro semanas.', outcome: 'Mostrar ambos períodos para comparación.' },
      { when: 'Solo existe semana actual.', outcome: 'Mostrar una métrica sin reservar un espacio vacío para el histórico.' },
      { when: 'Existe pronóstico de exposición.', outcome: 'Mostrarlo como previsto para la próxima semana.' },
      { when: 'Existe recomendación accionable.', outcome: 'Mostrarla debajo del diagnóstico y permitir ocultarla.' },
    ],
    data: ['Los porcentajes comparados usan la misma definición de cumplimiento.', 'La exposición proviene del servicio logístico.', 'El color del estado llega asociado al diagnóstico.', 'No calcular una tendencia solo a partir de dos porcentajes.'],
    behavior: ['El CTA abre Métricas de envíos.', 'La recomendación tiene acción propia y menú para ocultarla.', 'Ocultar la recomendación no elimina las métricas.', 'El reintento recupera métricas y exposición juntas.'],
    responsive: ['Las dos métricas pueden apilarse sin perder sus períodos.', 'Mantener “prevista la próxima semana” junto al diagnóstico.', 'El menú de recomendación no sale del viewport.'],
    accessibility: ['Anunciar porcentaje, período y diagnóstico.', 'El estado usa texto además del color/icono.', 'El menú indica si está abierto y admite Escape.'],
    validation: ['Los dos períodos usan el mismo criterio.', 'La exposición se presenta como pronóstico.', 'La card funciona con una sola métrica.', 'Ocultar recomendación no altera el diagnóstico.'],
  },
  'shipping-flex': {
    conditions: [
      { when: 'Existe el desempeño de la semana actual.', outcome: 'Mostrarlo como métrica principal.' },
      { when: 'Existe diagnóstico de exposición.', outcome: 'Mostrar nivel y destaque previsto para la próxima semana.' },
      { when: 'El diagnóstico requiere atención.', outcome: 'Usar tono naranja o rojo recibido y acompañarlo con texto.' },
      { when: 'Existe recomendación accionable.', outcome: 'Mostrarla como bloque opcional y descartable.' },
    ],
    data: ['No extrapolar últimas cuatro semanas si el servicio no las entrega.', 'Métrica, diagnóstico y color deben pertenecer al mismo corte.', 'La exposición es una previsión, no una promesa.', 'La modalidad siempre es Flex.'],
    behavior: ['El CTA abre Métricas de envíos filtradas a Flex cuando sea posible.', 'La recomendación no reemplaza el diagnóstico.', 'Un error no debe conservar un porcentaje anterior como vigente.'],
    responsive: ['Mantener porcentaje y período juntos.', 'Permitir que el diagnóstico ocupe dos líneas.', 'Las acciones siguen siendo alcanzables con una mano en mobile.'],
    accessibility: ['Expresar Regular/Excelente/Crítico como texto.', 'No usar color como única señal.', 'Anunciar que la exposición corresponde a la próxima semana.'],
    validation: ['No aparece un histórico inexistente.', 'Diagnóstico y color coinciden.', 'Se diferencia dato vigente de error.', 'El CTA conserva el contexto Flex.'],
  },
  full: {
    conditions: [
      { when: 'Existe información para un grupo de tamaños.', outcome: 'Mostrar porcentaje, barra y unidades de ese grupo.' },
      { when: 'Un grupo no tiene datos.', outcome: 'Ocultarlo por completo; no mostrar una métrica vacía.' },
      { when: 'La ocupación supera 100%.', outcome: 'Mostrar el porcentaje real y limitar solo el dibujo de la barra a su ancho máximo.' },
      { when: 'La ocupación entra en zona crítica.', outcome: 'Aplicar el estado recibido y priorizar el acceso al detalle.' },
    ],
    data: ['Los grupos son Pequeños y medianos y Grandes y extragrandes.', 'Porcentaje y unidades deben describir el mismo grupo y corte.', 'La barra representa capacidad, pero no sustituye el número.', 'No recalcular capacidad con datos parciales.'],
    behavior: ['El CTA abre Métricas de Stock Full.', 'Cada grupo se presenta como unidad de lectura independiente.', 'No incluir control de expansión si toda la información cabe en la card.'],
    responsive: ['Apilar grupos cuando no caben lado a lado.', 'Mantener unidades completas debajo de la barra.', 'No comprimir la barra hasta perder legibilidad.'],
    accessibility: ['Usar `role="meter"` con valor numérico y nombre del grupo.', 'Anunciar el porcentaje real aunque supere 100.', 'El estado crítico incluye texto o icono con nombre accesible.'],
    validation: ['Se prueba con uno y dos grupos.', 'Se prueba un valor mayor a 100%.', 'Porcentaje y unidades coinciden.', 'El grupo sin datos no deja hueco.'],
  },
  'price-competitiveness': {
    conditions: [
      { when: 'Hay speedometer y sellerId.', outcome: 'Renderizar el indicador con los datos del servicio.' },
      { when: 'Hay publicaciones no competitivas.', outcome: 'Mostrar hasta tres productos priorizados y señalar el cuarto solo si existen más resultados; enlazar al listado filtrado.' },
      { when: 'Hay beneficios afectados.', outcome: 'Mostrar únicamente los beneficios recibidos.' },
      { when: 'No hay indicador, productos ni beneficios.', outcome: 'Mostrar el empty state entregado por backend.' },
    ],
    data: ['El frontend no calcula score, color ni ángulo del velocímetro.', 'La cantidad de publicaciones y el diagnóstico pertenecen al mismo resultado.', 'Los productos se ordenan por impacto definido por backend.', 'El texto en negrita solo interpreta marcadores seguros recibidos.'],
    behavior: ['El grupo de productos funciona como acceso al listado filtrado.', 'El CTA abre Publicaciones con el filtro de precio no competitivo.', 'La ausencia de beneficios o productos redistribuye las secciones restantes sin dejar huecos.', 'La etiqueta Nueva es una condición transversal: se muestra durante los primeros tres días de una card nueva.'],
    responsive: ['Indicador y métrica pueden apilarse.', 'Los nombres de productos admiten truncado controlado; el destino conserva el nombre completo.', 'No reducir el velocímetro por debajo de su tamaño legible.'],
    accessibility: ['El diagnóstico y la cantidad existen como texto, no solo en el velocímetro.', 'Las miniaturas son decorativas si el nombre del producto ya está presente.', 'El enlace del grupo anuncia que abre publicaciones filtradas.'],
    validation: ['Se prueban todas las combinaciones opcionales.', 'No hay cálculo local del diagnóstico.', 'El empty state aparece solo si falta todo el contenido.', 'Los destinos conservan filtros válidos.'],
  },
  'my-page': {
    conditions: [
      { when: 'Existe un nivel calculado.', outcome: 'Mostrar Débil, Regular o Fuerte junto al indicador.' },
      { when: 'Existen datos de los últimos 30 días.', outcome: 'Mostrar seguidores nuevos y seguidores que compraron.' },
      { when: 'Hay una recomendación relevante.', outcome: 'Mostrar beneficio, explicación y acción; permitir ocultarla.' },
      { when: 'La recomendación fue ocultada.', outcome: 'Conservar métricas y CTA sin dejar espacio reservado.' },
    ],
    data: ['Nivel, seguidores y descripción provienen del mismo corte.', 'El período de resultados recientes es de 30 días.', 'La recomendación no modifica el nivel ni las métricas.', 'No inferir conversión dividiendo valores si el backend no la entrega.'],
    behavior: ['Crear cupón abre el flujo específico de la recomendación.', 'El CTA de pie abre Mi página.', 'El menú secundario permite ocultar la recomendación.', 'Ocultar no debe afectar el acceso principal.'],
    responsive: ['Indicador y cantidad se mantienen juntos.', 'Las métricas recientes pueden apilarse.', 'La recomendación conserva acción y menú dentro del viewport.'],
    accessibility: ['El nivel se anuncia como texto.', 'El indicador visual tiene un nombre accesible y no duplica información.', 'El menú declara su estado abierto/cerrado.', 'El CTA y Crear cupón tienen propósitos distintos.'],
    validation: ['Se prueban los tres niveles.', 'Siempre se muestra el período de 30 días.', 'La card funciona sin recomendación.', 'Ocultar recomendación mantiene métricas y CTA.'],
  },
  'advertising-metrics': {
    conditions: [
      { when: 'Existe una métrica publicitaria.', outcome: 'Mostrar valor, etiqueta y variación si está disponible.' },
      { when: 'Una métrica no tiene delta.', outcome: 'Ocultar solo su variación; conservar el valor.' },
      { when: 'No hay campañas ni datos.', outcome: 'Usar el vacío definido y mantener Crear campaña si aplica.' },
      { when: 'La carga falla.', outcome: 'Mostrar “No pudimos mostrar estos datos” y permitir reintento.' },
    ],
    data: ['Ventas por publicidad y clics son métricas independientes.', 'Cada delta tiene su propia base de comparación.', 'La flecha y el color llegan o se derivan del signo del dato validado.', 'No mezclar resultados orgánicos en esta card.'],
    behavior: ['Crear campaña abre el flujo de publicidad.', 'Reintentar solicita nuevamente las métricas sin cambiar de pantalla.', 'La card no incluye filtros ni edición de campañas.'],
    responsive: ['Las métricas pueden apilarse conservando igual jerarquía.', 'Valor y delta permanecen en la misma unidad de lectura.', 'El CTA se mantiene visible al final.'],
    accessibility: ['Expresar la variación como “subió” o “bajó”.', 'No depender de flecha o color.', 'Relacionar cada delta con su métrica mediante estructura semántica.'],
    validation: ['Cada métrica funciona sin delta.', 'El error usa el texto específico.', 'El CTA sigue disponible según el estado definido.', 'No aparecen datos orgánicos.'],
  },
  'credits-scoring': {
    conditions: [
      { when: 'El servicio entrega score y variante.', outcome: 'Mostrar velocímetro o indicador circular según el contrato.' },
      { when: 'La variante no incluye score.', outcome: 'Mostrar la explicación sin reservar espacio para el indicador.' },
      { when: 'La card lleva menos de tres días publicada.', outcome: 'Mostrar la etiqueta Nueva/NOVA.' },
      { when: 'Existe recomendación elegible.', outcome: 'Mostrarla con acción y opción de ocultar.' },
    ],
    data: ['Validar el score dentro del rango 0–1000.', 'No convertir score en promesa de crédito.', 'La variante llega definida por producto.', 'La recomendación y su acción son independientes del CTA principal.'],
    behavior: ['El link informativo explica el score.', 'Conectar bancos abre el flujo específico y no concede permisos desde la card.', 'El CTA abre Préstamos.', 'Ocultar recomendación conserva score y CTA.'],
    responsive: ['Descripción e indicador pueden apilarse.', 'El número del score permanece legible.', 'La etiqueta Nueva no debe tapar el título.'],
    accessibility: ['Anunciar score actual y rango total.', 'La forma del indicador no sustituye el valor numérico.', 'La recomendación se presenta como región con encabezado.', 'El menú de opciones es operable con teclado.'],
    validation: ['Se prueban velocímetro, circular y sin score.', 'Se validan 0, valores intermedios y 1000.', 'Nueva desaparece después de tres días.', 'Ocultar recomendación no cambia el score.'],
  },
  'shipping-turbo': {
    conditions: [
      { when: 'El backend entrega estado y descripción.', outcome: 'Mostrar ambos sin reinterpretarlos localmente.' },
      { when: 'Existe una condición como Distancia ajustable.', outcome: 'Presentarla como descripción operativa, no como métrica numérica.' },
      { when: 'Falta el estado dedicado.', outcome: 'Usar el fallback de GenericCard; no copiar porcentajes de Flex o colecta.' },
      { when: 'Se valide una card dedicada en Figma.', outcome: 'Revisar esta anatomía y reemplazar las reglas parciales.' },
    ],
    data: ['Turbo es una modalidad independiente.', 'Estado, tono y descripción provienen de backend.', 'No existe todavía una métrica dedicada validada en el Master.', 'El preview actual es representativo, no fuente de verdad.'],
    behavior: ['El CTA usa el evento configurado por GenericCard.', 'La card no debe simular ajuste de distancia dentro del Summary.', 'Error y loading siguen el patrón estándar.'],
    responsive: ['Título, estado y descripción se apilan sin perder relación.', 'No introducir gráficos no validados para llenar espacio.', 'El CTA permanece visible y legible.'],
    accessibility: ['Expresar el estado en texto.', 'No depender del tono semántico.', 'El destino del CTA debe explicar qué detalle abre.'],
    validation: ['No hay métricas inventadas.', 'Los textos coinciden con backend.', 'La fuente parcial está señalada en la guía.', 'La futura referencia Figma obliga a una revisión.'],
  },
  'control-panel': {
    conditions: [
      { when: 'Un dominio está habilitado y tiene datos.', outcome: 'Mostrar su segmento con valor, contexto y destino.' },
      { when: 'Un dominio no aplica a la cuenta.', outcome: 'Ocultar el segmento y redistribuir el espacio disponible.' },
      { when: 'Un dominio falla.', outcome: 'Degradar ese segmento de forma independiente siempre que el contrato lo permita.' },
      { when: 'La vista es mobile.', outcome: 'Priorizar los segmentos definidos para ese contexto; no comprimir los cuatro.' },
    ],
    data: ['Reputación, logística, ventas y dinero conservan fuentes independientes.', 'El panel no calcula un estado global.', 'Cada modalidad logística mantiene su propio tono y descripción.', 'Monto, moneda, período y variación se localizan por dominio.'],
    behavior: ['Cada segmento completo navega a su dominio.', 'Los elementos logísticos internos pueden tener destinos propios.', 'El panel no contiene un CTA general.', 'Ocultar un segmento no cambia los datos de los restantes.'],
    responsive: ['Desktop usa una franja horizontal; mobile adopta una composición priorizada.', 'Nunca reducir texto por debajo de la escala legible.', 'Mantener separadores claros entre segmentos.'],
    accessibility: ['Exponer el panel como región con nombre.', 'Cada segmento interactivo tiene nombre y destino específicos.', 'El orden de foco coincide con el orden visual.', 'Los estados logísticos incluyen texto además de color.'],
    validation: ['Se prueban todas las combinaciones de segmentos.', 'Cada segmento navega al destino correcto.', 'Un error parcial no derriba todo el panel.', 'La versión mobile no genera scroll horizontal.'],
  },
}

export function OperationalGuideline({ componentId, showResponsiveAccessibility = true }: { componentId: string; showResponsiveAccessibility?: boolean }) {
  const operational = operationalGuidelines[componentId]
  if (!operational) return null

  return <>
    <section className="content-section" id="logica">
      <h2>Lógica y condiciones de aparición</h2>
      <p className="section-intro">Reglas para decidir qué se muestra y cómo responde la card.</p>
      <div className="guideline-logic-table" role="table" aria-label="Condiciones de la card">
        <div className="guideline-logic-table__header" role="row"><strong role="columnheader">Si ocurre</strong><strong role="columnheader">Entonces</strong></div>
        {operational.conditions.map((condition) => <div className="guideline-logic-table__row" role="row" key={condition.when}><span role="cell">{condition.when}</span><span role="cell">{condition.outcome}</span></div>)}
      </div>
    </section>

    <section className="content-section" id="datos-comportamiento">
      <h2>Datos, jerarquía y comportamiento</h2>
      <div className="guideline-operational-grid">
        <div><span className="guideline-label">Datos y jerarquía</span><ul>{operational.data.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
        <div><span className="guideline-label">Comportamiento</span><ul>{operational.behavior.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
      </div>
    </section>

    {showResponsiveAccessibility && <section className="content-section" id="responsive-accesibilidad">
      <h2>Responsive y accesibilidad</h2>
      <div className="guideline-operational-grid">
        <div><span className="guideline-label">Responsive</span><ul>{operational.responsive.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
        <div><span className="guideline-label">Accesibilidad</span><ul>{operational.accessibility.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
      </div>
    </section>}

    <section className="content-section" id="validacion">
      <h2>Checklist de validación</h2>
      <ul className="guideline-validation">{operational.validation.map((rule) => <li key={rule}><span aria-hidden="true">✓</span>{rule}</li>)}</ul>
    </section>
  </>
}

export function CardStructureRules() {
  return <section className="content-section" id="transversales">
    <h2>Reglas transversales de las cards</h2>
    <p className="section-intro">Definidas en el Guideline Summary para las cards de escritorio.</p>
    <div className="guideline-global-rules">
      <div><strong>Título</strong><span>Máximo 32 caracteres y una línea.</span></div>
      <div><strong>Etiqueta “Nueva”</strong><span>Mostrarla durante los primeros 3 días.</span></div>
      <div><strong>Sugerencia contextual</strong><span>Es opcional y debe relacionarse con los datos.</span></div>
      <div><strong>CTA</strong><span>Obligatorio en desktop: máximo 32 caracteres y una línea.</span></div>
    </div>
  </section>
}

export function ComponentGuideline({ componentId }: { componentId: string }) {
  const g = guidelines[componentId]
  if (!g) return null
  const states = g.states ?? standardStates

  return <div className="detail-layout">
    <div>
      <section className="content-section guideline-intro" id="objetivo">
        <span className="guideline-kicker">Fuente · {g.source}</span><h2>{g.title}</h2><p>{g.description}</p>
        {g.sourceNote && <p className="guideline-source-note">{g.sourceNote}</p>}
      </section>
      <section className="content-section" id="uso"><div className="dos-donts">
        <div className="guideline-column guideline-column--do"><span className="guideline-label">Usar</span><h2>Cuándo usar</h2><ul>{g.use.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className="guideline-column guideline-column--dont"><span className="guideline-label">Evitar</span><h2>Cuándo no usar</h2><ul>{g.avoid.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div></section>
      <section className="content-section" id="anatomia"><h2>Anatomía</h2><p className="section-intro">La jerarquía reproduce la fuente; los valores son ejemplos de documentación.</p><div className="publication-anatomy">
        <div className="generic-anatomy__preview" aria-label={`Anatomía de ${g.preview.title}`}>
          <div className="generic-anatomy__title"><span className="number-marker">1</span>{g.preview.title}</div>
          <div className="generic-anatomy__value"><span className="number-marker">2</span><strong>{g.preview.value}</strong></div>
          <div className="generic-anatomy__detail"><span className="number-marker">3</span>{g.preview.detail}</div>
          {g.preview.secondary && <div className="generic-anatomy__secondary"><span className="number-marker">4</span>{g.preview.secondary}</div>}
          <div className="generic-anatomy__action"><span className="number-marker">5</span>{g.preview.action}<span aria-hidden="true">›</span></div>
        </div>
        <ol className="anatomy-list">{g.anatomy.map((item) => <li key={item.name}><strong>{item.name}</strong><span>{item.description}</span></li>)}</ol>
      </div></section>
      <section className="content-section" id="contenido"><h2>Reglas del componente</h2><div className="guideline-rules">{g.principles.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.description}</span></div>)}</div><ul className="guideline-checklist">{g.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></section>
      <OperationalGuideline componentId={componentId} />
      <CardStructureRules />
      <section className="content-section" id="estados"><h2>Variantes y estados</h2><div className="publication-states">{states.map((state) => <div className="publication-state" key={state.name}><span className="publication-state__sample" aria-hidden="true"><i /><i /><i /></span><strong>{state.name}</strong><p>{state.description}</p></div>)}</div></section>
    </div>
    <aside className="detail-index" aria-label="En esta guía"><strong>En esta guía</strong><a href="#objetivo">Objetivo</a><a href="#uso">Cuándo usar</a><a href="#anatomia">Anatomía</a><a href="#contenido">Reglas del componente</a><a href="#logica">Lógica y condiciones</a><a href="#datos-comportamiento">Datos y comportamiento</a><a href="#responsive-accesibilidad">Responsive y accesibilidad</a><a href="#validacion">Checklist</a><a href="#transversales">Reglas transversales</a><a href="#estados">Variantes y estados</a></aside>
  </div>
}
