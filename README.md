# 🤖 Awin Analyst

> **AI-powered data analysis workspace for exploring datasets, generating evidence-based insights, and communicating analytical findings in natural language.**

Awin Analyst is an AI-native analytics application that combines a modern web interface with data ingestion, dataset profiling, interactive visualization, and Gemini-powered analytical assistance.

## 🚀 What It Does

The application is designed around a simple workflow:

```text
Upload Dataset
     ↓
Preview & Explore
     ↓
Profile the Data
     ↓
Generate Visualizations
     ↓
AI-Assisted Analysis
     ↓
Executive Insights
     ↓
Ask Follow-up Questions
```

Users can work with supported CSV/JSON datasets, inspect the data, visualize important fields, and use natural language to explore analytical questions.

## 🎯 Project Goal

The goal is to make exploratory data analysis more accessible by combining traditional analytical workflows with an AI assistant.

Instead of requiring users to move manually between a spreadsheet, notebook, visualization tool, and AI assistant, Awin Analyst brings these activities into one analytical workspace.

## ✨ Core Features

### 📂 Data Center

- Upload and inspect datasets
- CSV / JSON data support
- Dataset preview and pagination
- Search and exploration
- Basic dataset profiling

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

### 🖥️ Application Experience

- React-based interface
- Dashboard-oriented navigation
- Loading and error states
- Responsive analytical workflow

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
      Dataset Profiling              │
              ↓                     │
       Statistics / Charts           │
              └──────────┬──────────┘
                         ↓
                  Gemini AI Layer
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
| **Google Gemini** | AI-powered analysis and conversation |
| **Recharts** | Data visualization |
| **Firebase** | Application/authentication services where configured |
| **Multer** | File-upload handling |

---

## 🧠 AI Design

The application uses structured Gemini responses rather than relying only on free-form text generation. Analytical responses are represented through defined fields such as:

- Executive summary
- Key insights
- Recommended visualization
- Supporting analytical content

This makes the AI output easier for the frontend to render consistently.

### Important Design Principle

The long-term architecture is to keep **calculation and evidence generation separate from AI interpretation**:

```text
Raw Data
   ↓
Verified Data Profiling
   ↓
Statistical Calculations
   ↓
Evidence / Metrics
   ↓
Gemini Interpretation
   ↓
Human-readable Insights
```

This reduces the risk of treating an AI-generated statement as a verified calculation.

---

## 🔐 Data & Privacy Considerations

Awin Analyst is designed as an analytical prototype and should not be treated as a secure environment for confidential or regulated data without additional controls.

Before production use, the application should implement or strengthen:

- Server-side usage limits
- File-size and file-type validation
- Sensitive-data detection
- Privacy controls
- Secure API-key management
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

---

## 📁 Recommended Project Structure

```text
Awinanalyst/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔮 Roadmap

The next stage of Awin Analyst is to evolve from AI-assisted exploration into a more rigorous analytical engine.

### Data Quality Engine

- Missing-value profiling
- Duplicate detection
- Type inference
- Cardinality analysis
- Outlier detection
- Invalid-value detection

### Statistical Engine

- Descriptive statistics
- Distribution analysis
- Correlation analysis
- Trend detection
- Anomaly detection
- Basic regression analysis

### Evidence-backed AI

Every generated insight should be traceable to:

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

This is the direction required to make the platform useful for serious analytical work rather than simply generating attractive AI summaries.

---

## 👤 Author

**Awin Danjuma Yarks**  
Data Analyst | Mathematics & Statistics | Power BI | Python | AI Analytics

**GitHub:** https://github.com/Awinmipalan

---

## 📌 Project Status

**Active development / portfolio project.**

Awin Analyst is being developed as an AI-powered analytical workspace combining data analysis, visualization, and natural-language interaction.
