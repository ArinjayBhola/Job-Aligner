import { AIService, AIAnalysisResult } from "./service";
import { pipeline } from "@xenova/transformers";
import { cosineSimilarity } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Singleton for the extractor to avoid reloading model
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

export class LocalAIService implements AIService {
  async calculateMatchScore(resumeText: string, jobDescription: string): Promise<number> {
    try {
      const extractor = await getExtractor();
      
      const limit = 1500;
      const resVec = await extractor(resumeText.slice(0, limit), { pooling: "mean", normalize: true });
      const jobVec = await extractor(jobDescription.slice(0, limit), { pooling: "mean", normalize: true });
      
      const score = cosineSimilarity(Array.from(resVec.data), Array.from(jobVec.data));
      return Math.round(((score + 1) / 2) * 100);
    } catch (error) {
      console.error("Embedding Error:", error);
      return 0;
    }
  }

  async generateTailoredResume(resumeText: string, jobDescription: string): Promise<AIAnalysisResult> {
    const score = await this.calculateMatchScore(resumeText, jobDescription);
    
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return {
        score,
        tailoredContent: `### Tailored Resume (Mock)\n\n**Note: Configure GOOGLE_GEMINI_API_KEY to get real generation.**\n\n${resumeText.slice(0, 200)}...`,
        missingKeywords: ["React", "TypeScript", "Next.js"],
      };
    }
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert Resume Tailor. Rewrite the following RESUME to match the JOB DESCRIPTION.
      
      RESUME:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription}

      Output only the rewritten resume in Markdown format.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      return {
        score: Math.min(score + 20, 99),
        tailoredContent: content,
        missingKeywords: ["Calculated dynamically in future"],
      };
    } catch (e) {
      console.error("Gemini Error:", e);
       return {
        score,
        tailoredContent: resumeText,
        missingKeywords: [],
      };
    }
  }
}

export const aiService = new LocalAIService();
