# Proyecto de Redes Complejas SEP

Este proyecto aplica teoria de redes complejas a la red de articulos de la Stanford Encyclopedia of Philosophy (SEP). Los productos centrales son un cuaderno de investigacion y una presentacion Beamer en LaTeX.

## Entregables
- **Cuaderno**: `clean.ipynb` (canonico) con el analisis completo y su narrativa.
- **Presentacion**: un archivo `.tex` de Beamer que resume el estudio.

## Seleccion del articulo principal
Selecciona un articulo principal de los tres trabajos sobre redes wiki/conocimiento en `articles/` y usalo como ancla de investigacion:
- *A Deep Analysis of Node Roles and Connection Patterns in Wikilink Network*
- *Complex networks reveal emergent interdisciplinary knowledge in Wikipedia*
- *Evolution and Link Prediction of the Wikipedia Network*

Los otros dos se revisan en el cuaderno; el articulo elegido lleva el resumen detallado y se enfatiza en la presentacion.

## Estructura requerida del cuaderno
`clean.ipynb` debe incluir:
1. **Motivacion + pregunta del proyecto** (introduccion conceptual).
2. **Revision de los tres articulos** + resumen del seleccionado.
3. **Modelado/simulacion** de la red SEP (construccion del grafo + supuestos).
4. **Metricas de red** (por ejemplo, centralidades y estadisticas de grado).
5. **Visualizaciones** (graficos y exportacion PyVis).
6. **Discusion critica y conclusiones**.
7. **Declaracion de uso de IA** (que se uso y como).

## Alcance de la presentacion (Beamer)
Las diapositivas deben reflejar la narrativa del cuaderno: motivacion/pregunta, seleccion del articulo + hallazgos clave, enfoque de modelado, metricas/visuales, discusion/conclusiones y la declaracion de uso de IA.

## Ejecucion del analisis
Abre `clean.ipynb` en Jupyter con el kernel `.venv`. El cuaderno usa librerias cientificas comunes de Python (requests, BeautifulSoup, NetworkX, pandas, NumPy, matplotlib, seaborn, pyvis).

## Artefactos de datos
- `sep_links.json`: cache de enlaces por entrada para el rastreo.
- `sep_graph.pkl`: grafo de NetworkX en cache.
- `sep_bridges.html`: visualizacion interactiva en PyVis (usa los assets de `lib/`).
