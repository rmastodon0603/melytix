# API Spec — Melytix

## POST /api/analyze
- **Description**: Accepts a parsed dataset or raw file content and returns structured insights.
- **Body (JSON)**:
  - `fileContent: string` — raw CSV text
  - `fileName: string`
  - `baselineId?: string` — optional reference to previous report
- **Response (200)**:
  - `insights: any[]`
  - `alerts: any[]`
  - `recommendations: any[]`
  - `raw?: any`

## POST /api/save
- **Description**: Persists a single analysis result for later retrieval.
- **Body (JSON)**:
  - `report: { id: string; createdAt: string; fileName: string; summary: string; payload?: any }`
- **Response (200)**:
  - `{ ok: true }`




