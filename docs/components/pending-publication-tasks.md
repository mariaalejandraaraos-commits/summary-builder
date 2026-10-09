# Pendientes en tus publicaciones

## Fuentes

- Figma: archivo `W7DL83AHDlsqgtnx4CRNEA`, nodo `51:782` (`Card-preventa`).
- Casos de uso en Figma: sección `51:326` (`Relevamiento de cards`).
- Guideline: deck `BSUH1sZK90X2XWchsJlQ4H`, slides 9 a 13.
- Referente de estructura: Grid `01KSQWV81YKSYQWQ4RXVXY47K4` (`Widgets Fintech`, versión 42).
- Frontend: `sso-seller-home-frontend/app/shared/cards/tasks-card/index.tsx` y `index.scss`.
- Proveedor: `fury_sso-seller-home-task-provider`.
- ID productivo: `pending_pre_sales_task_card`.

## Anatomía validada

El componente es un contenedor de 270 px de ancho con título y una lista vertical de subcards. El diseño de referencia usa 16 px de padding, 8 px de separación, fondo `#f5f5f5` y radio de 6 px.

| ID | Título | Valor de muestra | Descripción | Indicador | Acción |
| --- | --- | --- | --- | --- | --- |
| `question_task_card` | Preguntas | 15 | Por responder | Rojo | Navegación en el encabezado |
| `publication_task_card` | Publicaciones | +999 | Por mejorar | Rojo | Navegación y tareas desplegables |
| `full_task_card` | Productos Full | 4 | Por gestionar | Rojo | Navegación y tareas desplegables |
| `pricing_automation_task_card` | Precios | 4 | Por gestionar | Rojo | Navegación y tareas desplegables |
| `advertising_task_card` | Publicidad | 20 | Sugerencias | Sin indicador | Navegación y tareas desplegables |

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
- Las tareas con badges distintos de gris se muestran aun cuando el grupo está plegado.
- Las tareas con badge gris aparecen al usar `Ver más` y vuelven a ocultarse con `Ver menos`.
- El estado sin pendientes se prueba por grupo: muestra un badge discreto con `0` y oculta métrica, descripción y tareas.
- El error también se prueba por grupo y usa el fallback productivo `No pudimos mostrar estos datos.` con la acción `Reintentar`.
- El encabezado conserva su navegación independiente de la expansión del contenido.
- La vista `Mobile / Webview` reproduce la lógica compacta del frontend.

Figma muestra el texto estático `Más detalle`, mientras que la implementación vigente del frontend usa `Ver más` y `Ver menos` para las tareas con badge gris. El Playground adopta el comportamiento del repositorio y conserva la presentación visual de Figma. Los textos de las tareas desplegables son datos ilustrativos del prototipo; la estructura y las reglas de visibilidad sí provienen del componente productivo.

## Casos de uso relevados

La pestaña `Casos de uso` usa la estructura del referente de Grid: una vitrina responsive de dos columnas, cada ejemplo centrado dentro de una superficie neutral y una etiqueta contextual al pie. El contenido se reconstruye con componentes locales; no depende de capturas ni de assets temporales de Figma.

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

## Estados de prueba de la subcard

El Playground permite elegir un grupo y aplicarle uno de los cinco estados oficiales definidos en Figma:

| Estado | Representación |
| --- | --- |
| Desplegada | Muestra la métrica y cuatro tareas: Prioritarias para catálogo (300), Sin stock (500), Inactivas por incumplir políticas (200) y Próximas a pausarse (390). Las tres primeras usan pill rojo y la última pill gris. El footer muestra `Ver menos`. |
| Fallback | Conserva el encabezado y reemplaza el contenido por el panel `No pudimos mostrar estos datos` con `Reintentar`. |
| Sin Pendientes | Oculta métrica, descripción, tareas y acción. Puede mostrar el pill `0`. |
| Plegada con Urgentes | Muestra el resumen cerrado con indicador rojo. |
| Plegada Sin Urgentes | Muestra el resumen cerrado sin indicador rojo. |

Cada card interna conserva de manera independiente el estado seleccionado. El selector `Card interna` permite cambiar entre Preguntas, Publicaciones, Productos Full, Precios y Publicidad sin perder la configuración aplicada a las demás.

Dot y pill no son overrides manuales en el Playground porque el repositorio los deriva de los datos:

- El dot aparece si `summary.badge.color` es rojo y la subcard no está vacía ni en fallback.
- El pill del header aparece únicamente en estado vacío, con el valor `0`, color gris y jerarquía quiet.
- Los pills de las tareas aparecen siempre que el ítem incluya `badge`.
- El fallback no muestra dot, pill ni chevron.
- El header productivo usa una fila con `padding: 12px 16px`.
- Los divisores entre métrica, tareas y footer ocupan el ancho completo de 237.5 px de la subcard; ningún divisor se ajusta al ancho del texto de la acción.

## Alcance del prototipo

El Playground permite modificar los cinco valores, elegir una subcard y probar sus cinco estados. Dot, pill, descripción y navegación permanecen gobernados por la lógica del componente productivo. También se puede alternar el tema y cambiar entre desktop y mobile/webview. Los enlaces no navegan fuera del prototipo; informan qué destino abrirían.
