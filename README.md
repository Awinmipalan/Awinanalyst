# 🤖 Awin Analyst

> **AI-powered data analysis workspace for exploring datasets, generating evidence-based insights, and communicating analytical findings in natural language.**

Awin Analyst is an AI-native analytics application that combines a modern web interface with data ingestion, dataset profiling, interactive visualization, and Gemini-powered analytical assistance.

## 🚀 What It Does

```text
Upload Dataset
     ↓
Preview & Explore
     ↓
Local Data Profiling
     ↓
Verified Statistics & Quality Checks
     ↓
Generate Visualizations
     ↓
Gemini Interpretation
     ↓
Executive Insights
     ↓
Ask Follow-up Questions
```

Users can work with supported CSV/JSON datasets, inspect the data, visualize important fields, and use natural language to explore analytical questions.

## 🎯 Project Goal

The goal is to make exploratory data analysis more accessible by combining traditional analytical workflows with an AI assistant while keeping calculations and evidence separate from AI interpretation.

## ✨ Core Features

### 📂 Data Center

- Upload and inspect datasets
- CSV / JSON data support
- Dataset preview and pagination
- Search and exploration
- Local data-quality profiling

### 📐 Evidence-First Analytics

The application calculates verified evidence locally before the AI layer is called:

- Missing-value counts and rates
- Duplicate-row detection
- Column type classification
- Cardinality / uniqueness
- Numeric mean, median, minimum, maximum and standard deviation
- IQR-based outlier counts
- Top categorical values
- Strong Pearson correlations between numeric fields

Raw sample rows are excluded from the `/api/analyze` payload. Gemini receives the compact analytical profile and is instructed to interpret that evidence rather than invent calculations.

### 📊 Interactive Analysis

- Automatic visualization recommendations
- Charts for exploring dataset patterns
- Drill-down style exploration
- Executive-level summaries

### 🧠 AI Analyst

- Natural-language questions about the dataset
- AI-generated executive summaries
- Key analytical insights
- Recommended chart types
- Follow-up analytical conversations

---

## 🏗️ Architecture

```text
                    AWIN ANALYST
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
        DATA CENTER             AI CHAT
              │                     │
        CSV / JSON                User
              ↓                     │
      Local Profiling               │
              ↓                     │
    Verified Evidence ──────────────┘
              ↓
       Gemini Interpretation
              ↓
      Structured AI Output
              ↓
     Insights + Visualizations
```

### Technology Stack

| Technology | Role |
|---|---|
| **React / TypeScript** | Frontend application |
| **Vite** | Development/build tooling |
| **Express** | Backend API |
| **Google Gemini** | AI-powered interpretation and conversation |
| **Recharts** | Data visualization |
| **Firebase** | Application/authentication services where configured |
| **Papa Parse** | CSV parsing |

---

## 🧠 AI Design

The application uses structured Gemini responses rather than relying only on free-form text generation. Analytical responses contain defined fields such as:

- Executive summary
- Key insights
- Recommended visualization

### Evidence Principle

```text
Raw Data
   ↓
Verified Calculation
   ↓
Evidence
   ↓
AI Interpretation
   ↓
Human-readable Insight
```

Gemini is explicitly instructed not to invent values, counts, correlations, or causal claims. Correlations are presented as associations rather than proof of causation.

---

## 🔐 Data & Privacy Considerations

Awin Analyst is an analytical prototype and should not be treated as a secure environment for confidential or regulated data without additional controls.

The application should continue to strengthen:

- Server-side usage limits
- File-size and file-type validation
- Sensitive-data detection
- Privacy controls
- Authentication and authorization
- Audit logging
- Rate limiting
- Robust dataset validation

**Never commit Gemini API keys or other secrets to the repository.** Store them in environment variables and keep local environment files out of version control.

---

## 🛠️ Local Development

### Prerequisites

- Node.js
- npm
- Gemini API credentials for AI features

### Install

```bash
npm install
```

### Configure environment variables

Create the appropriate local environment file and provide your Gemini API credential according to the application's configuration.

Do **not** commit credentials to GitHub.

### Run

```bash
npm run dev
```

### Type-check

```bash
npm run lint
```

---

## 📁 Project Structure

```text
Awinanalyst/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   └── utils/
│       └── dataProfiler.ts
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔮 Roadmap

### Data Quality Engine

- [x] Missing-value profiling
- [x] Duplicate detection
- [x] Type inference
- [x] Cardinality analysis
- [x] Outlier detection
- [x] Numeric descriptive statistics
- [x] Correlation analysis
- [ ] Invalid-value rule engine
- [ ] Automated cleaning suggestions

### Statistical Engine

- [x] Descriptive statistics
- [x] Correlation analysis
- [ ] Distribution analysis
- [ ] Trend detection
- [ ] Anomaly detection
- [ ] Basic regression analysis

### Evidence-backed AI

Every generated insight should ultimately be traceable to:

```text
Insight
  ↓
Evidence
  ↓
Metric
  ↓
Column(s)
  ↓
Calculation
```

---

## 👤 Author

**Awin Danjuma Yarks**  
Data Analyst | Mathematics & Statistics | Power BI | Python | AI Analytics

**GitHub:** https://github.com/Awinmipalan

---

## 📌 Project Status

**Active development / portfolio project.**

Awin Analyst is being developed as an AI-powered analytical workspace combining data analysis, visualization, and natural-language interaction.
