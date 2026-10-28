# Nido · Fotografía newborn y familia (paquete Profesional)

**URL:** https://demo-foto-nido.vercel.app · **Código:** `frontend/projects/foto-nido`

## Concepto

Estudio de Inés Calvo (fotógrafa ficticia): recién nacidos, maternidad, familia y primer año. Lema: "Lo pequeño dura poco".

Rediseño visual del 28 oct 2026 con la skill `design-taste-frontend`, dirección **"pinned poster"**: el sitio es la tapa de un álbum de tela verde botella con letras doradas. Sustituye al diseño anterior de "álbum ilustrado" (intro de cuarto oscuro, cursor propio, índice, cabezales, hoja de contactos), que se sentía muy dibujado.

**La idea:** en la portada, "Lo pequeño dura poco" se queda fijo y abajo el bebé crece en la misma foto: semana 31, día 9, día 12, mes 7, mes 11 y un año.

## Identidad

- **Paleta:** verde botella `#133621` (fondo), `#1a4429` y `#21502f` (superficies), dorado `#f4d96c` para todo el texto y la acción. Las fotos se oscurecen un poco para que el dorado no pelee con ellas.
- **Tipografía:** Schibsted Grotesk (una sola familia), títulos en 800 con tracking cerrado.
- **Reglas de la skill:** esquinas rectas, sin líneas, sin sombras, sin degradados, sin numeración, sin etiquetas pequeñas sobre los títulos.

## Secciones

1. **Portada fija** (`hero.ts`): título en una línea (dos en celular) y seis fotos del mismo encuadre que cambian con el scroll (ScrollTrigger), con la edad del bebé.
2. **Sesiones** (`sessions.ts`): cuatro láminas a pantalla completa, foto muy de cerca y el mismo renglón a media altura (cuándo · sesión · duración), con el texto y un enlace para apartar por WhatsApp.
3. **¿Cuándo nace tu bebé?** (`due.ts`, lo que se puede hacer en la página): con la fecha probable de parto calcula cuándo apartar, la ventana de maternidad (semanas 28–34), la de newborn (días 5–15) y la del primer año, y arma el mensaje de WhatsApp con esas fechas.
4. **Un día de sesión** (`day.ts`): un verbo enorme por etapa (Llegar, Dormir, Abrazar, Elegir) fijo al centro mientras pasa su foto.
5. **Inés** (`ines.ts`): retrato, una frase suya y tres respuestas.
6. **Tarifas** (`rates.ts`): un boleto dorado con muescas y perforación; los paquetes se eligen arriba y el talón trae el precio y el botón. Extras y dudas frecuentes debajo.
7. **Cartas** (`letters.ts`): testimonios con foto, alternando de lado.
8. **Reserva** (`contact.ts`): el correo a todo lo ancho en colores invertidos.
9. **Pie** (`footer.ts`): "Nido" a todo lo ancho, datos y enlaces.

## Revisión

`lint.mjs` e `inspect.mjs` de la skill: 0 errores. Dos avisos defendidos: no hay video (no hay un clip libre que sirva para un estudio de fotografía) y los verbos van sobre fotos a propósito (así lo pide la dirección; las fotos van oscurecidas).

## Fotos

37 fotos de Pexels con tono cálido tipo película (`scripts/media-demos.mjs` del workspace de Demos, lista `nido`).
