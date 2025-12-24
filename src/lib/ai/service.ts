export interface AIAnalysisResult {
  score: number;
  tailoredContent: string; // Markdown
  missingKeywords: string[];
}

export interface AIService {
  /**
   * Fast local check to get a baseline score.
   */
  calculateMatchScore(resumeText: string, jobDescription: string): Promise<number>;
  
  /**
   * Generates a tailored resume and detailed report.
   */
  generateTailoredResume(resumeText: string, jobDescription: string): Promise<AIAnalysisResult>;
}
