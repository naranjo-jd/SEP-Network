# Proyecto de Redes Complejas SEP

Este proyecto aplica teoria de redes complejas a la red de articulos de la Stanford Encyclopedia of Philosophy (SEP). Los productos centrales son un cuaderno de investigacion y una presentacion Beamer en LaTeX.

## Entregables
- **Cuaderno**: `clean.ipynb` (canonico) con el analisis completo y su narrativa.
- **Presentacion**: un archivo `.tex` de Beamer que resume el estudio.

## Seleccion del articulo principal
Se seleccionara un articulo principal de los trabajos sobre redes wiki/conocimiento en `articles/` y sera usado como ancla de investigacion:

- *Wikipedias: Collaborative web-based encyclopedias as complex networks (Domazet et al. ;2006)*
- *Exploring complex networks (Strogatz; 2001)*
- *A Deep Analysis of Node Roles and Connection Patterns in Wikilink Network*
- *Complex networks reveal emergent interdisciplinary knowledge in Wikipedia (Schwartz; 2021)*
- *Evolution and Link Prediction of the Wikipedia Network (Zhang et al. 2019)*
- *Who Connects Wikipedia? A Deep Analysis of Node Roles and Connection Patterns in Wikilink Network (Dong, Xia; 2023)*
- *Big Networks: A Survey (Zhang et al. 2020)*

Tres de ellos se revisan en el cuaderno; el articulo elegido lleva el resumen detallado y se enfatiza en la presentacion.

## Estructura requerida del cuaderno
`clean.ipynb` incluye:
1. **Motivacion + pregunta del proyecto** (introduccion conceptual).
2. **Revision de los tres articulos** + resumen del seleccionado.
3. **Modelado/simulacion** de la red SEP (construccion del grafo + supuestos).
4. **Metricas de red** (por ejemplo, centralidades y estadisticas de grado).
5. **Visualizaciones** (graficos y exportacion PyVis).
6. **Discusion critica y conclusiones**.
7. **Declaracion de uso de IA** (que se uso y como).

## Alcance de la presentacion (Beamer)
Las diapositivas reflejan la narrativa del cuaderno: motivacion/pregunta, seleccion del articulo + hallazgos clave, enfoque de modelado, metricas/visuales, discusion/conclusiones y la declaracion de uso de IA.
