# Blessed Extinction — Landing v2 · Paleta unificada.

Mismo diseño, contenido y JavaScript que `../landingBlessedExtinction/`. Lo único que cambia es la paleta: toda la página usa los tonos del single **Incorruptible Cadavérico**.

## Paleta (`css/styles.css`, bloque `:root`)

| Variable | Color | Uso |
|---|---|---|
| `--c-bg` / `--c-bg-soft` | `#0d0a08` / `#16110d` | Fondos (negros cálidos en lugar de grises neutros) |
| `--c-line` | `#2f261d` | Bordes y separadores |
| `--c-ash` / `--c-text` | `#857867` / `#b5aa94` | Texto secundario y texto base |
| `--c-bone` / `--c-bone-light` | `#d8cba8` / `#ece3cf` | Títulos |
| `--c-gold` / `--c-gold-light` | `#c9a24a` / `#f0d58a` | **Único acento**: bordes de botón, hovers, subrayados, pestañas, badge |
| `--c-blood` / `--c-ember` | `#6e1a12` / `#b3361b` | Relleno del botón principal y su hover, resplandores |

Cambios frente al original:

- Se eliminó el rojo saturado `#ff1e1e`; todos los hovers y líneas usan oro viejo.
- Las tarjetas de discografía ya no tienen acento propio (oro, violeta, verde); todas usan oro.
- El logo verde se dora con el mismo filtro (`--logo-tint`) en la intro, la cabecera, el hero y el pie.
- La ilustración del hero lleva un velo cálido para que no choque con el resto.

## Ilustración en «Escucha & Sigue»

`img/art1-web.jpg` (1100×1619, ~480 KB) es la versión web de `img/art1.png` (4088×6017, 8 MB; la página no usa el original). Efecto **linterna con parallax**, con los colores originales: la ilustración apenas se intuye (copia tenue al 20 %) y un círculo de luz que sigue al cursor o al dedo la revela; ambas copias se desplazan un poco en sentido contrario al cursor. Sin puntero, la luz deriva sola, y el bucle sólo corre mientras la sección está en pantalla. En pantallas de 900 px o más la ilustración se limita a 920 px de ancho para que se vea buena parte del diseño. Con «reducir movimiento», la ilustración queda fija y algo más visible.

Ajustes en `css/styles.css`: `--radius` (tamaño de la luz) en `.lantern`, `opacity` de `.lantern__img--dim` (cuánto se ve sin luz), `background-size` de `.lantern__img` (tamaño de la ilustración) y el `28px` del `transform` (intensidad del parallax).

## Foto de la banda

Va debajo de la biografía como franja panorámica 21:9 (4:3 en móvil), centrada en los rostros, con los nombres de izquierda a derecha: Jhon, William, Julio, Carlos y Julián. Al hacer clic se abre completa en un lightbox (`Esc` o clic fuera para cerrar).

`propuestas.html` contiene las maquetas que se compararon; se puede borrar.

El diseño anterior de esta carpeta (concepto «Brutalismo industrial») quedó en `_respaldo-v3/`.

## Minijuego «El Péndulo»

Se abre desde el enlace bajo «Sin fechas anunciadas» (Tour) y desde el botón «Minijuego» del pie. Va en un `<dialog>` a pantalla completa en móvil. El jugador detiene el péndulo en la zona dorada; cada acierto acelera el péndulo y achica la zona, un acierto en el centro vale 2 puntos y con 3 fallos se acaba la partida. El récord queda guardado en el navegador. Al terminar aparecen los enlaces de `GAME_LINKS` en `js/main.js` (YouTube y Spotify; hay una línea comentada para añadir la tienda de merch).

## Tienda

Sección `#tienda` entre «La Banda» y «Tour», con la camiseta (tres colores de logo), el hoodie y el CD. Todo se edita en `index.html` (hay un comentario encima de la sección):

- **Precio:** el texto de `.product__price`.
- **Agotado:** `data-soldout` en el `<article>` (todo el producto) o en un botón de color o talla. La foto se apaga con el sello «Sold Out» y el botón «Pedir por correo» se cambia por «🔔 Quiero que vuelva».
- **Pedir por correo:** abre el correo del visitante dirigido a `CONTACT_MAIL` (`js/main.js`), con el asunto y el pedido escritos (producto · color · talla). La talla es obligatoria si el producto tiene tallas. Debajo se muestra la dirección, por si el visitante no tiene programa de correo configurado.
- **Votos:** van al Worker (`POST /vote`), que los guarda en D1 y avisa al grupo de Telegram. En el grupo, `/votos` muestra el ranking con el reparto por talla. Un voto por producto y navegador. Tras votar, el fan puede pedir por correo que le avisen cuando vuelva.
- **Mockup de la camiseta:** silueta SVG con el arte encima. La tela (`#1d1917`) es apenas más clara que el fondo de los JPG (`rgb(17,13,12)`) y el arte usa `mix-blend-mode: lighten`, así que el recuadro negro desaparece. Un arte nuevo necesita ese mismo fondo (o más oscuro).
- **Colores del hoodie:** sólo hay foto en verde. El rojo y el azul se simulan girando el tono de esa foto (`data-hue` en grados y `data-sat` para avivar el color). Los negros y grises no cambian. Si hay fotos reales, cambia `data-hue` por `data-img="img/merch/hoodie-rojo.jpg"` en el botón del color.
- `data-product` y `data-variant` son los nombres que ve la banda en Telegram: minúsculas, números y guiones.

## Chat con la banda (Telegram)

Botón flotante abajo a la derecha que sube cuando aparece el reproductor de Spotify. En móvil se abre como hoja inferior. El backend está en `../chat-worker-blessed/`, donde también está la guía de configuración y seguridad. `CHAT_API` y `TURNSTILE_SITEKEY` en `js/main.js` apuntan al Worker publicado. En `localhost` / `127.0.0.1` la página usa siempre el Worker local (`npm run dev`), porque el de producción sólo acepta peticiones desde la web publicada; abierta como archivo (`file://`) no muestra el chat.

> Estilos de ambos al final de `css/styles.css` (antes de los `@keyframes`). El `scss/styles.scss` no tiene la paleta actual, así que estos cambios sólo están en el CSS.
