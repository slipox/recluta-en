# Componentes OCR incluidos

La función «Foto → español» empaqueta estos archivos localmente para que funcione sin red:

| Archivo | Origen | Licencia |
| --- | --- | --- |
| `tesseract.min.js` | tesseract.js 7.0.0 | Apache-2.0 (`LICENSE-tesseract-js.md`) |
| `worker.min.js` | tesseract.js 7.0.0 | Apache-2.0 (`LICENSE-tesseract-js.md`) |
| `tesseract-core-lstm.wasm.js` | tesseract.js-core 7.0.0 | Apache-2.0 (`LICENSE-tesseract-core.txt`) |
| `eng.traineddata.gz` | tessdata `4.0.0_best_int`, inglés | Apache-2.0 (tesseract-ocr/tessdata) |

Se incluye sólo el núcleo LSTM no SIMD para que el mismo archivo funcione en todos los dispositivos. Es más lento que el núcleo SIMD, pero evita descargas y garantiza offline.

La traducción es un diccionario propio de la app, sin modelo externo ni servicio de red. Las palabras desconocidas se dejan en inglés y se listan para que el usuario pueda añadirlas.
