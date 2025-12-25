import { AIService, AIAnalysisResult } from "./service";
import { cosineSimilarity } from "@/lib/utils";
import { AIOrchestrator } from "./orchestrator";

// Initialize Orchestrator securely on server-side
const orchestrator = new AIOrchestrator({
  geminiKey: process.env.GOOGLE_GEMINI_API_KEY,
  huggingFaceKey: process.env.HUGGINGFACE_API_KEY,
});

export class HybridAIService implements AIService {
  
  async calculateMatchScore(resumeText: string, jobDescription: string): Promise<number> {
    try {
       // Truncate to avoid token limits for basic embedding
       const limit = 1000; 
       const [resVec, jobVec] = await Promise.all([
         orchestrator.getEmbedding(resumeText.slice(0, limit)),
         orchestrator.getEmbedding(jobDescription.slice(0, limit))
       ]);

       if (resVec.length === 0 || jobVec.length === 0) return 0;

       const score = cosineSimilarity(resVec, jobVec);
       return Math.round(((score + 1) / 2) * 100);
    } catch (error) {
      console.error("Match Score Error:", error);
      return 0;
    }
  }

  async generateTailoredResume(resumeText: string, jobDescription: string): Promise<AIAnalysisResult> {
    // Parallelize score calculation and tailoring for speed
    const scorePromise = this.calculateMatchScore(resumeText, jobDescription);
    const contentPromise = orchestrator.tailorResume(resumeText, jobDescription);

    const [score, tailoredContent] = await Promise.all([scorePromise, contentPromise]);

    return {
      score: Math.min(score + 15, 99), // Boost score for tailored version
      tailoredContent,
      missingKeywords: [], // Future implementation
    };
  }

  async generateInterviewQuestions(resumeText: string, jobDescription: string): Promise<{ question: string; answer: string }[]> {
    return await orchestrator.generateInterviewQuestions(resumeText, jobDescription);
  }

  async extractJobDetails(description: string): Promise<{ company: string; position: string; location: string; salary: string }> {
    return await orchestrator.extractJobDetails(description);
  }
}

// Export singleton
export const aiService = new HybridAIService();
