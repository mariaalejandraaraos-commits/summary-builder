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
│   └── Editor directo: card vacía o sesión local restaurada
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

Al elegir Builder o “+ Crear card”, el editor abre directamente una card editable con header y footer, sin slots iniciales si no hay una sesión guardada. Se pueden agregar hasta tres slots. La función de cada posición queda explícita: el Slot 1 destaca la información principal, el Slot 2 amplía o explica esa información y el Slot 3 ofrece recomendaciones contextuales. Se puede eliminar cualquiera con el control que aparece al pasar el cursor o mover el foco al slot, y volver a agregarlo sin superar tres. Los tres caminos para el contenido son escoger una variante prehecha de Librería, pegar el enlace de un frame de Figma o describir una idea en un prompt. En el Builder publicado, cada persona autoriza Figma una vez; el servicio seguro obtiene la imagen del nodo con sus propios permisos y la muestra dentro del slot sin el visor interactivo. El HTML compartible conserva la imagen que ya fue generada, pero no solicita credenciales. Librería → Patrón visual ofrece los [13 tipos de contenido](slot-variants.md) identificados en el CSS de `.Slot variants`; el tipo `_Slot` es el estado vacío. Value basic admite de 1 a 4 columnas y usa hasta dos por fila. Las vistas añadidas tienen datos de ejemplo y requieren revisión visual con el diseño completo de Figma.

“Mi idea” incluye dos prompts de muestra —tacómetro de reputación y dinero de hoy— y permite describir el contenido que necesita el slot. Al crear un boceto, el prototipo interpreta el prompt, muestra dos estados de carga y mapea la propuesta a uno de los cuatro patrones locales de referencia. El patrón se puede cambiar desde el inspector y altera la preview. Los valores son de ejemplo; no hay modelo de IA, conexión externa ni validación oficial de lineamientos de Summary/Andes. Para generación real se necesita un servicio seguro y un contrato estructurado de componentes. La exportación captura la vista actual de la card en un HTML con estilos y selector Desktop/Mobile integrados; si una imagen de Figma ya fue generada, queda integrada en el documento junto con el enlace al archivo. El HTML es una propuesta para revisión, no una definición implementable. La card mide 270 px en Desktop. El editor anterior basado en los slots `Data 1–6` de Figma `1216:12003` se conserva para el acceso desde otras cards de la Librería y también descarga HTML; sus imágenes por URL externa requieren conexión al abrirse. El Code Connect de `109:8030` y `109:7880` sugiere `TasksCard`, pero ese componente productivo depende de datos y estado de tareas y no admite componer los slots configurables de esta demo. La selección de template y la validación por país/caso quedan fuera de este corte.

La sesión más reciente se guarda automáticamente en `localStorage` del navegador y se restaura al volver a la misma entrada del Builder. Esto permite que el prototipo conserve un borrador en el mismo navegador/perfil y no necesita que Codex mantenga el estado de cada interacción. No es almacenamiento compartido ni sustituye un servicio de persistencia.

El inicio “¿Qué necesitas?” es el punto de entrada al prototipo. Desde allí se puede abrir el editor del Builder o explorar la Librería. El filtro previo y las tres preguntas del antiguo inicio guiado se retiraron el 21 de octubre de 2026. “Reiniciar demo” también vuelve directamente al editor. La generación de propuestas se realiza desde “Mi idea” dentro de un slot.

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

### Elementos mobile y cards

El editor principal distingue `BuilderElementKind`: `card` y `mobile-section`. La segunda opción solo se ofrece con Mobile activo. Una sección no es una variante de slot ni una card sin borde: se representa con el tipo discriminado `MobileSection` en `src/domain/mobile-sections.ts` y sus propios hijos.

- `control-panel`: reputación, ventas brutas y dinero. Anatomía basada en Librería Summary, nodo `687:12911`, consultado el 26 de octubre de 2026. El panel de reputación `683:12760` utiliza las nueve variantes del component set `2019:11410`; sus metadatos de presentación están en `src/domain/mobile-reputation.ts` y se renderizan con `MobileReputationPanel`. El campo opcional `reputation.variant` conserva compatibilidad con los borradores anteriores: sin ese campo se reconoce el valor textual conocido; un valor desconocido no recibe ícono ni escala. Elegir otra variante guarda su identificador y su texto coherente, sin reemplazar la etiqueta o el texto de apoyo personalizados.
- `pending-tasks`: título y seis indicadores de tareas. Anatomía contrastada con Librería Summary, sección `2012:10318`, componente con título `2017:13592`, consultado el 26 de octubre de 2026. En Figma, el contenedor mide 327 px; las filas, 319 px; cada elemento, 101 × 92 px. Las filas tienen 10 px de separación y las columnas, 8 px. Por petición de la usuaria, la sección del Builder y su grilla usan el ancho completo de 320 px del Panel, sin restar 8 px a la grilla ni ampliar el contenedor de la vista independiente. Esto deja elementos de aproximadamente 101,33 px de ancho, con el padding original de 16 px vertical y 12 px horizontal. A 12/15, «Productos Full / por gestionar» conserva las dos líneas del diseño. La misma regla aplica a la vista contextual y al HTML descargado. Se implementa la composición predeterminada; los estados alternativos del catálogo no se infieren de esta variante.

La pill de Ventas brutas usa `sales.pillVariant` (`Green`, `Red`, `No Change`), con metadatos en `src/domain/mobile-sales.ts` y renderizado en `MobileSalesPill`. La fuente es el component set `107:5304`, referenciado por el nodo `683:11946`, consultado el 26 de octubre de 2026. Las sesiones anteriores sin este campo mantienen la pill verde. `sales.change` conserva el porcentaje de referencia: la presentación neutral muestra 0% sin sobrescribirlo. La dirección también está disponible como texto para lectores de pantalla y las flechas SVG locales mantienen sus dimensiones originales.

Por indicación de la usuaria, los importes largos de las dos métricas pasan individualmente de 18/22 a Body/S semibold 14/18. `MobileSectionPreview` deriva `data-long-value` desde la longitud del texto formateado (umbral conservador local de 15 caracteres para los formatos de miles de millones de aproximadamente 15–18 caracteres); no modifica cifras, moneda ni datos persistidos. La grilla estira ambos elementos a la misma altura, con mínimo de 112 px cuando hay un importe largo y crecimiento libre por contenido. Esta variante usa 12 px de padding horizontal en ambas cards, dando 132 px de ancho útil para que «R$ 123.400.000.000» quepa completo a 14 px. La acción de dinero agrupa el sufijo de moneda e importe para que pueda pasar junto a la segunda línea sin recortar texto. Las clases y atributos quedan en la exportación estática. El umbral, el padding y la altura mínima son decisiones de presentación de este prototipo, no reglas de negocio inferidas de Figma.

`MobileSectionDrafts.informativeSlot` conserva el complemento inferior del Panel de control, `controlPanelTopInformativeSlot` guarda el slot dentro de la card de reputación (conserva la clave del antiguo slot superior para restaurar su contenido) y `pendingTasksInformativeSlot` guarda el de Tareas pendientes. `controlPanelAboveInformativeSlot` representa el espacio superior exterior. Los cuatro tienen borradores separados de tipo `MobileInformativeSlot` en `src/domain/mobile-informative-slot.ts`. `createMobileSectionDrafts` crea los cuatro con `enabled: false` para las sesiones nuevas. Los borradores existentes mantienen sus toggles guardados, y las claves ausentes en sesiones anteriores conservan sus valores implícitos originales. `getMobileSectionInformativeSlot` mantiene compatibilidad con las sesiones previas: no modifica el slot inferior del Panel y, si falta el de reputación o el de tareas, devuelve un nuevo slot rosado visible (`enabled: true`, `configured: false`). La grilla continúa teniendo exactamente seis elementos. No se añade a `ControlPanelSection`, al conteo de slots de cards ni al catálogo de secciones agrupadoras. `MobileInformativeSlot` no renderiza nada con `enabled: false`; con el toggle activo renderiza el placeholder rosado si `configured: false`, o el bloque configurado si `configured: true`, dentro de la card de reputación después de su descripción, o como hermano DOM después de las métricas del Panel o de la grilla de Tareas pendientes. `MobileSectionPreview.reputationSlot` y `MobileReputationPanel.slot` reciben el contenido como `ReactNode`, sin cambiar las variantes de reputación. La ubicación interior sigue el nodo `687:12911`, consultado el 26 de octubre de 2026: 288 × 60 px para el placeholder dentro de una card de 320 px con padding de 16 px y gap de 8 px. El ícono se descarga sin modificar como `reputation-slot-icon.svg`; el contenido construido usa el fondo y contenedor de la card padre, sin otra sombra ni padding exterior. El selector nativo `#mobile-section-kind` reemplaza las dos opciones grandes por un dropdown con Panel de control y Tareas pendientes. Debajo se filtran las filas con `slotSection(target) === kind`: Superior, Medio y Dentro de reputación en el Panel; Inferior en Tareas pendientes. Cada fila contiene únicamente el nombre de la ubicación y su toggle On/Off; se retiraron la descripción y el botón Editar de cada fila. El espacio rosado y los slots construidos mantienen el acceso al contenido desde la vista previa. Se retiraron del panel izquierdo el título Construcción, la selección visual Slot rosado/Card informativa y su botón de construcción. Las descripciones se conservan solo en el inspector del slot seleccionado. Cambiar la selección conserva los estados y contenidos de los slots ocultos. Cada fila activa su propia clave y el editor abre la sección correspondiente. La construcción se edita en el inspector, sin opciones de construcción debajo de las filas. El selector «Elemento a editar» ofrece solo Reputación, Ventas brutas y Tu dinero en el Panel, o los seis elementos de Tareas pendientes; se retiraron todas las opciones de slots y los grupos Fuera de la sección. Cuando se edita un slot, ese selector usa el placeholder para permitir cambiar a un elemento de la sección. Los slots construidos tienen un botón transparente accesible sobre su preview (`mobile-section-complement__edit-target`), que abre el inspector del destino correcto mediante clic o teclado y se excluye del HTML con `data-builder-only`. Todos conservan borradores y construcción separados. La vista conjunta también muestra el complemento de tareas; pulsarlo selecciona esa sección y abre su inspector. El placeholder sigue el nodo `687:12910` de Figma, consultado el 26 de octubre de 2026 (112 px, textura de 8 × 8 px e ícono de 16 px rotado 90°); la anatomía del contenido configurado sigue la captura de estado de cuenta compartida por la usuaria, con los textos genéricos editables Título, Informativo y Text link/Text description solicitados posteriormente. `MobileStatusIcon` reutiliza los SVG de reputación para los estados verde, naranja y rojo. La opción `none` («No aplica · Sin ícono») omite el indicador por completo y se conserva en la sesión y la exportación; no se agrega escala al bloque complementario.

El toggle accesible (checkbox con `role="switch"`) controla únicamente `enabled`. Configurar el slot activa `configured`; apagarlo conserva ese estado y todos sus textos. En sesiones anteriores sin `configured`, `enabled: true` se interpreta como contenido ya configurado, conservando la vista existente. Las sesiones anteriores sin `informativeSlot` lo presentan desactivado; su normalización recupera campos inválidos sin modificar los borradores de las secciones. Desactivarlo conserva el contenido; reiniciar una sección conserva los borradores de sus slots. El inspector nombra los campos como Título (`label`), Informativo (`title`) y Text link o Text description (`description`), según el tipo elegido. Estos nombres conservan las claves de datos existentes. La normalización sustituye el antiguo ejemplo de estado de cuenta solo si sus tres textos coinciden íntegramente; preserva contenido personalizado, el estado del toggle y la configuración. Al cambiar el tipo, solo la bajada genérica se adapta entre Text link y Text description; una bajada personalizada se conserva. La bajada admite texto o enlace. Solo se generan anchors para URLs HTTP(S) válidas; sin destino es una referencia visual y una URL no vacía inválida impide la descarga. Los nodos `data-builder-only` (placeholder y contexto de tareas) se eliminan del HTML exportado, que mantiene el contenido configurado en su ubicación correspondiente, incluida la card de reputación. El CSS se exporta procesado y los recursos quedan incorporados, sin URLs temporales de Figma.

El campo `informativeSlot.construction` distingue `free-slot` e `informative-card`. Los borradores anteriores con contenido configurado conservan `informative-card`; un espacio sin configurar inicia en `free-slot`. La selección y ambos borradores persisten: los textos de la card siguen en sus campos existentes, y `freeDraft` guarda el estado del constructor libre. `MobileFreeSlotBuilder` adapta el editor existente de `ReputationDemoPage` mediante una composición con render prop tipada en `mobile-free-slot.ts`. Se reutiliza el mismo JSX del inspector (`slotEditor`), patrones, renderizadores, importación de imágenes y generación de Mi idea. El modo embebido normaliza su estado con el mismo lector de sesiones, fuerza un solo slot, omite el contenedor general/header/footer y notifica cambios a la sesión mobile; no lee ni escribe el borrador independiente de cards. La generación aporta únicamente el contenido del primer slot de la propuesta. `MobileSectionBuilder` combina preview e inspector y añade a la exportación los estilos de contenido existentes. Solo la construcción activa y visible se exporta; el placeholder y los controles permanecen excluidos.

Se mantienen cuatro instancias de `MobileFreeSlotBuilder`, una por complemento, para conservar sus borradores sin intercambiarlos al cambiar de sección ni duplicar el inspector visible. Sus callbacks guardan en una clave de complemento explícita. `MobileInformativeSlotTarget` conserva `control-panel-top` para el slot ahora integrado en reputación, y añade `control-panel-above` para el nuevo espacio superior exterior, distinguiéndolos de los destinos medio e inferior sin agregarlo al catálogo de secciones ni alterar `session.kind`. `sessionRef` conserva la sesión más reciente para combinar los guardados de las cuatro instancias dentro de un mismo batch de React y evitar que un callback sobrescriba el borrador de otra. La validación y descarga se limitan a la sección seleccionada y a todos sus complementos visibles (superior, interior de reputación y medio en el Panel); los complementos vacíos y el contexto de la otra sección se excluyen mediante `data-builder-only`.

`MobileSectionBuilder` contiene el inspector y la sesión; `MobileSectionPreview` renderiza únicamente la sección, sin el contenedor general de card. Sus borradores usan la clave estable `summary-builder-mobile-sections-v1`, separados de la sesión de cards. El contenido de sesión está en versión 3; la migración desde versión 1 actualiza solo las tareas que coinciden íntegramente con los antiguos ejemplos, preservando ediciones y el Panel de control. Superior admite únicamente construcción libre. Una Card informativa guardada en cualquier versión se representa como placeholder rosado, conservando sus campos y `freeDraft` sin activarlos ni exportarlos. `superiorNeedsConstruction` excluye esos borradores antiguos de la validación y preview; al pulsar el placeholder o Construir se guarda `construction: free-slot` y se abre el motor existente. No se ofrece Card informativa en esa ubicación; los borradores existentes de las demás ubicaciones conservan su contenido en el inspector. Esta regla se aplica en cada render y recarga, sin depender de una migración puntual del texto genérico. Cambiar dispositivo o tipo de elemento conserva ambos. La exportación `scope: mobile-section` produce una revisión mobile independiente del recorrido de cards por el template desktop. Esta distinción corresponde a la arquitectura del prototipo; no modifica ni declara nuevos contratos productivos.

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

Los estilos de títulos e importes del Panel usan selectores directos sobre sus elementos y suficiente especificidad para conservar `rgba(0, 0, 0, 0.9)` frente al tema oscuro del Builder. No se aplica la tipografía de esos títulos a todo el contenido descendiente de un slot, para respetar los patrones construidos dentro de reputación.

En los slots complementarios mobile, `ReputationDemoPage` en modo `slotOnly` ofrece únicamente Figma y Mi idea, en dos columnas iguales. `createFreeSlotConfig` inicia los slots vacíos con `source: figma`, desactivados hasta incorporar una imagen: pulsar el placeholder no inserta Reputación ni otro contenido de ejemplo. Un borrador anterior de Librería con contenido habilitado conserva sus campos y patrón como `source: prompt`, `usesLibraryVariant: true` y `promptApplied: true`; un borrador vacío abre Figma. Las cards generales conservan sus tres fuentes. El cambio entre Figma y Mi idea mantiene la imagen ya incorporada al volver a Figma.
