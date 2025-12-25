import { AIProvider } from "./providers/interface";
import { GeminiProvider } from "./providers/gemini";
import { HuggingFaceProvider } from "./providers/huggingface";

interface AIConfig {
  geminiKey?: string;
  huggingFaceKey?: string;
}

export class AIOrchestrator {
  private gemini: GeminiProvider;
  private huggingFace: HuggingFaceProvider;

  constructor(config: AIConfig) {
    this.gemini = new GeminiProvider(config.geminiKey);
    this.huggingFace = new HuggingFaceProvider(config.huggingFaceKey);
  }

  /**
   * CRITICAL: Resume Tailoring
   * Strategy: Always use Gemini (Superior instruction following/context win).
   */
  async tailorResume(resume: string, jobDescription: string): Promise<string> {
    const prompt = `You are an expert Resume Tailor. Rewrite the following RESUME to match the JOB DESCRIPTION.
      
      RESUME:
      ${resume}

      JOB DESCRIPTION:
      ${jobDescription}

      Output only the rewritten resume in Markdown format.`;
      
    return this.gemini.generateText(prompt);
  }

  /**
   * CRITICAL: Job Extraction
   * Strategy: Always use Gemini (Better JSON adherence).
   */
  async extractJobDetails(description: string): Promise<any> {
    const prompt = `Extract the following details from the JOB DESCRIPTION.
      
      JOB DESCRIPTION:
      ${description.slice(0, 3000)}

      Return JSON with keys: 'company', 'position', 'location', 'salary'.
      If a field is not found, use "Unknown" or "".
      For salary, provide a range if available.`;
      
    return this.gemini.generateJSON(prompt, "JSON object with keys: company, position, location, salary");
  }

  /**
   * NON-CRITICAL: Interview Questions
   * Strategy: Try Hugging Face (Mistral) first. Fallback to Gemini.
   */
  async generateInterviewQuestions(resume: string, jobDescription: string): Promise<any[]> {
    const prompt = `Generate 5 likely interview questions and concise answers based on the candidate's RESUME and the JOB DESCRIPTION.
      
      RESUME:
      ${resume.slice(0, 1000)}

      JOB DESCRIPTION:
      ${jobDescription.slice(0, 1000)}

      Return the Output as a JSON Array of objects with 'question' and 'answer' keys.`;

    try {
      console.log("Attempting Interview Gen via Hugging Face...");
      return await this.huggingFace.generateJSON(prompt, "Array of objects with question and answer keys");
    } catch (error) {
      console.warn("Hugging Face failed for Interview Questions, falling back to Gemini.", error);
      return await this.gemini.generateJSON(prompt, "Array of objects with question and answer keys");
    }
  }

  /**
   * NON-CRITICAL: Match Score
   * Strategy: Use Hugging Face Embeddings for Cosine Similarity.
   * Fallback: If HF fails, return 0 (or use Gemini embeddings if available/cheap).
   */
  async getEmbedding(text: string): Promise<number[]> {
     try {
       const embedding = await this.huggingFace.embed(text);
       if (embedding.length > 0) return embedding;
       
       console.warn("HF Embedding empty, trying Gemini...");
       return await this.gemini.embed(text);
     } catch (e) {
       console.error("All embedding providers failed", e);
       return [];
     }
  }
}
