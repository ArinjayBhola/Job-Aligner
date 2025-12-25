export interface AIProvider {
  /**
   * Generates text based on a prompt.
   */
  generateText(prompt: string, systemInstruction?: string): Promise<string>;

  /**
   * Generates a structural JSON response.
   * @param schemaDescription Description of the expected JSON structure
   */
  generateJSON<T>(prompt: string, schemaDescription?: string): Promise<T>;

  /**
   * Generates embeddings for a given text.
   * Returns empty array if not supported by provider.
   */
  embed(text: string): Promise<number[]>;
}
