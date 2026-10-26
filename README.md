# Summary Builder Site

Prototipo local y evolutivo para definir la arquitectura de información de Summary Builder antes de cerrar su lenguaje visual.

## Qué incluye el prototipo

- Pantalla inicial “¿Qué necesitas?” con acceso a Builder y Librería; el nombre “Summary Builder” en la cabecera vuelve a ese inicio.
- Navegación principal en dos tabs: Builder y Librería.
- Desde el inicio “¿Qué necesitas?”, la opción Builder, el tab Builder y “+ Crear card” abren directamente el editor. La card comienza vacía o recupera la sesión local guardada. No hay filtro previo ni preguntas iniciales; “Reiniciar demo” vuelve al editor vacío.
- La demo principal permite agregar hasta tres slots: Slot 1 destaca la información principal de la card; Slot 2 aporta información complementaria; Slot 3 reúne recomendaciones contextuales. El acceso principal comienza sin slots; al agregar Reputación desde la Librería, se precargan los tres espacios con contenido de ejemplo. En Librería → Patrón visual se pueden elegir las [13 variantes del set de slots y la card de recomendaciones del MASTER](docs/slot-variants.md). Se puede eliminar un slot desde el control que aparece al pasar el cursor o enfocarlo y volver a agregarlo, sin superar tres.
- Las opciones de contenido de cada slot son una variante de la Librería, un diseño de Figma o una idea escrita como prompt. En el HTML local se puede cargar manualmente una imagen PNG, JPG o WebP del frame para hacer una demo directamente dentro de la card. Cuando el Builder web tenga configurada su integración, cada persona podrá conectar Figma y convertir el enlace de un frame seleccionado en una imagen limpia, sin el lienzo ni los controles de Figma. El slot solo se marca como agregado tras recibir o cargar una imagen válida. Esa imagen se incluye al descargar la card.
- Inspector simplificado para editar tipo, textos, valor y estado. En Valor básico permite elegir 1, 2, 3 o 4 columnas; cada dato tiene valor, etiqueta, tipo de indicador y color editables. El ícono de 16 px ofrece azul (información), verde (positivo), naranja (atención) y rojo (negativo); el punto de 8 px ofrece esos colores y gris, según los componentes de Figma. La vista usa hasta dos columnas por fila. Incluye preview Desktop (270 px) y Mobile (340 px), reinicio de la demo y descarga de un HTML compartible.
- Cuando la card no tiene slots, el Builder separa el recorrido en dos pasos: a la izquierda se agrega la estructura y, al seleccionar ese slot, a la derecha se elige cómo completarlo. Las opciones de contenido son Librería, Figma o **Mi idea**. En **Mi idea**, la persona describe el objetivo y los datos de la card; **Crear mi propuesta** reemplaza el borrador completo con título, slots y acción final. Durante la creación aparece una barra flotante de progreso y, al terminar, el asistente pregunta si la propuesta gusta o si se quiere probar otra idea. **Probar otra idea** conserva la descripción, genera una alternativa y la carga directamente en el canvas. El motor de reglas interpreta métricas, “Mi página”, novedades y pendientes de publicaciones o ventas, usando reglas incorporadas de Summary: conserva la estructura de tareas, distingue urgencia, limita a cuatro tareas visibles y avisa cuando faltan datos o se requiere validar una categoría. Al ejecutarlo con el servicio local, **Mi idea** usa además un modelo de IA instalado en el equipo para explorar composiciones más abiertas, siempre validadas contra las variantes de la Librería Summary. La idea no se envía a proveedores externos; si el modelo no está disponible, el recorrido continúa con las reglas locales.
- La sesión más reciente del Builder se guarda automáticamente en `localStorage` del navegador y se restaura al volver. Es almacenamiento local, separado por la entrada principal o desde la Librería; no sincroniza entre personas, perfiles o dispositivos ni equivale a persistencia con backend.
- El editor previo de slots `Data 1–6` sigue disponible al entrar desde otras cards de la Librería mientras se valida esta demo.
- Exportación de la propuesta visual como HTML autónomo, con selector Desktop/Mobile y sin depender del Builder para abrirse.
- Catálogo navegable de 16 componentes con acción para agregarlos al Builder.
- Ficha de componente con `Guideline` y `Playground`; Pendientes en tus publicaciones agrega una pestaña `Template` con el contexto de composición.
- Playground interactivo con propiedades, edición de contenido, estados, modo oscuro y un canvas de vista previa.
- En Pendientes en tus publicaciones, el Playground ofrece los modos `Estados e interacciones` y `Casos de uso`. Los siete ejemplos por mercado y contexto se consultan desde este último modo, sin una pestaña separada de casos.
- Contratos y anatomía contrastados con componentes productivos de Seller Home: `Card`, `GeneralMetric`, `Speedometer` y la superficie de noticias/comunicaciones.
- Proxima Nova embebida en variantes Light, Regular, Semibold y Bold para toda la interfaz.
- Una vertical inicial de referencia: `Pendientes en tus publicaciones`.
- Datos simulados, sin conexión a servicios productivos.

Los contenidos son fixtures de referencia para probar el flujo; los componentes productivos se usan como fuente de estructura y contrato, no como imports ejecutables en esta aplicación independiente. El prototipo todavía no persiste cards como objetos de producto ni carga variantes reales por país o caso de uso. La apariencia legacy de “Mi idea” es una aproximación local y requiere contraste con la librería oficial vigente.

En Builder, el paso 2 usa el frame `39916:11248` del MASTER de Seller Home como referencia para mostrar el panel superior y las cuatro columnas de cards. Según el contenido de la card, propone y aplica una ubicación con una razón y lo que queda por validar. Incorpora las reglas de ordenamiento de `summary-guidelines`: mantiene las cuatro cards iniciales del ejemplo, ubica tareas junto a las cards de pendientes, prioriza alertas en la primera columna y relaciona las métricas con cards del mismo tema. La persona puede ajustar la ubicación sin desplazar esas cards iniciales. La posición se guarda con la sesión y aparece en la revisión HTML descargable. El MASTER muestra Reputación y Novedades en columnas distintas de las declaradas en el Guideline; la propuesta señala esa diferencia y requiere validación de Summary. La compensación de alturas y el orden efectivo por site no se calculan en esta maqueta. Las demás cards usan las previews locales y datos de ejemplo, por lo que esta vista permite revisar composición sin representar una cuenta real ni escribir en Figma.

La pestaña `Template` de Pendientes en tus publicaciones muestra el contexto desktop completo de cuatro columnas del MASTER · Ajustes (`41215:55158`). La card existente de publicaciones se resalta con un contorno azul y las otras catorce cards quedan atenuadas. La vista permite ajustar el template al ancho disponible o revisarlo al 100% con desplazamiento. La card de referencia conserva los datos y etiquetas de esa instancia de Figma; los estados e interacciones se exploran en Playground. Las cards de contexto reutilizan las previews locales del Builder, con datos de ejemplo.

## Cómo ejecutarlo

### Secciones agrupadoras de mobile

En el editor principal, activa **Mobile** y elige **Tipo de elemento → Sección agrupadora** en el panel izquierdo. El dropdown **Sección a construir** permite elegir **Panel de control** o **Tareas pendientes**. Debajo se muestran únicamente sus toggles: Superior, Medio y Dentro de reputación para el Panel; Inferior para Tareas pendientes. La opción **Card** conserva la construcción por slots.

Esta contribución está disponible en la aplicación ejecutada con `pnpm dev`. Los HTML autocontenidos del repositorio se regenerarán al preparar una versión para compartir.

Las secciones tienen un modelo propio (`MobileSection`), elementos internos, inspector y exportación HTML para mobile. No usan el contenedor, los slots, el CTA general ni la ubicación en el template desktop de una card. Los borradores de las dos secciones se guardan por separado del borrador de card en el mismo navegador; alternar entre ellos no borra el contenido. Volver a Desktop muestra el editor de cards.

Panel de control reproduce [Dashboard de la Librería Summary, nodo `687:12911`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=687-12911): reputación, ventas brutas y dinero. Sus textos, valores y variantes se pueden editar desde el inspector. Tareas pendientes reproduce [Sección tareas mobile con título, nodo `2017:13592`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=2017-13592), dentro de la sección de librería `2012:10318`: título de 16 px, dos filas de tres elementos de aproximadamente 101 × 92 px y los íconos de atención originales. En el Builder, la sección y su grilla ocupan los mismos 320 px que el Panel, tanto en contexto como al editar tareas por separado. Se conservan los 12 px de padding lateral, los 8 px entre columnas y los 10 px entre filas; «Productos Full / por gestionar» ocupa dos líneas sin reducir su tipografía de 12/15. Los estados de carga y error de la librería quedan fuera de esta variante inicial. Los valores iniciales son ejemplos; la elegibilidad, los destinos y las variantes productivas requieren sus contratos.

En **Panel de control → Elemento a editar → Reputación**, el selector **Variante de reputación** ofrece las nueve opciones del componente [_Reputación mobile, nodo `2019:11410`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=2019-11410), usado en el panel `683:12760`: MercadoLíder Platinum, MercadoLíder Gold, MercadoLíder, Verde, Verde claro, Amarillo, Naranja, Rojo y Aún no tienes color. Actualiza etiqueta, ícono y escala conjuntamente. Amarillo y Naranja usan el ícono de precaución naranja; Rojo, el negativo rojo. Aún no tienes color omite ícono y escala. La selección se guarda en el borrador y se incluye en el HTML descargado. El selector sirve para explorar la propuesta; no calcula ni asigna una reputación productiva.

En **Panel de control → Elemento a editar → Ventas brutas**, **Variante de pill** ofrece Positiva (verde), Negativa (roja) y Sin cambios, según [_ Atoms control panel, nodo `107:5304`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=107-5304), usado en `683:11946`. Las dos primeras conservan el porcentaje de referencia y muestran las flechas originales en la dirección correspondiente. Sin cambios muestra 0% sin flecha. Alternar variantes no modifica el valor de ventas, el período ni el porcentaje guardado para las variantes direccionales; la selección se conserva al recargar y al descargar el HTML. No se calculan variaciones desde datos de ventas.

La sesión de secciones acepta borradores de la primera versión basada en capturas y actualiza únicamente las tareas de ejemplo que siguen intactas; conserva las tareas editadas y el borrador del Panel de control.

Los montos largos de Ventas brutas y Tu dinero usan **Body/S semibold, 14/18**, según el ajuste solicitado para mobile. El prototipo activa esta presentación desde 15 caracteres, contando moneda, espacios y separadores, para cubrir los formatos de miles de millones de aproximadamente 15–18 caracteres. Los montos cortos mantienen 18/22. Si cualquiera es largo, ambas cards parten de 112 px de alto, usan 12 px de padding horizontal para admitir prefijos como «R$» y crecen juntas según el contenido. La acción «Adelantar» permite dos líneas y mantiene la moneda junto al importe cuando cabe en el ancho disponible. El HTML descargado conserva esta presentación.

El panel izquierdo muestra en **Slots opcionales** los toggles de la sección elegida en el dropdown. Las cuatro ubicaciones independientes son: **Superior** (antes del Panel de control), **Medio** (entre el Panel y Tareas pendientes), **Inferior** (debajo de Tareas pendientes) y **Dentro de reputación**. En una sesión nueva, los cuatro toggles comienzan apagados. Cada ubicación muestra solo su nombre y toggle On/Off; los borradores existentes conservan sus estados y contenidos guardados. La construcción se abre pulsando el slot en la vista previa, tanto vacío como construido. Activar o editar una ubicación muestra la sección correspondiente; apagarla conserva su borrador. El dropdown **Elemento a editar** muestra solo los elementos internos de la sección; los slots se editan desde la vista previa. El panel izquierdo conserva únicamente los toggles y la vista conjunta; se retiraron las opciones visuales Slot rosado/Card informativa y el botón de construcción. Pulsa el slot rosado para abrir Figma y Mi idea en el inspector. Los borradores de Card informativa existentes se pueden editar pulsándolos en la vista previa. El slot superior comienza apagado; al encenderlo aparece el espacio rosado para construir con Figma o Mi idea. Una Card informativa guardada anteriormente en Superior se presenta como slot rosado hasta empezar a construir; sus campos y el borrador libre alternativo se conservan. Su contenido no se incluye en la descarga mientras solo se muestra el placeholder. El slot de reputación se ubica debajo de «Así te ven tus compradores», dentro del fondo blanco y del padding de 16 px de la card. Sigue el [Dashboard, nodo `687:12911`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=687-12911): placeholder de 288 × 60 px, radio inferior derecho de 24 px e ícono original de 16 px. Reutiliza el borrador anterior con su contenido y toggle. El contenido construido se integra sin añadir una segunda sombra o un marco de card. Los slots exteriores conservan el ancho de 320 px. El espacio rosado sigue la referencia de [Dashboard con Slot informativo, nodo `687:12910`](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=687-12910): 112 px de alto, textura e ícono originales de Figma. Para una Card informativa ya guardada, púlsala en la vista previa para editar **Título**, **Informativo**, ícono verde/naranja/rojo o **No aplica · Sin ícono**, y **Text link** o **Text description**, según el tipo de texto elegido. El contenido inicial usa esos textos genéricos editables; alternar el tipo adapta la bajada genérica y conserva cualquier texto personalizado. Los borradores que aún contienen íntegramente el antiguo ejemplo «Estado de la cuenta / En riesgo / Tienes 1 advertencia activa» se actualizan a los textos genéricos. La anatomía conserva la referencia de la captura compartida y no incluye la escala de reputación. La URL es opcional para la maqueta: sin ella se muestra el texto azul como referencia visual; con una URL HTTP(S) válida, el HTML descargado contiene un enlace funcional.

**Tareas pendientes también tiene su propio slot inferior**, con contenido separado de los dos slots del Panel y de los seis elementos de la grilla. En una sesión nueva comienza apagado; al encenderlo aparece el slot rosado, con las opciones Figma y Mi idea al pulsarlo. Puedes configurarlo desde Tareas pendientes o pulsándolo en la vista conjunta; al pulsarlo, el editor pasa a esa sección. Cada complemento conserva sus textos, tipo de construcción y borrador libre por separado. La descarga de Tareas pendientes incluye únicamente su propio complemento configurado; el contexto de tareas y su slot se siguen omitiendo al descargar el Panel.

Con el toggle activo, pulsa el **Slot rosado** de la vista previa para abrir únicamente Figma y Mi idea en el inspector. La selección de Slot rosado/Card informativa y el botón de construcción se retiraron del panel izquierdo para reducir espacio; las cards informativas ya guardadas conservan sus campos en el inspector. Los slots nuevos comienzan en Figma, sin contenido: activar el toggle y pulsar el placeholder conserva el espacio rosado hasta subir una imagen o crear una propuesta. Los borradores existentes de Librería conservan su patrón y datos dentro de Mi idea, sin mostrar una opción Librería. El slot libre admite imágenes de Figma cargadas manualmente (PNG/JPG/WebP, máximo 2 MB) o importadas mediante la conexión OAuth configurada, y una propuesta editable generada con el motor existente de Mi idea. La propuesta ocupa un único slot independiente: no agrega header, footer ni slots adicionales a la sección. La importación automática de Figma requiere la misma configuración del servicio que el editor de cards. Los borradores existentes se conservan; el HTML descargado incluye únicamente el contenido activo.

**Ver junto a Tareas pendientes** permite revisar la ubicación del bloque entre ambas secciones; esas tareas se usan solo como contexto y no entran en la descarga del Panel. El HTML incluye el bloque informativo únicamente cuando está habilitado y completo; omite el espacio rosado vacío. Apagar el toggle de una ubicación conserva sus textos y su estado de configuración para retomarlos al encenderlo. Su visibilidad y contenido se guardan localmente; los borradores anteriores que ya tenían contenido activo lo conservan configurado. El borrador es se conserva al reiniciar el Panel de control. Esta composición es una propuesta del prototipo y no define elegibilidad ni estados productivos.

Pendiente de diseño: el texto azul `#3483fa` de la acción del indicador de dinero y del enlace complementario, a 12 px sobre blanco, conserva el color de Figma pero no alcanza contraste AA (3,63:1). La revisión automática también deja comprobaciones de contraste manual sobre los fondos con gradiente. La maqueta no certifica accesibilidad completa.

### Abrir sin instalar ni ejecutar nada

Abre `summary-builder.html` con doble clic desde Finder. Es una versión autocontenida y no necesita servidor local.

Para probar **Mi idea**: entra a **Builder → Agregar primer slot → Mi idea**, describe una métrica, “Mi página”, una novedad o una tarea de publicaciones o ventas y pulsa **Crear mi propuesta**. El campo empieza vacío y explica qué información incluir; no recupera el último prompt escrito. La card se verá dentro de la vista previa; selecciona cada bloque para editarlo. Al terminar, el asistente flotante te permite elegir entre **Me gusta** o **Probar otra idea**; la segunda opción vuelve a un campo vacío con esa misma guía. El archivo HTML funciona sin servidor: su motor local no envía los textos a ningún proveedor. Si más adelante se requiere una IA que interprete pedidos completamente abiertos, se puede instalar un modelo local en este mismo equipo sin cambiar el flujo del Builder.

Esta versión sirve para revisar y compartir una card. Para probar Figma sin servidor, selecciona un slot, elige **Figma**, exporta el frame deseado como PNG (o usa JPG/WebP), selecciona el archivo en **Demo en este HTML** y pulsa **Agregar imagen a la card**. El enlace de Figma es opcional y solo sirve para abrir el diseño original. La imagen cargada permanece en el HTML de la card que descargues; no se actualiza automáticamente desde Figma. El archivo debe pesar como máximo 2 MB.

Esta copia no puede convertir por sí sola enlaces privados de Figma en imágenes nuevas: eso requiere alojar el Builder como aplicación web y configurar una conexión segura con Figma para respetar los permisos de cada persona.

Una dirección que empieza por `file:///Users/...` abre un archivo de esta computadora: no es una URL web ni tiene un servidor. La publicación actual en Grid también aloja el HTML autocontenido, no el servicio de conexión con Figma. Para que el equipo pueda pegar enlaces y ver imágenes dentro de la card, hace falta una URL `https://...` de una aplicación web que ejecute `server.mjs`.

Flujo acordado para el equipo: conservar Grid como entrada y abrir el Builder conectado en otra pestaña. No reemplazar el HTML actual de Grid por un enlace hasta que exista y se haya probado la URL de la aplicación web.

La versión compartida también está [publicada en Grid](https://grid.adminml.com/d/01M46W63MKRRTKQ0S2VCEHMHKE/view). El [registro de publicación](docs/grid-publication.md) guarda el ID para subir las próximas versiones al mismo documento.

## Tema visual

La interfaz usa el dark theme de Seller Assistant Studio mediante los tokens incluidos en `src/styles/sa-dark-theme.css`. El chrome del constructor —navegación, biblioteca, fichas y controles— es oscuro; las previews de los componentes conservan superficies claras para representar fielmente el contexto de producto.

### Trabajar sobre el código

```bash
pnpm install
pnpm dev
```

Para validar la compilación:

```bash
pnpm build
```

### Activar previews de Figma para todas las personas

El proyecto incluye el servicio `server.mjs`. Antes de usarlo, registra una aplicación OAuth en Figma con el permiso `file_content:read` y la URL de retorno del Builder. Si la usarán solo personas de un equipo u organización de Figma, puede ser **privada**. Si debe funcionar para cualquier persona con una cuenta de Figma, debe ser **pública** y Figma tiene que aprobarla. Copia [`.env.example`](.env.example) como `.env`, completa los tres valores de Figma y ejecuta:

```bash
npm run start
```

Una vez configurada y alojada la aplicación web, la persona conectará su cuenta de Figma y podrá pegar la URL de un frame o componente al que tenga acceso. Al pulsar “Agregar diseño a la card”, la imagen aparecerá dentro del slot; si Figma no entrega la imagen, se mostrará el motivo y el slot seguirá vacío. Los secretos y tokens permanecen en el servicio; nunca se incluyen en el HTML descargable.

### Usar IA local en “Mi idea”

La versión web local usa Ollama cuando está instalado y tiene disponible el modelo definido en `.env` (por defecto `qwen2.5:3b`). Inicia el servicio y el Builder con:

```bash
ollama serve
npm run serve
```

La aplicación comprueba el modelo antes de usarlo. Si no está disponible, sigue generando propuestas con las reglas locales. Las propuestas de tareas continúan usando su estructura fija y no pasan por el modelo.

## Criterio de construcción

El filtro inicial y el inicio guiado son una primera prueba de UX: las preguntas orientativas no deciden automáticamente si una card es apropiada, y los datos de ejemplo son ilustrativos. El recorrido entrega una card editable con un boceto en el primer slot y el segundo libre. No valida automáticamente las reglas de Summary o Andes X. La persona puede omitir las preguntas o abrir el editor desde cero.

El Builder principal sigue siendo una demo: la persona crea una card desde la instancia vacía, trabaja con un máximo de tres slots y elige una variante prehecha, un frame de Figma o una idea por prompt. La opción Figma permite cargar manualmente una imagen para la demo en el HTML local; en el Builder web publicado, la conexión OAuth individual podrá transformar el enlace del frame seleccionado en una imagen limpia. El HTML de la card descargada conserva la imagen incorporada, pero no puede solicitar una conexión nueva. La opción Librería → Patrón visual contiene los 13 tipos de contenido del [frame `.Slot variants` en Figma](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=130-67697), más la card de recomendaciones del [MASTER de Seller Home](https://www.figma.com/design/KTkkBUm9YLJSPmLpPQoEoR/%E2%9A%A1%EF%B8%8FMASTER---Seller-Home---Summary?node-id=19878-179678); `_Slot` corresponde al estado vacío de la card. Las vistas usan medidas, contenido y recursos de esos frames, con iconos locales en las miniaturas de producto cuyo archivo no entrega Figma mediante Code Connect. “Mi idea” arma una card completa con reglas locales para métricas, comunidad, novedades y pendientes; el inicio guiado conserva sus bocetos exploratorios por slot. La Librería mantiene catálogo, guías y casos de uso dentro del Playground de publicaciones. La adaptación y validación por país/caso, así como la inclusión posterior de la card en un template, son etapas futuras. El catálogo inicial contiene las 16 cards confirmadas por la usuaria.

La arquitectura detallada está en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
