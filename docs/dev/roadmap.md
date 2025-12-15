# Melytix — MVP Roadmap

## Phase 1 — Skeleton (current, mostly done)
- Next.js App Router project initialized.
- Core structure in place: `app`, `components`, `services`, `utils`, `docs`.
- Upload page with basic two-file uploader (current period vs previous period).
- Results and History pages (initial stubs).
- API endpoints `/api/analyze` (mocked) and `/api/save` (stub).

## Phase 2 — AI Analysis (in progress)
- Integrate OpenAI GPT API into `/api/analyze`.
- Send two raw CSV/XLS exports (current vs previous) as input.
- Use a robust analysis prompt tailored for:
  - Google Ads,
  - mobile apps with Web2App / quiz funnels,
  - UA performance metrics (CTR, CPA, ROAS, etc.).
- Return a structured JSON response:
  - `alerts[]`, `insights[]`, `recommendations[]`.
- Log full OpenAI responses and errors on the server for debugging (quota, parsing issues, etc.).

## Phase 3 — Parsing & Metric Comparison Engine
- Implement robust CSV parsing for Google Ads exports.
- Normalize columns into a consistent internal schema:
  - date, campaign, ad group, ad, device, geo, etc.
- Aggregate metrics by different dimensions and compute deltas:
  - day-over-day, week-over-week.
- Pre-compute useful aggregates and anomaly signals to feed into the AI prompt.

## Phase 4 — History & Local Persistence
- Save each analysis result to localStorage (or simple local DB).
- Build a useful History page:
  - list of past analyses with timestamps and short summaries.
  - ability to re-open a past analysis.
- Optionally: export analysis (JSON/CSV or copyable text).

## Phase 5 — Towards “real product”
- Start thinking about a multi-user version (beyond the single internal user).
- Authentication and workspaces.
- Additional data sources, if needed (other ad networks, analytics tools).
- More standardized “playbooks” and presets for recommendations.
