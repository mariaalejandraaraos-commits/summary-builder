# Handoff · Preview de Figma en Summary Builder

## Propósito

Permitir que una persona vea dentro de Summary Builder la referencia visual de un frame de Figma mientras construye una card. El objetivo es acelerar la conversación y la revisión visual; no modificar Figma ni convertir el resultado en una implementación productiva.

## Recomendación para el primer alcance

Distribuir Summary Builder como una **aplicación de escritorio descargable**. La persona descarga el instalador desde un canal interno, lo instala una vez y lo abre desde un ícono del Dock, Inicio o escritorio. No necesita abrir `localhost`, usar una terminal ni instalar herramientas de desarrollo.

Al abrirse, la aplicación inicia el Builder en la propia computadora y abre el navegador predeterminado automáticamente. Así la persona trabaja en una interfaz local, mientras que Figma puede usar el navegador donde ya tiene permiso para ver sus archivos. Los borradores se conservan en esa computadora.

La primera versión permite pegar un enlace de Figma. No crear un plugin de Figma en esta primera versión.

### Estado del piloto local

El 14 de octubre se agregó un piloto PWA al Builder local para comprobar la experiencia de abrirlo como aplicación. Se verificó en `127.0.0.1`, pero no es el formato final de distribución: no genera un instalador descargable ni puede compartirse directamente con otras computadoras.

Un plugin puede evaluarse después como atajo para quien ya está en Figma: toma el frame seleccionado y lo envía a la app local. No reemplaza el Builder, que sigue concentrando la Librería, la creación, la ubicación en Template, la validación mobile y la exportación.

## Persona y necesidad

Una persona de diseño o producto está definiendo una card de Summary y necesita contrastarla contra un frame de Figma sin alternar manualmente entre muchas pestañas ni copiar capturas.

## Flujo del primer alcance

1. En su primer uso, la persona descarga el instalador adecuado para su sistema operativo desde el canal interno definido.
2. Instala Summary Builder y lo abre desde su ícono.
3. La aplicación inicia el Builder localmente y abre el navegador predeterminado de forma automática.
4. Crea una card o abre una existente y elige el slot que quiere completar.
5. Selecciona **Agregar referencia de Figma** y pega un enlace de archivo, frame o prototype.
6. El Builder valida que sea un enlace de Figma y muestra un preview web cuando la persona ya tiene acceso al archivo en Figma.
7. La persona conserva el acceso para abrir el original en Figma, configura la card y continúa con Template, mobile y la descarga de revisión.
8. Si el preview no puede cargarse, puede adjuntar una imagen PNG, JPG o WebP exportada del frame; el Builder debe indicar que se trata de una referencia manual.

## Límites de acceso

- La app no solicita, guarda ni comparte una contraseña o token de Figma.
- Un archivo privado solo se puede previsualizar si la persona tiene permiso y una sesión válida de Figma en el navegador.
- El preview es para referencia visual. No se debe afirmar que el frame, sus datos o sus componentes son implementables en producción.
- La app debe mostrar un error comprensible cuando el enlace es inválido, el archivo no existe, Figma no permite el embed o la persona no tiene acceso.

Los embeds de Figma funcionan en aplicaciones web; los privados respetan la sesión y permisos de la persona. Ver [embeds de Figma](https://help.figma.com/hc/en-us/articles/360039827134-Embed-files-and-prototypes) y [acceso a embeds](https://help.figma.com/hc/en-us/articles/360051741274-Interact-with-embeds).

## Estados que se deben diseñar e implementar

| Estado | Mensaje y acción principal |
| --- | --- |
| Vacío | “Pegá un enlace de Figma o cargá una imagen de referencia”. |
| Cargando | “Estamos preparando la referencia de Figma”. Mantener la card editable. |
| Preview listo | Mostrar preview, nombre/enlace original y “Cambiar referencia”. |
| Enlace inválido | “Este enlace no parece ser de Figma”. Permitir corregirlo. |
| Sin acceso o sin sesión | “No podemos mostrar este archivo. Abrilo en Figma para comprobar que tenés acceso o cargá una imagen exportada”. |
| Embed no disponible | Ofrecer abrir el original en Figma y cargar una imagen manual. |
| Imagen manual | Mostrar etiqueta “Referencia cargada manualmente” y permitir reemplazarla o quitarla. |

## Criterios de aceptación

- Pegar un enlace de Figma válido no bloquea la edición de la card.
- Un preview disponible se ve dentro del slot y se conserva como referencia al exportar el HTML de revisión, sujeto a las restricciones del embed.
- Cuando Figma deniega el acceso, no se muestra una superficie vacía ni se simula un preview: se explica la causa y se ofrece el fallback de imagen manual.
- La persona siempre puede abrir el enlace original en Figma, reemplazar la referencia o eliminarla.
- La referencia no se usa como fuente automática de datos, reglas de negocio ni componentes productivos.
- La solución funciona desde el instalador descargado y no depende de instalar un plugin de Figma.

## Alternativa posterior: plugin de Figma

Validar solo después del primer alcance si el equipo necesita ahorrar el paso de copiar el enlace. El plugin tendría un único propósito: con un frame seleccionado, mostrar **Enviar a Summary Builder** y abrir la aplicación local con esa referencia.

- Si la aplicación no está abierta, el plugin puede iniciarla o indicar cómo abrirla.
- Debe solicitar el mínimo acceso posible y no enviar archivos a un servidor ajeno.
- No evita los permisos de Figma ni amplía el acceso de quien usa el plugin.

Si el plugin hace solicitudes de red, los dominios deben declararse explícitamente en su manifiesto. Ver [solicitudes de red en plugins](https://developers.figma.com/docs/plugins/making-network-requests/).

## Pendientes antes de construir

- Definir sistemas operativos soportados, formato de los instaladores y su canal interno de descarga.
- Definir firma y actualizaciones de la aplicación para que las personas puedan instalarla con confianza.
- Confirmar si el equipo receptor necesita una preview interactiva o si una imagen estática basta para revisión.
- Acordar cuánto tiempo se conservan localmente enlaces e imágenes de referencia.
- Probar con un archivo público y con uno privado al que una persona ya tenga acceso.
