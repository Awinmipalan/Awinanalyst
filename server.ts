import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

// Initialize Gemini API
// It will pick up the API key automatically from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

// Simple retry helper
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 'UNAVAILABLE' || error.message?.includes('503'))) {
      console.log(`Gemini API 503 error, retrying, ${retries} attempts left...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Set up multer for file uploads in memory for small datasets or temp storage
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, contextData, previousMessages } = req.body;
      let prompt = message;
      if (contextData) {
        prompt = `Context Data Summary:\n${contextData}\n\nUser Question: ${message}`;
      }

      // Convert previous messages to contents block if doing manual history, but we'll cheat a bit and just put it in the prompt or use chat initialization.
      // Usually, using chat API is cleaner:
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "You are an elite AI Business Intelligence analyst for 'Awinlytics'. Provide sharp, modern, data-driven insights. Format answers beautifully in Markdown.",
        }
      });

      // If we had actual previous message history we'd seed it, but for now just send the current message with context
      const response = await retryWithBackoff(() => chat.sendMessage({ message: prompt }));

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // Analytics Engine API for automated insights
  app.post("/api/analyze", async (req, res) => {
    try {
      const { summaryProps } = req.body;
      
      const prompt = `Analyze this dataset summary and suggest 3 key insights. Also suggest the best chart type to visualize this data (e.g., 'bar', 'line', 'pie', 'scatter').
Data Summary:
${JSON.stringify(summaryProps, null, 2)}
`;

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    insights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of key insights"
                    },
                    recommendedChartType: {
                        type: Type.STRING,
                        description: "Best chart type for this data (bar, line, pie, scatter)"
                    },
                    executiveSummary: {
                        type: Type.STRING,
                        description: "A short 1-2 sentence executive summary of the data"
                    }
                },
                required: ["insights", "recommendedChartType", "executiveSummary"]
            }
        }
      }));

      const jsonStr = response.text || "{}";
      res.json(JSON.parse(jsonStr));

    } catch (error: any) {
      console.error("Analyze API Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
