# Arquitectura inicial

## Objetivo de esta etapa

Validar estructura, navegación, jerarquías y modelo de contenido. La fidelidad visual es deliberadamente baja; estilos de marca, tokens y componentes productivos entran después de que el recorrido sea estable.

## Modelo principal

1. **Componente:** bloque reutilizable —por ejemplo, Pendientes en tus publicaciones— con reglas, anatomía, estados, variantes y casos de uso.
2. **Template:** receta que combina y ordena componentes, incluyendo condiciones por país o contexto.
3. **Summary implementado:** instancia real generada desde un template. Se incorporará solo si el producto necesita administrarla como objeto propio.

## Mapa de navegación actual

```text
Summary Builder
├── Inicio: ¿Qué necesitas?
│   ├── Builder → Crear una card
│   └── Librería → Catálogo
├── Builder
│   ├── Filtro inicial: card nueva, revisar Librería o consultar criterios orientativos
│   ├── Inicio guiado opcional: tipo de contenido, información y acción → primera propuesta
│   ├── Crear desde cero → card vacía
│   └── Demo: editar una card
│       ├── Card editable (título, tres slots y CTA)
│       ├── Slot 1: información principal; Slot 2: complementaria; Slot 3: recomendaciones contextuales
│       ├── Arrastrar o agregar por botón
│       ├── Cambiar tipo: 13 variantes de contenido del set .Slot variants
│       ├── Origen por slot: Librería, link de Figma o idea por prompt
│       ├── Eliminar slots con control al pasar el cursor o enfocar
│       ├── Ajustar propiedades esenciales en el inspector
│       ├── Valor básico: 1 o 4 columnas (4 métricas en 2 × 2)
│       ├── Preview Desktop/Mobile y reiniciar demo
│       └── Descargar HTML visual para compartir
└── Librería
    ├── Catálogo
    └── Ficha de componente
        ├── Guideline
        ├── Playground
        ├── Casos de uso
        ├── Template (primer contexto de composición para Pendientes en tus publicaciones)
        └── Agregar al Builder
```

El HTML abre en Inicio. El nombre “Summary Builder” de la cabecera funciona como retorno a esa pantalla; los tabs permiten entrar directamente al Builder y a la Librería.

Al elegir “Crear desde cero”, el editor abre una card editable con header, tres slots y footer. La función de cada posición queda explícita: el Slot 1 destaca la información principal, el Slot 2 amplía o explica esa información y el Slot 3 ofrece recomendaciones contextuales. Se puede eliminar cualquiera con el control que aparece al pasar el cursor o mover el foco al slot, y volver a agregarlo sin superar tres. Los tres caminos para el contenido son escoger una variante prehecha de Librería, pegar el enlace de un frame de Figma o describir una idea en un prompt. En el Builder publicado, cada persona autoriza Figma una vez; el servicio seguro obtiene la imagen del nodo con sus propios permisos y la muestra dentro del slot sin el visor interactivo. El HTML compartible conserva la imagen que ya fue generada, pero no solicita credenciales. Librería → Patrón visual ofrece los [13 tipos de contenido](slot-variants.md) identificados en el CSS de `.Slot variants`; el tipo `_Slot` es el estado vacío. Value basic admite de 1 a 4 columnas y usa hasta dos por fila. Las vistas añadidas tienen datos de ejemplo y requieren revisión visual con el diseño completo de Figma.

“Mi idea” incluye dos prompts de muestra —tacómetro de reputación y dinero de hoy— y permite describir el contenido que necesita el slot. Al crear un boceto, el prototipo interpreta el prompt, muestra dos estados de carga y mapea la propuesta a uno de los cuatro patrones locales de referencia. El patrón se puede cambiar desde el inspector y altera la preview. Los valores son de ejemplo; no hay modelo de IA, conexión externa ni validación oficial de lineamientos de Summary/Andes. Para generación real se necesita un servicio seguro y un contrato estructurado de componentes. La exportación captura la vista actual de la card en un HTML con estilos y selector Desktop/Mobile integrados; si una imagen de Figma ya fue generada, queda integrada en el documento junto con el enlace al archivo. El HTML es una propuesta para revisión, no una definición implementable. La card mide 270 px en Desktop. El editor anterior basado en los slots `Data 1–6` de Figma `1216:12003` se conserva para el acceso desde otras cards de la Librería y también descarga HTML; sus imágenes por URL externa requieren conexión al abrirse. El Code Connect de `109:8030` y `109:7880` sugiere `TasksCard`, pero ese componente productivo depende de datos y estado de tareas y no admite componer los slots configurables de esta demo. La selección de template y la validación por país/caso quedan fuera de este corte.

La sesión más reciente se guarda automáticamente en `localStorage` del navegador y se restaura al volver a la misma entrada del Builder. Esto permite que el prototipo conserve un borrador en el mismo navegador/perfil y no necesita que Codex mantenga el estado de cada interacción. No es almacenamiento compartido ni sustituye un servicio de persistencia.

El acceso principal al Builder presenta primero un filtro de una pantalla. Permite continuar con una card nueva, ir a la Librería para revisar las existentes o ver preguntas orientativas cuando aún no está claro si corresponde una card. Se puede empezar desde cero en cualquier momento. El filtro no decide automáticamente ni reemplaza la revisión con el equipo Summary. Después, el recorrido guiado opcional usa tres preguntas: tipo de contenido, información y acción. La primera ofrece categorías genéricas —dato o métrica, tendencia o gráfico, monto, lista, novedad u otra idea— sin nombrar cards existentes. La segunda pide el tema concreto y adapta los campos; el boceto usa títulos neutros hasta que la persona lo edita. La vista previa se actualiza con las respuestas. Al continuar, abre el editor con un boceto local en el primer slot, título y CTA editables y los otros dos slots libres. Los datos de muestra son ilustrativos y no se validan automáticamente los lineamientos.

## Estrategia recomendada

Trabajar por **verticales completas**, no por capas aisladas. La primera vertical propuesta es Pendientes en tus publicaciones:

1. Aparece en el catálogo de la Librería.
2. Tiene una ficha con reglas y estados.
3. Se puede probar en un Playground interactivo con propiedades, contenido, variantes, tema y un canvas neutral de vista previa.
4. Se agrega y se ordena dentro de un Summary.
5. Se contrasta en Desktop y Mobile, y con distintos contextos.
6. Proxima Nova es la tipografía base de toda la interfaz y de las vistas previas. Las variantes Light, Regular, Semibold y Bold están incluidas localmente para que el HTML autocontenido no dependa de fuentes instaladas ni de una conexión.

Este corte revela temprano si faltan campos, relaciones o decisiones de navegación. Cuando el patrón esté validado, sumar nuevas cards será principalmente carga de contenido y variantes.

La pestaña `Template` de Pendientes en tus publicaciones inicia la primera vertical contextual: coloca las dos primeras cards estáticas del orden Desktop una junto a otra, con Pendientes en tus publicaciones en índice 0 y Pendientes en tus ventas en índice 1. El orden proviene de `fury_sso-seller-home-layout-api/cmd/api/config/fury/application.json`; las estructuras y reglas de las cards provienen de sus contratos documentados. La maqueta usa métricas ilustrativas y limita esta primera revisión a MCO, vista All y Desktop. El selector Mobile adapta la presentación de esta maqueta; no reproduce las reglas productivas completas de móvil.

## Vistas previas del catálogo

Cada componente incluye una miniatura semántica y decorativa que permite reconocer su familia antes de abrir la ficha. Las previews de tareas reproducen subcards; métricas y publicidad usan indicadores y gráficos; finanzas, reputación, logística, stock, precios, presencia, scoring y gestión tienen composiciones específicas. Las miniaturas están ocultas para tecnologías de asistencia porque el nombre y la descripción visibles ya comunican la misma información.

## Organización del código

```text
src/
├── components/       # Piezas compartidas del sitio
├── data/             # Fixtures temporales; luego pueden venir de una API/CMS
├── domain/           # Tipos y reglas del modelo Summary Builder
├── features/         # Pantallas agrupadas por capacidad
│   ├── home/
│   ├── catalog/
│   ├── builder/
│   └── component-detail/
└── App.tsx           # Navegación del prototipo
```

## Qué no resolver todavía

- Lenguaje visual final y branding.
- Integración con backend o permisos.
- Persistencia de Summaries y plantillas en un servicio compartido (el borrador local del Builder usa `localStorage`).
- Renderizado de variantes reales por país, caso de uso y dispositivo.
- Edición y publicación de componentes desde la Librería.
- Migración masiva de todas las cards.
- Definición del objeto “Summary implementado” hasta confirmar que debe gestionarse.

## Próximos incrementos

1. Validar con el equipo la ficha de Pendientes en tus publicaciones.
2. Especializar los controles y la vista previa del Playground según el tipo de card.
   - `Pendientes en tus publicaciones` ya usa el contrato real documentado en [`components/pending-publication-tasks.md`](components/pending-publication-tasks.md).
   - `Pendientes en tus ventas` reutiliza la misma familia `TasksCard` y está documentada en [`components/pending-sales-tasks.md`](components/pending-sales-tasks.md).
3. Completar una preview real dentro del canvas para Pendientes en tus publicaciones.
4. Conectar la matriz de países y casos de uso con las variantes documentadas.
5. Reemplazar fixtures por un esquema de contenido estable y guardar el Summary exportado.
