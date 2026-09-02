import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure CORS so Vercel frontend can call this Render backend
  app.use(cors());

  // Parse JSON bodies (limit increased for large resumes)
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const schema = {
        type: Type.OBJECT,
        properties: {
          candidate: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING, description: "Candidate's current or target role" },
              descriptor: { type: Type.STRING, description: "Short professional descriptor" },
              contact: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  github: { type: Type.STRING },
                  portfolio: { type: Type.STRING }
                }
              }
            },
            required: ["name", "role", "descriptor", "contact"]
          },
          overallScore: { type: Type.NUMBER, description: "Score out of 100 based on overall strength" },
          verdict: { type: Type.STRING, description: "Short verdict, e.g., 'Strong Match'" },
          summaryStats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING }
              }
            }
          },
          scoreBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                score: { type: Type.NUMBER },
                note: { type: Type.STRING }
              }
            }
          },
          workHistory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                dates: { type: Type.STRING },
                bullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                quantifiedAchievements: { type: Type.NUMBER, description: "Count of bullet points containing metrics/numbers" }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                dates: { type: Type.STRING }
              }
            }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, description: "e.g., 'Product & Strategy', 'Technical'" },
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          keywordMatches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                requirement: { type: Type.STRING },
                status: { type: Type.STRING, description: "'Found', 'Partially found', or 'Not found'" },
                mentions: { type: Type.NUMBER }
              }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                critical: { type: Type.BOOLEAN }
              }
            }
          }
        },
        required: [
          "candidate", 
          "overallScore", 
          "verdict", 
          "summaryStats", 
          "scoreBreakdown", 
          "workHistory", 
          "education", 
          "skills", 
          "keywordMatches", 
          "recommendations"
        ]
      };

      const prompt = `Analyze the following resume text and provide a structured JSON response matching the schema.
CRITICAL INSTRUCTION: You MUST extract details EXACTLY as they appear in the resume. DO NOT hallucinate, invent, or generate any fake information.
If a contact detail, name, role, or section is missing, return an empty string or empty array. DO NOT use placeholders like "John Doe" or generate fake companies.
For 'overallScore', provide a realistic evaluation out of 100 based on standard industry expectations.
For 'summaryStats', extract 4 accurate metrics from the text (e.g. Total Experience, Skills Matched). Do not invent stats.
For 'scoreBreakdown', provide categories like Keyword Match, ATS Formatting, Experience Relevance.
For 'skills', group ONLY the exact skills found in the text logically. Do not add skills not present.
For 'keywordMatches', infer 5-8 relevant keywords for their target role and check if they are present.
For 'recommendations', provide 2-3 actionable points based on actual weaknesses in the text.
For 'workHistory' and 'education', extract the EXACT details. DO NOT make up companies, roles, or dates.

Resume Text:
${text}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert resume analyst. You must strictly analyze the provided text. NEVER invent, hallucinate, or assume any information not explicitly stated in the provided text.",
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0,
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const result = JSON.parse(jsonStr);

      res.json(result);
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        res.status(429).json({ error: "AI service quota exceeded. Please try again later." });
      } else if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand")) {
        res.status(503).json({ error: "The AI service is currently experiencing high demand. Please try again later." });
      } else {
        console.error("Resume analysis error:", error);
        res.status(500).json({ error: "Failed to analyze resume. Please ensure the document is readable." });
      }
    }
  });

  app.post("/api/compare-resumes", async (req, res) => {
    try {
      const { text1, text2 } = req.body;
      if (!text1 || !text2) {
        return res.status(400).json({ error: "Two resumes must be provided" });
      }
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const schema = {
        type: Type.OBJECT,
        properties: {
          winner: { type: Type.STRING, description: "1, 2, or Tie" },
          overallSummary: { type: Type.STRING },
          resume1Score: { type: Type.NUMBER },
          resume2Score: { type: Type.NUMBER },
          resume1Strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          resume2Strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          comparisonPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                resume1: { type: Type.STRING },
                resume2: { type: Type.STRING },
                winner: { type: Type.STRING, description: "1, 2, or Tie" }
              }
            }
          }
        },
        required: ["winner", "overallSummary", "resume1Score", "resume2Score", "resume1Strengths", "resume2Strengths", "comparisonPoints"]
      };

      const prompt = `Compare these two resumes. Provide an objective, structured comparison based on experience, skills, and formatting.
Resume 1:
${text1}

Resume 2:
${text2}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert technical recruiter comparing two resumes.",
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0,
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        res.status(429).json({ error: "AI service quota exceeded. Please try again later." });
      } else if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("high demand")) {
        res.status(503).json({ error: "The AI service is currently experiencing high demand. Please try again later." });
      } else {
        console.error("Resume comparison error:", error);
        res.status(500).json({ error: "Failed to compare resumes." });
      }
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
