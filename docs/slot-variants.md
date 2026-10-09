# Variantes de slot para el Builder

El selector **Librería → Patrón visual** toma como referencia el frame [`.Slot variants` de Librería Summary](https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/Librer%C3%ADa-Summary?node-id=130-67697), confirmado el 5 de octubre de 2026. Ese frame incluye 14 tipos: `_Slot` representa el espacio vacío y los otros 13 son opciones de contenido. Se añadió una opción de otra fuente: la [card de recomendaciones del MASTER de Seller Home](https://www.figma.com/design/KTkkBUm9YLJSPmLpPQoEoR/%E2%9A%A1%EF%B8%8FMASTER---Seller-Home---Summary?node-id=19878-179678). Cada variante se leyó por separado para recuperar medidas, texto, colores y recursos visuales.

| Nombre en el CSS | Opción en el Builder | Vista previa local |
| --- | --- | --- |
| `_Data Graphic` | Data Graphic | Gráfico con ejes, fechas y línea de tendencia |
| `_Value basic` | Value basic | De una a cuatro métricas editables; hasta dos por fila; indicador Icon o Dot y color por dato según los componentes de Figma |
| `_Data gauge` | Data gauge | Tacómetro semicircular de nivel |
| `_Fallback` | Fallback | Estado sin datos, mensaje y acción |
| `State description` | State description | Aclaración de estado y período |
| `News` | News | Novedad con ilustración, título, descripción y enlace |
| `Reputation` | Reputation | Estado y escala de reputación |
| `Card` | Card | Bloque destacado sobre fondo degradado |
| `Benefits` | Benefits | Lista de beneficios y productos |
| `Trends by category` | Trends by category | Categorías con tendencias |
| `Declining listings` | Declining listings | Lista de publicaciones con caída |
| `Opportunities` | Opportunities | Oportunidad de producto y acción |
| `Live monitor` | Live monitor | Monto, referencia y gráfico temporal |
| `Recomendacion Modulo` (MASTER Seller Home) | Card de recomendaciones | Título, descripción y enlace editables; producto relacionado opcional |

Las vistas previas usan los datos de ejemplo y las medidas del frame. Los SVG del gráfico, tacómetro, monitor e ilustración de News, y la imagen de Card, se guardan en `src/assets/slot-variants/` e incorporan en línea al HTML. La card de recomendaciones conserva su fondo degradado, ícono, tipografía y estructura del MASTER; sus recursos visuales locales están en `src/assets/recommendation-card/`. El brillo animado de Figma no se reproduce en esta demo estática. Como se muestra dentro de la card del Builder, su ancho se adapta al slot y mantiene los márgenes del contenedor. El producto relacionado se puede ocultar; su imagen es un recurso fijo de la demo, mientras que el nombre y la cantidad son editables. Los textos principales de las variantes siguen siendo editables, de modo que la vista puede apartarse de la composición original. “Mi idea” es una demo local separada que crea una card completa para los casos cubiertos.
