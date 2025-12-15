# Melytix — AI Assistant for UA Managers (Google Ads Focus)

Melytix is an internal AI assistant for a Senior User Acquisition manager working with large-scale Google Ads campaigns for mobile apps (Web2App flows, quiz funnels, subscriptions, etc.).

## What Melytix does today (v0)

- Works with **Google Ads CSV/XLS exports only** (no other data sources yet).
- Compares **two time periods** (for example: yesterday vs the day before, week vs previous week).
- Automatically analyzes performance on multiple levels:
  - campaign → ad group → ad → day
  - key metrics such as: impressions, clicks, cost, conversions, revenue, CTR, CVR, CPC, CPA, ROAS.
- Generates:
  - **alerts** about negative trends and anomalies,
  - **insights** about interesting changes or winners,
  - **actionable recommendations** for what to do next in the account.

## Why this exists

Manually scanning tens or hundreds of campaigns, ad groups and ads day by day is slow and error-prone.  
As a UA manager, you can realistically watch only a few metrics and a few groupings at once.

Melytix offloads the **analytical layer**:
- processes more data than a human can in a reasonable time,
- highlights where attention is needed,
- suggests next steps, so the UA manager can focus on decisions, not raw number crunching.

## Future direction

In the future Melytix may:
- support additional data sources (other channels, analytics tools),
- serve multiple users and teams instead of a single UA manager,
- provide more advanced cohort/funnel analysis.

But **for now**, the scope is intentionally narrow:  
> “One power user (UA manager) + Google Ads exports + AI-generated alerts & recommendations.”