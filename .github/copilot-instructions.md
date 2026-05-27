# Copilot instructions

## Build, test, lint
- No build/test/lint scripts are defined; work is notebook-driven. Run `clean.ipynb` (preferred) or `work.ipynb` in Jupyter using the `.venv` kernel.

## Project requirements
- Deliverables: a Jupyter notebook analyzing the SEP article network and a LaTeX Beamer presentation summarizing the project.
- A primary paper must be chosen from the three wiki/knowledge-network papers in `articles/`, then reviewed and summarized in the notebook and cited in the presentation.
- The notebook must include: project motivation/question, review of all three papers + summary of the selected one, modeling/simulation, network metrics, visualizations, critical discussion/conclusions, and a clear AI-use statement.

## Architecture
- **Data acquisition**: `clean.ipynb` scrapes SEP’s contents page, then each entry page to extract internal `/entries/` links with a custom User-Agent and a polite delay.
- **Caching**: crawl results are persisted in `sep_links.json` (per-entry link map) and the graph in `sep_graph.pkl` to resume/skip re-crawls.
- **Graph analysis**: builds a directed NetworkX graph of SEP entries; computes betweenness/closeness/degree on the undirected largest connected component, and PageRank on the directed graph.
- **Outputs/visuals**: analysis plots are produced with matplotlib/seaborn, and an interactive PyVis network is exported to `sep_bridges.html`, which loads `lib/bindings/utils.js` and vis-network assets.

## Conventions
- `clean.ipynb` is the canonical pipeline; `work.ipynb` is an exploratory/earlier version.
- SEP entry **slug** (URL segment) is the primary identifier; titles are stored as node attributes and in the results dataframe.
- **bridge_ratio** is defined as `betweenness / (degree + 1e-9)` to surface high-bridge, low-degree entries.
- Subdiscipline grouping is manual via `subdiscipline_map` in `clean.ipynb`; update that map when adjusting categories.
- `lib/` is vendored front-end assets; `lib/bindings/utils.js` expects global `nodes`, `edges`, and `network` (used by `sep_bridges.html` for highlight/filter behavior).
