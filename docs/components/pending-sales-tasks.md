# Pendientes en tus ventas

## Fuentes

- Diseño adjunto: export CSS de `Card-posventa`.
- Frontend: `sso-seller-home-frontend/app/shared/cards/tasks-card/index.tsx`, `index.scss` y pruebas del componente.
- Proveedor: `fury_sso-seller-home-task-provider/cmd/api/config/fury/application.json` y traducciones de `internal/core/constant/wording.go`.
- ID productivo: `pending_pos_sales_task_card`.

## Composición validada

La card pertenece a la misma familia productiva que Pendientes en tus publicaciones y reutiliza `TasksCard`. El proveedor define dos grupos y un máximo de cuatro tareas por componente:

| ID | Título | Rol |
| --- | --- | --- |
| `post_sales_task_card` | Posventa | Reúne pendientes posteriores a una venta. |
| `sales_task_card` | Envíos de hoy | Reúne tareas operativas de los envíos del día. |

El diseño adjunto define un contenedor de 270 × 352 px con padding de 16 px, gap de 8 px y fondo `#f5f5f5`. Cada subcard mide 237.5 × 143 px en el estado plegado de referencia. Los divisores y footers conservan los 237.5 px completos.

## Comportamiento tomado del frontend

- Cada grupo conserva navegación, métrica, tareas y estado de carga independientes.
- El dot se deriva del badge rojo del resumen.
- El pill del encabezado aparece en el estado vacío con valor `0`.
- Las tareas con badge gris permanecen ocultas mientras el grupo está plegado.
- `Ver más` revela las tareas grises y cambia a `Ver menos`.
- El fallback sustituye el contenido de una sola subcard y permite reintentar.
- En mobile o webview, el grupo de Posventa usa el fallback interno definido por el frontend y la descripción del resumen sustituye el nombre del grupo.

## Playground

El Playground reutiliza el mismo motor de Pendientes en tus publicaciones y ofrece, por cada card interna:

- Desplegada.
- Fallback.
- Sin Pendientes.
- Plegada con Urgentes.
- Plegada Sin Urgentes.

También permite editar el título y los valores, probar el estado general Loading o No disponible, alternar Desktop y Mobile / Webview y activar el modo oscuro.

Los nombres `Demoradas`, `Colecta pendiente`, `Turbo | 12:00 - 13:00 hs` y `Agencia | Hasta las 20:00 hs` provienen de las pruebas del frontend. Los textos de ejemplo usados para las tareas internas de Posventa son ilustrativos hasta contar con una respuesta real del proveedor para esa categoría.
