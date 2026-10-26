# Pendientes en tus publicaciones

La ficha de Librería se organiza en las pestañas `Guideline`, `Playground` y `Template`. Los casos de uso se consultan como un modo dentro del Playground.

## Fuentes

- Anatomía del Guideline: [MASTER · Ajustes, nodo `41965:303239`](https://www.figma.com/design/uWP6X6YhgX2lzgOBwyiguO/MASTER---Ajustes?node-id=41965-303239), validado el 26 de octubre de 2026. Esta referencia reemplaza el ejemplo desplegado de la sección Anatomía.
- Figma: archivo `W7DL83AHDlsqgtnx4CRNEA`, nodo `51:782` (`Card-preventa`).
- Casos de uso en Figma: sección `51:326` (`Relevamiento de cards`).
- Guideline: deck `BSUH1sZK90X2XWchsJlQ4H`, slides 9 a 13.
- Referente de estructura: Grid `01KSQWV81YKSYQWQ4RXVXY47K4` (`Widgets Fintech`, versión 42).
- Frontend: `sso-seller-home-frontend/app/shared/cards/tasks-card/index.tsx` y `index.scss`.
- Proveedor: `fury_sso-seller-home-task-provider`.
- ID productivo: `pending_pre_sales_task_card`.

## Anatomía validada

La anatomía del Guideline reproduce el nodo `41965:303239`: contenedor de 269 px, título y cinco subcards plegadas de 237,5 px. Usa 16 px de padding, 16 px entre título y contenido, 8 px entre secciones, fondo `#f5f5f5` y radio de 6 px. Preguntas no lleva “Ver más”; las otras cuatro secciones sí. El chevron navega y el control de detalle expande únicamente las tareas de su sección.

La leyenda identifica título de la card, título de sección, indicador de atención, acceso, totalizador, descripción y desglose de tareas. Los valores y dots de esta instancia son ejemplos visuales, no condiciones universales de negocio. El Playground usa los mismos totales iniciales de la anatomía y tareas ilustrativas para probar las interacciones.

| ID | Título | Valor de muestra | Descripción | Indicador | Acción |
| --- | --- | --- | --- | --- | --- |
| `question_task_card` | Preguntas | 15 | Por responder | Rojo | Navegación en el encabezado |
| `publication_task_card` | Publicaciones | 19 | Por mejorar | Rojo | Navegación y tareas desplegables |
| `full_task_card` | Productos Full | 4 | Por gestionar | Rojo | Navegación y tareas desplegables |
| `pricing_automation_task_card` | Precios | 10 | Por gestionar | Rojo | Navegación y tareas desplegables |
| `advertising_task_card` | Publicidad | 32 | Sugerencias | Rojo | Navegación y tareas desplegables |

## Guideline de contenido

Las slides 9 a 13 del deck de guideline son la fuente específica para esta card:

- `Pendientes en tus publicaciones` reúne tareas sobre el estado de publicaciones o problemas por resolver.
- Se pueden agregar tareas y categorías, pero no alterar la estructura base de la card.
- Las tareas deben ser claras y concisas: máximo 48 caracteres y dos líneas.
- Solo se muestran las tareas priorizadas, con un máximo de cuatro visibles por categoría.
- Cada tarea debe tener un destino claro donde el seller pueda resolverla.
- El nombre de una categoría admite hasta 32 caracteres y dos líneas.
- Una tarea urgente requiere resolución el mismo día y puede afectar reputación o satisfacción del cliente.
- Una tarea no urgente puede resolverse dentro del flujo diario normal.

## Reglas tomadas del frontend

- El punto rojo aparece cuando el badge del resumen tiene color rojo.
- El encabezado navega cuando el grupo incluye una llamada a la acción.
- Un valor de resumen igual a `0` activa el estado vacío del grupo.
- Las tareas con badge gris permanecen plegadas hasta usar Ver más.
- Si falla un proveedor, la subcard muestra el fallback con la acción Reintentar.
- En mobile o webview se usa la descripción del resumen como título y se oculta la descripción bajo la métrica.

## Comportamiento replicado en el Playground

- Cada grupo mantiene su propio estado expandido; abrir uno no altera los demás.
- La vista inicial muestra las cinco secciones plegadas con los totales 15, 19, 4, 10 y 32. Preguntas navega desde el encabezado y no ofrece desglose.
- `Ver más` despliega las tareas de una sección y cambia a `Ver menos`; la expansión no altera las demás secciones.
- El estado sin pendientes se prueba por grupo: muestra un badge discreto con `0` y oculta métrica, descripción y tareas.
- El error también se prueba por grupo y usa el fallback productivo `No pudimos mostrar estos datos.` con la acción `Reintentar`.
- El encabezado conserva su navegación independiente de la expansión del contenido.

El Playground permite alternar entre **Estados e interacciones** y **Casos de uso**. En el primer modo, los toggles permiten explorar la urgencia de la card completa y, por sección, el detalle, cero pendientes y error local. «Tiene tareas urgentes» cambia los datos de muestra de toda la card: al desactivarlo desaparecen todos los puntos rojos y las tareas del desglose usan indicadores grises. También se pueden activar encabezados, tareas, expansión y reintento directamente sobre la vista previa. «Restablecer ejemplo» devuelve la composición de la anatomía. Los textos y cantidades de las tareas desplegables son ejemplos del prototipo. «No disponible» y «Cargando» no aplican a este componente.

Al desactivar «Tiene tareas urgentes», los totales permanecen visibles. Es distinto de activar «Sin pendientes» en una sección.

En el modo **Casos de uso** del Playground, el selector «Mercado y contexto» muestra las siete composiciones ya relevadas: MLB, CBT T1/T3/T6, CBT M4, CBT M6 y tres casos de onboarding. CBT se trata como contexto transfronterizo y onboarding como etapa, no como países. Los accesos informan el destino simulado.

## Casos de uso relevados

Los ejemplos se consultan desde `Playground → Casos de uso`, eligiendo una composición en el selector «Mercado y contexto». El contenido se reconstruye con componentes locales; no depende de capturas ni de assets temporales de Figma.

| Grupo | Ejemplo | Alcance representado |
| --- | --- | --- |
| MLB | Venta local | Versión en portugués con Preguntas, Anúncios, Preços y Publicidade. |
| CBT | T1, T3 y T6 | Pendientes básicos de Listings y Orders en una composición paralela. |
| CBT | M4 | Pendientes con mayor densidad y convivencia con la card My page. |
| CBT | M6 | Categorías desplegadas con tareas y pills en inglés. |
| Onboarding | Acceso bloqueado | Explica que la activación y configuración de la cuenta es un prerrequisito. |
| Onboarding | Desafío 1 | Recomienda crear la primera publicación. |
| Onboarding | Desafío 2 | Combina pendientes existentes con una recomendación contextual para mejorar fotos. |

El segundo encabezado `CBT (M4)` que aparece duplicado en la sección de Figma se interpreta como `CBT M6` siguiendo la lista confirmada por la usuaria.

## Controles de exploración

El selector permite elegir Preguntas, Publicaciones, Productos Full, Precios o Publicidad. «Mostrar detalle» está deshabilitado para Preguntas, que no tiene desglose, y cuando la sección seleccionada está vacía o en error. Cada sección conserva su expansión al cambiar la selección. «Sin pendientes» y «Error al cargar» afectan solo a la sección elegida y son excluyentes. «Reintentar» recupera únicamente la sección con error.

La vista inicial del Playground muestra todas las secciones sin opacidad. Al elegir o modificar una sección, esta recibe un contorno azul y las demás bajan de opacidad para indicar dónde actúan los controles. Al interactuar con otra sección, el foco visual y el selector pasan a ella. «Restablecer ejemplo» quita el foco y devuelve todas las secciones a su apariencia normal. Este tratamiento es exclusivo del Playground y no forma parte de la card de producto ni de los casos de uso.

Los toggles modifican datos y estados del ejemplo; la card deriva dot y pill de esos valores:

- El dot aparece si `summary.badge.color` es rojo y la subcard no está vacía ni en fallback.
- El pill del header aparece únicamente en estado vacío, con el valor `0`, color gris y jerarquía quiet.
- Los pills de las tareas aparecen siempre que el ítem incluya `badge`.
- El fallback no muestra dot, pill ni chevron.
- El header productivo usa una fila con `padding: 12px 16px`.
- Los divisores entre métrica, tareas y footer ocupan el ancho completo de 237.5 px de la subcard; ningún divisor se ajusta al ancho del texto de la acción.

## Template en contexto

La pestaña `Template` usa el [MASTER · Ajustes, nodo `41215:55158`](https://www.figma.com/design/uWP6X6YhgX2lzgOBwyiguO/MASTER---Ajustes?node-id=41215-55158), contrastado el 26 de octubre de 2026. Muestra el panel superior y las quince cards del Summary en cuatro columnas. Publicaciones se conserva al inicio de la primera columna, con contorno azul; las demás cards se atenúan para mantener visible el contexto. No se inserta una segunda card de publicaciones.

La vista inicial ajusta el escritorio de 1280 px al ancho disponible; `100%` permite revisar el tamaño original y desplazarse por el template. La card destacada es una referencia visual estática de esa instancia: sus totales son 15/135/4/4/20, con «Más detalle» en las primeras cuatro secciones y sin dot en Publicidad. Estas diferencias respecto de la anatomía más reciente no cambian el Guideline ni el Playground. Las otras cards reutilizan las previews locales del Builder; el diseño no establece elegibilidad por mercado o tipo de cuenta.

## Alcance del prototipo

El Playground está orientado a conocer el componente, sus estados, interacciones e implementaciones por mercado o contexto. No edita su estructura, título ni cifras. Los enlaces no navegan fuera del prototipo; informan qué destino abrirían. La experiencia de ventas conserva su Playground anterior.
