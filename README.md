# SEP Complex Networks Project

This project applies complex network theory to the Stanford Encyclopedia of Philosophy (SEP) article network. The core outputs are a research notebook and a LaTeX Beamer presentation.

## Deliverables
- **Notebook**: `clean.ipynb` (canonical) with the full analysis and narrative.
- **Presentation**: a Beamer `.tex` slide deck summarizing the study.

## Primary paper selection
Choose one primary paper from the three wiki/knowledge-network papers in `articles/` and use it as the main research anchor:
- *A Deep Analysis of Node Roles and Connection Patterns in Wikilink Network*
- *Complex networks reveal emergent interdisciplinary knowledge in Wikipedia*
- *Evolution and Link Prediction of the Wikipedia Network*

The other two are still reviewed in the notebook; the selected paper gets the detailed summary and is emphasized in the presentation.

## Required notebook structure
`clean.ipynb` must include:
1. **Motivation + project question** (conceptual introduction).
2. **Review of the three papers** + summary of the selected one.
3. **Modeling/simulation** of the SEP network (graph construction + assumptions).
4. **Network metrics** (e.g., centralities, degree statistics).
5. **Visualizations** (plots and the PyVis network export).
6. **Critical discussion and conclusions**.
7. **AI-use statement** (what was used and how).

## Presentation scope (Beamer)
Slides should mirror the notebook narrative: motivation/question, paper selection + key takeaways, modeling approach, metrics/visuals, critical discussion/conclusions, and the AI-use statement.

## Running the analysis
Open `clean.ipynb` in Jupyter with the `.venv` kernel. The notebook uses common scientific Python libraries (requests, BeautifulSoup, NetworkX, pandas, NumPy, matplotlib, seaborn, pyvis).

## Data artifacts
- `sep_links.json`: per-entry link cache for the crawl.
- `sep_graph.pkl`: cached NetworkX graph.
- `sep_bridges.html`: interactive PyVis network visualization (uses `lib/` assets).
