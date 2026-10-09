# Summary Builder Site

Prototipo local y evolutivo para definir la arquitectura de información de Summary Builder antes de cerrar su lenguaje visual.

## Qué incluye el prototipo

- Pantalla inicial “¿Qué necesitas?” con acceso a Builder y Librería; el nombre “Summary Builder” en la cabecera vuelve a ese inicio.
- Navegación principal en dos tabs: Builder y Librería.
- El acceso principal a Builder abre con un filtro breve: proponer una card nueva, revisar las existentes en Librería o consultar preguntas orientativas cuando aún no está claro si corresponde una card. Después ofrece tres preguntas opcionales sobre tipo de contenido, información principal y acción. Las opciones son genéricas: dato o métrica, tendencia o gráfico, monto, lista, novedad u otra idea. La segunda pregunta pide el tema concreto y los datos pertinentes; una vista previa se actualiza al responder. “Crear desde cero” y la propuesta guiada pasan al editor con título, tres slots y footer editables.
- La demo principal presenta tres slots desde el inicio: Slot 1 destaca la información principal de la card; Slot 2 aporta información complementaria; Slot 3 reúne recomendaciones contextuales. Inicia con Slot 1 en Reputation y Slot 2 en Value basic; el tercero espera contenido. En Librería → Patrón visual se pueden elegir las [13 variantes del set de slots y la card de recomendaciones del MASTER](docs/slot-variants.md). Se puede eliminar un slot desde el control que aparece al pasar el cursor o enfocarlo y volver a agregarlo, sin superar tres.
- Las opciones de contenido de cada slot son una variante de la Librería, un diseño de Figma o una idea escrita como prompt. En el HTML local se puede cargar manualmente una imagen PNG, JPG o WebP del frame para hacer una demo directamente dentro de la card. Cuando el Builder web tenga configurada su integración, cada persona podrá conectar Figma y convertir el enlace de un frame seleccionado en una imagen limpia, sin el lienzo ni los controles de Figma. El slot solo se marca como agregado tras recibir o cargar una imagen válida. Esa imagen se incluye al descargar la card.
- Inspector simplificado para editar tipo, textos, valor y estado. En Valor básico permite elegir 1, 2, 3 o 4 columnas; cada dato tiene valor, etiqueta, tipo de indicador y color editables. El ícono de 16 px ofrece azul (información), verde (positivo), naranja (atención) y rojo (negativo); el punto de 8 px ofrece esos colores y gris, según los componentes de Figma. La vista usa hasta dos columnas por fila. Incluye preview Desktop (270 px) y Mobile (340 px), reinicio de la demo y descarga de un HTML compartible.
- Cuando la card no tiene slots, el Builder separa el recorrido en dos pasos: a la izquierda se agrega la estructura y, al seleccionar ese slot, a la derecha se elige cómo completarlo. Las opciones de contenido son Librería, Figma o **Mi idea**. En **Mi idea**, la persona describe el objetivo y los datos de la card; **Crear mi propuesta** reemplaza el borrador completo con título, slots y acción final. Durante la creación aparece una barra flotante de progreso y, al terminar, el asistente pregunta si la propuesta gusta o si se quiere probar otra idea. **Probar otra idea** conserva la descripción, genera una alternativa y la carga directamente en el canvas. La demo interpreta localmente “Mi página” y métricas, usa solo las cifras del prompt y marca los datos faltantes para editarlos. No hay IA conectada ni validación oficial de reglas de Summary o Andes X.
- La sesión más reciente del Builder se guarda automáticamente en `localStorage` del navegador y se restaura al volver. Es almacenamiento local, separado por la entrada principal o desde la Librería; no sincroniza entre personas, perfiles o dispositivos ni equivale a persistencia con backend.
- El editor previo de slots `Data 1–6` sigue disponible al entrar desde otras cards de la Librería mientras se valida esta demo.
- Exportación de la propuesta visual como HTML autónomo, con selector Desktop/Mobile y sin depender del Builder para abrirse.
- Catálogo navegable de 16 componentes con acción para agregarlos al Builder.
- Ficha de componente con `Guideline`, `Playground` y `Casos de uso`; Pendientes en tus publicaciones agrega una pestaña `Template` con el primer contexto de composición.
- Playground interactivo con propiedades, edición de contenido, estados, modo oscuro y un canvas de vista previa.
- Contratos y anatomía contrastados con componentes productivos de Seller Home: `Card`, `GeneralMetric`, `Speedometer` y la superficie de noticias/comunicaciones.
- Proxima Nova embebida en variantes Light, Regular, Semibold y Bold para toda la interfaz.
- Una vertical inicial de referencia: `Pendientes en tus publicaciones`.
- Datos simulados, sin conexión a servicios productivos.

Los contenidos son fixtures de referencia para probar el flujo; los componentes productivos se usan como fuente de estructura y contrato, no como imports ejecutables en esta aplicación independiente. El prototipo todavía no persiste cards como objetos de producto ni carga variantes reales por país o caso de uso. La apariencia legacy de “Mi idea” es una aproximación local y requiere contraste con la librería oficial vigente.

En Builder, el paso 2 usa el frame `39916:11248` del MASTER de Seller Home como referencia para mostrar el panel superior y las cuatro columnas de cards. La card creada se inserta en la columna y después de la card que elija la persona; su ubicación se guarda con la sesión y aparece también en la revisión HTML descargable. Las demás cards usan las previews locales y datos de ejemplo, por lo que esta vista permite revisar composición sin representar una cuenta real ni escribir en Figma.

La pestaña `Template` de Pendientes en tus publicaciones muestra las dos primeras cards estáticas del orden Desktop en Layout API: pendientes de publicaciones y pendientes de ventas. La composición se presenta para MCO y vista All; los datos son fixtures documentados, no información actual de una cuenta. El control Mobile adapta la maqueta para revisión, sin afirmar que sea la regla productiva de orden para Mobile.

## Cómo ejecutarlo

### Abrir sin instalar ni ejecutar nada

Abre `summary-builder.html` con doble clic desde Finder. Es una versión autocontenida y no necesita servidor local.

Para probar **Mi idea**: entra a **Builder → Crear desde cero → Agregar primer slot → Mi idea**, describe una card de “Mi página” o una métrica y pulsa **Crear mi propuesta**. El campo empieza vacío y explica qué información incluir; no recupera el último prompt escrito. La card se verá dentro de la vista previa; selecciona cada bloque para editarlo. Al terminar, el asistente flotante te permite elegir entre **Me gusta** o **Probar otra idea**; la segunda opción vuelve a un campo vacío con esa misma guía. Los prompts de tareas no se generan todavía, porque requieren una estructura específica del Guideline. El archivo HTML funciona sin servidor para esta demo local; generar ideas nuevas con IA real requeriría un servicio seguro.

Esta versión sirve para revisar y compartir una card. Para probar Figma sin servidor, selecciona un slot, elige **Figma**, exporta el frame deseado como PNG (o usa JPG/WebP), selecciona el archivo en **Demo en este HTML** y pulsa **Agregar imagen a la card**. El enlace de Figma es opcional y solo sirve para abrir el diseño original. La imagen cargada permanece en el HTML de la card que descargues; no se actualiza automáticamente desde Figma. El archivo debe pesar como máximo 2 MB.

Esta copia no puede convertir por sí sola enlaces privados de Figma en imágenes nuevas: eso requiere alojar el Builder como aplicación web y configurar una conexión segura con Figma para respetar los permisos de cada persona.

Una dirección que empieza por `file:///Users/...` abre un archivo de esta computadora: no es una URL web ni tiene un servidor. La publicación actual en Grid también aloja el HTML autocontenido, no el servicio de conexión con Figma. Para que el equipo pueda pegar enlaces y ver imágenes dentro de la card, hace falta una URL `https://...` de una aplicación web que ejecute `server.mjs`.

Flujo acordado para el equipo: conservar Grid como entrada y abrir el Builder conectado en otra pestaña. No reemplazar el HTML actual de Grid por un enlace hasta que exista y se haya probado la URL de la aplicación web.

La primera versión privada también está [publicada en Grid](https://grid.adminml.com/d/01M46W63MKRRTKQ0S2VCEHMHKE/view). El [registro de publicación](docs/grid-publication.md) guarda el ID para subir las próximas versiones al mismo documento.

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

## Criterio de construcción

El filtro inicial y el inicio guiado son una primera prueba de UX: las preguntas orientativas no deciden automáticamente si una card es apropiada, y los datos de ejemplo son ilustrativos. El recorrido entrega una card editable con un boceto en el primer slot y el segundo libre. No valida automáticamente las reglas de Summary o Andes X. La persona puede omitir las preguntas o abrir el editor desde cero.

El Builder principal sigue siendo una demo: la persona crea una card desde la instancia vacía, trabaja con un máximo de tres slots y elige una variante prehecha, un frame de Figma o una idea por prompt. La opción Figma permite cargar manualmente una imagen para la demo en el HTML local; en el Builder web publicado, la conexión OAuth individual podrá transformar el enlace del frame seleccionado en una imagen limpia. El HTML de la card descargada conserva la imagen incorporada, pero no puede solicitar una conexión nueva. La opción Librería → Patrón visual contiene los 13 tipos de contenido del [frame `.Slot variants` en Figma](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=130-67697), más la card de recomendaciones del [MASTER de Seller Home](https://www.figma.com/design/KTkkBUm9YLJSPmLpPQoEoR/%E2%9A%A1%EF%B8%8FMASTER---Seller-Home---Summary?node-id=19878-179678); `_Slot` corresponde al estado vacío de la card. Las vistas usan medidas, contenido y recursos de esos frames, con iconos locales en las miniaturas de producto cuyo archivo no entrega Figma mediante Code Connect. “Mi idea” arma una card completa para los dos casos cubiertos por esta prueba; el inicio guiado conserva sus bocetos exploratorios por slot. La Librería mantiene catálogo, guías y casos de uso. La adaptación y validación por país/caso, así como la inclusión posterior de la card en un template, son etapas futuras. El catálogo inicial contiene las 16 cards confirmadas por la usuaria.

La arquitectura detallada está en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
