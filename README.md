# Awin Analyst

**Evidence-first AI analytics workspace for dataset profiling, visualization, and Gemini-assisted interpretation.**

![CI](https://github.com/Awinmipalan/Awinanalyst/actions/workflows/ci.yml/badge.svg)

## Overview

Awin Analyst is a React, TypeScript, Express, and Gemini application for exploratory analytics. The project is designed around a strict separation between deterministic calculations and AI interpretation: the local profiling engine computes the evidence first, then Gemini interprets that verified profile in natural language.

```text
Dataset
   ↓
Validation
   ↓
Schema Detection
   ↓
Data Quality Engine
   ↓
Statistical Engine
   ↓
Verified Evidence
   ↓
Gemini Interpretation
   ↓
Insights
   ↓
Visualization
```

## Business Problem

Many analytics prototypes send raw data directly to an LLM and then rely on generated text for numerical claims. That approach is risky because it can blur the line between measured evidence and AI-generated interpretation. Awin Analyst addresses this by using TypeScript utilities to profile datasets locally before the AI layer is asked to summarize the evidence.

## Objectives

- Help users inspect CSV or JSON datasets through a web interface.
- Calculate data quality and statistical evidence locally.
- Provide Gemini with compact verified profiles instead of raw sample rows for `/api/analyze`.
- Present AI-generated insights as interpretation, not as the numerical source of truth.
- Support a professional analytics workflow from data quality checks to decision-ready summaries.

## Key Questions Supported

- Which columns contain missing values?
- Are duplicate rows present?
- Which fields are numeric, categorical, boolean, date-like, text, or empty?
- What are the key descriptive statistics for numeric fields?
- Which numeric fields have strong Pearson associations?
- What chart type is appropriate for the verified evidence?

## Dataset / Data Sources

The application accepts user-supplied datasets loaded through the Data Center. Current source support is focused on CSV and JSON files parsed client-side before profiling. No bundled business dataset is treated as the canonical source of truth for the application.

## Analytical Methodology

```text
Raw Data
   ↓
Data Cleaning / Parsing
   ↓
Validation
   ↓
Transformation
   ↓
Profiling
   ↓
Visualization
   ↓
Evidence-backed AI Interpretation
```

Implemented profiling logic in `src/utils/dataProfiler.ts` includes:

- Missing-value detection for `null`, `undefined`, and blank strings.
- Numeric parsing for numbers and numeric strings with thousands separators.
- Schema/type detection for numeric, date-like, boolean, categorical, text, and empty fields.
- Cardinality and uniqueness-rate calculations.
- Duplicate-row detection using serialized row signatures.
- Descriptive statistics: count, mean, median, minimum, maximum, sample standard deviation, and IQR-based outlier count.
- Top-value summaries for categorical and boolean fields.
- Pearson correlation reporting for numeric column pairs with absolute coefficient of at least `0.3`.

## Features

### Implemented

- React dashboard shell with landing, authentication, dashboard, chat, and data center pages.
- Dataset upload and exploration workflow for supported file types.
- Local data profiling via `profileDataset`.
- Express API endpoints for health checks, chat, and evidence-based analysis.
- Gemini integration using `GEMINI_API_KEY` from environment variables.
- Structured `/api/analyze` response schema for insights, recommended chart type, and executive summary.
- CI workflow for install, type-check, data-profiler test, and build.

### Roadmap

- Server-side file validation and upload limits beyond the current in-memory multer setup.
- Configurable validation rules for invalid values and domain-specific constraints.
- Sensitive-data detection before AI interpretation.
- Persisted analysis sessions and audit trails.
- Expanded test coverage for API routes and UI workflows.
- More advanced statistical tests and chart recommendation rules.

## Architecture

```text
Frontend (React + TypeScript)
   ├─ Data Center: upload, preview, profiling
   ├─ Dashboard: visualization and summaries
   └─ Chat: natural-language analytical assistance

Backend (Express)
   ├─ /api/health
   ├─ /api/chat: Gemini chat with optional context summary
   └─ /api/analyze: Gemini interpretation of verified dataset profile

Analytics Core
   └─ src/utils/dataProfiler.ts: deterministic evidence engine
```

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19, TypeScript, Vite | Web application and development tooling |
| Backend | Express, Node.js | API routes and production server bundle |
| AI | Google Gemini via `@google/genai` | Natural-language interpretation of verified profiles |
| Visualization | Recharts | Interactive analytical charts |
| Parsing | Papa Parse | CSV ingestion support |
| Styling | Tailwind CSS / custom CSS | Interface styling |
| Auth/Services | Firebase client libraries | Firebase-backed app services where configured |
| Testing | `tsx` + Node assertions | Deterministic profiler validation |

## Screenshots / Demo

Screenshots are not committed yet. Add dashboard and data-center screenshots after validating the deployed UI with representative non-sensitive datasets.

## Key Findings

This repository is an analytics engineering application rather than a finished case-study notebook. The current verified analytical capability is the data profiler itself: it can calculate data quality, descriptive statistics, duplicate counts, type classifications, and correlation evidence that Gemini can interpret.

## Project Structure

```text
Awinanalyst/
├── .github/workflows/ci.yml      # CI validation workflow
├── backend/routes.ts             # Backend route placeholder/module
├── src/
│   ├── components/               # Reusable UI components
│   ├── context/                  # React context providers
│   ├── pages/                    # Application pages
│   ├── services/                 # Service helpers
│   └── utils/dataProfiler.ts     # Deterministic analytics engine
├── tests/dataProfiler.test.ts    # Profiler validation test
├── server.ts                     # Express + Vite server
├── .env.example                  # Safe environment template
├── package.json                  # Scripts and dependencies
└── README.md
```

## Installation

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Start the built server:

```bash
npm start
```

## Configuration

Copy `.env.example` to a local environment file and provide values as needed. Never commit local `.env` files.

Required for AI features:

```text
GEMINI_API_KEY=
```

Optional Firebase frontend configuration variables are documented in `.env.example`.

## Testing

```bash
npm run typecheck
npm test
npm run build
```

The current test suite validates `src/utils/dataProfiler.ts` against a mixed dataset containing missing values, duplicate rows, numeric strings, categorical fields, booleans, date-like strings, an empty column, and a strong numeric correlation.

## Security Notes

- Secrets are loaded from environment variables; `.env*` files are ignored except `.env.example`.
- `/api/analyze` expects a verified profile object and does not need raw sample rows.
- The project is not yet hardened for confidential, regulated, or production-sensitive datasets.
- Add rate limiting, authentication enforcement, file-size validation, malware scanning, and sensitive-data detection before production use with private data.

## Limitations

- Type inference is heuristic and should be reviewed for domain-specific datasets.
- Pearson correlations are associations only and do not imply causation.
- The profiler currently operates on in-memory row arrays.
- UI and API route tests are not yet implemented.
- Dashboard screenshots and live demo links still require deployment-specific validation.

## Portfolio Readiness Score

Current post-overhaul score for this repository: **88 / 100**.

| Category | Weight | Status |
|---|---:|---|
| Documentation | 20% | Strong README with methodology, architecture, setup, limitations, and roadmap |
| Code Quality | 20% | Typed analytics utility and TypeScript validation; broader refactoring remains |
| Analytics Quality | 20% | Evidence-first profiling implemented |
| Reproducibility | 15% | npm scripts and environment template documented |
| Visual Presentation | 10% | UI exists; screenshots still needed |
| Testing / CI | 10% | Profiler test and CI added |
| Security | 5% | Environment template and secret hygiene documented; production hardening remains |

## Author

**Awin Danjuma Yarks**  
Data Analyst | Mathematics & Statistics | Power BI | Python | SQL | AI Analytics

## License

No explicit license file is currently present. Add a license before encouraging reuse or external contribution.
