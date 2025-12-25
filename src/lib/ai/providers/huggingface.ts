import { AIProvider } from "./interface";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/";

export class HuggingFaceProvider implements AIProvider {
  private apiKey: string | undefined;
  private textModel: string;
  private embedModel: string;

  constructor(
    apiKey: string | undefined, 
    textModel: string = "mistralai/Mistral-7B-Instruct-v0.3",
    embedModel: string = "sentence-transformers/all-MiniLM-L6-v2"
  ) {
    this.apiKey = apiKey;
    this.textModel = textModel;
    this.embedModel = embedModel;
  }

  private async query(model: string, data: any) {
    if (!this.apiKey) throw new Error("Hugging Face API Key not configured");

    const response = await fetch(`${HUGGING_FACE_API_URL}${model}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
       // Handle loading state
       const errorBody = await response.json().catch(() => ({}));
       if (errorBody?.error?.includes("loading")) {
         throw new Error("Model is loading"); // Can trigger retry logic upstream
       }
       throw new Error(`HF Error ${response.status}: ${JSON.stringify(errorBody)}`);
    }

    return await response.json();
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) return "HuggingFace API Key missing.";

    try {
      // Mistral format: <s>[INST] Instruction [/INST] Model Answer</s>
      const formattedPrompt = systemInstruction 
        ? `<s>[INST] ${systemInstruction}\n\n${prompt} [/INST]`
        : `<s>[INST] ${prompt} [/INST]`;

      const result = await this.query(this.textModel, {
        inputs: formattedPrompt,
        parameters: { max_new_tokens: 512, return_full_text: false },
      });

      if (Array.isArray(result) && result[0]?.generated_text) {
        return result[0].generated_text.trim();
      }
      return "";
    } catch (error) {
      console.error("HF GenerateText Error:", error);
      throw error;
    }
  }

  async generateJSON<T>(prompt: string, schemaDescription: string = ""): Promise<T> {
    // LLMs are not great at strict JSON without guidance, so we prompt heavily
    const jsonInstruction = `You are a strict JSON generator. Output valid JSON only. ${schemaDescription}`;
    const responseText = await this.generateText(prompt, jsonInstruction);
    
    try {
        // Try to find JSON object in text
        const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        const cleanText = jsonMatch ? jsonMatch[0] : responseText;
        return JSON.parse(cleanText);
    } catch (parseError) {
        console.error("HF JSON Parse Error", parseError);
        throw new Error("Failed to parse JSON from HF model");
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.apiKey) return [];
    try {
      const result = await this.query(this.embedModel, {
        inputs: text,
        options: { wait_for_model: true } // Important for embeddings
      });

      // Result is usually a 1D array of numbers for this model, or [1D array] if batched
      if (Array.isArray(result) && typeof result[0] === 'number') {
        return result as number[];
      }
      return [];
    } catch (error) {
      console.error("HF Embed Error:", error);
      return [];
    }
  }
}
