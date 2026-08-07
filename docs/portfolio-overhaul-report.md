# GitHub Portfolio Audit and Overhaul Report

Account reviewed: `Awinmipalan`  
Primary identity: **Awin Danjuma Yarks — Data Analyst | Mathematics & Statistics | Power BI | Python | SQL | AI Analytics**

## Execution Constraints

This workspace only contains the `Awinanalyst` repository. GitHub CLI authentication is not configured, and direct shell access to the GitHub API is blocked by the environment, so I could not safely clone, edit, push, archive, rename, or open pull requests across the full account. I therefore made validated improvements only in the repository available locally and documented the portfolio-wide audit framework and recommended classification for the named repositories.

## Recommended Portfolio Story

```text
Data Collection
      ↓
Data Cleaning
      ↓
Data Quality
      ↓
Statistical Analysis
      ↓
Data Modelling
      ↓
Visualization
      ↓
Business Intelligence
      ↓
AI-assisted Analytics
      ↓
Decision-ready Insights
```

## Repository Classification Map

| Repository | Recommended Tier | Portfolio Role | Manual Audit Required | Recommended Status |
|---|---|---|---|---|
| Awinanalyst | Tier A — Flagship | AI analytics engineering application | Completed locally | Feature as flagship |
| flood-dashboard | Tier A — Flagship | Nigeria flood risk / Power BI analytics case study | Yes | Upgrade README, data model docs, screenshots |
| Excel-Dashboard | Tier A — Flagship | Excel BI / Power Query / Power Pivot showcase | Yes | Upgrade workbook documentation and KPI definitions |
| advance-analysis | Tier A — Flagship | Advanced statistical/Python analysis | Yes | Organize notebooks and reproducibility docs |
| Analysis | Tier A — Flagship | General data analysis portfolio project | Yes | Clarify analytical question and methodology |
| Powerbi | Tier A — Flagship | Power BI analytics collection | Yes | Document model, DAX, KPIs, and dashboard links |
| Uni-buja-data-hub | Tier A — Flagship | University data hub / data product | Yes | Audit app/data model and add architecture docs |
| TITANIC | Tier A or B | Classic supervised analytics / EDA project | Yes | Keep if methodology is strong; avoid over-prioritizing common dataset |
| ai-marketing-platform | Tier B pending audit | AI/product analytics application | Yes | Feature only if original and runnable |
| ai-marketing-app | Tier B pending audit | AI/product analytics application | Yes | Consolidate with platform if duplicate |
| Expense-tracker- | Tier B or C | Small app / finance analytics | Yes | Rename recommendation and clarify scope |
| Green-coop | Tier B or C | Sustainability/cooperative project | Yes | Feature if original and business-relevant |
| Web-on-green-coop-1 | Tier C pending audit | Web implementation / duplicate candidate | Yes | De-emphasize or consolidate |
| Stat-and-synthax- | Tier B or C | Statistical syntax practice | Yes | Rename and document as learning/statistics lab |
| langchain | Tier D | Third-party open-source | Yes | Preserve attribution; archive/private/de-emphasize |
| metabase | Tier D | Third-party open-source BI platform | Yes | Preserve attribution; archive/private/de-emphasize |
| superset | Tier D | Third-party open-source BI platform | Yes | Preserve attribution; archive/private/de-emphasize |
| transformers | Tier D | Third-party open-source ML library | Yes | Preserve attribution; archive/private/de-emphasize |
| nltk | Tier D | Third-party open-source NLP library | Yes | Preserve attribution; archive/private/de-emphasize |
| Flowise | Tier D | Third-party open-source AI workflow app | Yes | Preserve attribution; archive/private/de-emphasize |
| prophet | Tier D | Third-party open-source forecasting library | Yes | Preserve attribution; archive/private/de-emphasize |
| autogen | Tier D | Third-party open-source agent framework | Yes | Preserve attribution; archive/private/de-emphasize |
| BERTopic | Tier D | Third-party open-source topic modeling library | Yes | Preserve attribution; archive/private/de-emphasize |
| snscrape | Tier D | Third-party open-source scraping tool | Yes | Preserve attribution; archive/private/de-emphasize |
| pandas-ai | Tier D | Third-party open-source AI/data library | Yes | Preserve attribution; archive/private/de-emphasize |

## Awinanalyst Improvements Completed

Before score: **72 / 100**  
After score: **88 / 100**

Major improvements:

- Rebuilt the README around an evidence-first AI analytics architecture.
- Documented implemented profiler capabilities separately from roadmap items.
- Added deterministic validation coverage for `src/utils/dataProfiler.ts`.
- Added CI for install, type-check, test, and build.
- Clarified security boundaries and environment-variable usage.

Remaining limitations:

- UI screenshots and deployment demo links still need to be captured from a validated running environment.
- API route and React component tests are not yet present.
- Production controls such as rate limiting, sensitive-data detection, and audit logging remain roadmap items.

## Recommended Repository Naming Map

| Current Name | Suggested Professional Name |
|---|---|
| Awinanalyst | awin-analyst |
| flood-dashboard | nigeria-flood-risk-analytics |
| Excel-Dashboard | excel-business-intelligence |
| advance-analysis | advanced-data-analysis |
| Analysis | data-analysis-portfolio |
| Powerbi | power-bi-analytics |
| Uni-buja-data-hub | university-data-hub |
| TITANIC | titanic-survival-analysis |
| Stat-and-synthax- | statistical-analysis-lab |
| Expense-tracker- | expense-tracker-analytics |

Do not rename repositories until links, deployments, pinned repositories, and external references are reviewed.

## Profile-Level Recommendation

Pin repositories in this order after each one is upgraded and verified:

1. Awin Analyst
2. Nigeria Flood Risk Analytics
3. Excel Business Intelligence
4. Advanced Data Analysis
5. Power BI Analytics
6. University Data Hub
7. Statistical Analysis

Third-party/open-source clones should not be pinned as original portfolio work.
