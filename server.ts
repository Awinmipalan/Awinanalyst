import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it securely.");
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try { return await fn(); }
  catch (error: any) {
    if (retries > 0 && (error.status === "UNAVAILABLE" || error.message?.includes("503"))) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, contextData } = req.body;
      if (typeof message !== "string" || !message.trim()) return res.status(400).json({ error: "A message is required." });
      const prompt = contextData ? `Context Data Summary:\n${contextData}\n\nUser Question: ${message}` : message;
      const chat = getAI().chats.create({
        model: "gemini-2.5-flash",
        config: { systemInstruction: "You are an evidence-first Business Intelligence analyst. Never invent statistics and distinguish association from causation. Format answers beautifully in Markdown." }
      });
      const response = await retryWithBackoff(() => chat.sendMessage({ message: prompt }));
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { summaryProps } = req.body;
      if (!summaryProps || typeof summaryProps !== "object") return res.status(400).json({ error: "A verified dataset profile is required." });
      const prompt = `You are an evidence-first data analyst. Interpret the verified dataset profile below. Do not invent values, counts, correlations, or causal claims. Use only the supplied evidence. Return 3 concise, decision-useful insights and one appropriate chart type. Correlation means association, not causation.\n\nVerified dataset profile:\n${JSON.stringify(summaryProps, null, 2)}`;
      const response = await retryWithBackoff(() => getAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of evidence-backed key insights" },
              recommendedChartType: { type: Type.STRING, description: "Best chart type for this evidence" },
              executiveSummary: { type: Type.STRING, description: "A short evidence-backed executive summary" }
            },
            required: ["insights", "recommendedChartType", "executiveSummary"]
          }
        }
      }));
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Analyze API Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}
startServer().catch(console.error);
