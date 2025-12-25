import { AIProvider } from "./interface";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor(apiKey: string | undefined, modelName: string = "gemini-2.0-flash") {
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
    this.modelName = modelName;
  }

  private getModel() {
    if (!this.client) throw new Error("Google Gemini API Key not configured");
    return this.client.getGenerativeModel({ model: this.modelName });
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.client) return "Gemini API Key missing.";
    try {
      const model = this.getModel();
      // Note: Gemini 1.5/2.0 supports system instructions via config but keeping it simple for now by prepending
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini GenerateText Error:", error);
      throw error;
    }
  }

  async generateJSON<T>(prompt: string, schemaDescription: string = ""): Promise<T> {
    if (!this.client) return {} as T;
    try {
      const model = this.getModel();
      const jsonPrompt = `${prompt}\n\nOutput ONLY a valid JSON object matching this description: ${schemaDescription}. Do not use markdown code blocks.`;
      
      const result = await model.generateContent(jsonPrompt);
      const response = await result.response;
      let text = response.text();
      
      // Sanitization
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      return JSON.parse(text) as T;
    } catch (error) {
      console.error("Gemini GenerateJSON Error:", error);
      throw error;
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.client) return [];
    try {
      const model = this.client.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error("Gemini Embed Error:", error);
      return [];
    }
  }
}
