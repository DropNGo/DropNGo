# Project Find — Build Status

Last build pass: Phase 7 architecture pass

| Phase | Status |
|---|---|
| 1 Vehicle knowledge | IN PROGRESS — schema + resolver v2 |
| 2 Intent understanding | IN PROGRESS — natural language MVP |
| 3 Research engine | IN PROGRESS — research contract ready; live source adapters pending |
| 4 Image inspection | IN PROGRESS — inspection contract + evidence model; vision runtime pending |
| 5 Price intelligence | IN PROGRESS — comparable-price scorer ready; live comparables pending |
| 6 Real listings | NOT LIVE — requires permitted/current source connectors |
| 7 Link inspector | IN PROGRESS — URL normalization entry point ready; page-fetch adapters pending |

## Product rule
Never claim that an offer was searched, verified, or image-inspected unless the system actually performed that operation and stored evidence.

## Current limitation
The static GitHub Pages frontend can host the UI, but it cannot safely perform server-side scraping, secrets management, or protected-site fetching. GitHub Pages is a static hosting service. A small backend/worker is required for live research and source connectors.
