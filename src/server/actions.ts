"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { aiService } from "@/lib/ai/local-service";
import { ratelimit } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function uploadResumeAction(formData: FormData): Promise<ActionResult<string>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const content = formData.get("content") as string;
  const title = formData.get("title") as string || "My Resume";

  if (!content) return { success: false, error: "Resume content is required" };

  try {
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title,
        content,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: resume.id };
  } catch (error) {
    return { success: false, error: "Failed to save resume" };
  }
}

export async function analyzeJobAction(resumeId: string, jobDescription: string): Promise<ActionResult<string>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  // 1. Rate Limit
  const { success: limitSuccess } = await ratelimit.limit(session.user.id);
  // if (!limitSuccess) return { success: false, error: "Rate limit exceeded. Upgrade to Pro." }; 
  // Commented out to avoid blocking dev testing, but logic is here.

  // 2. Decrement Credits (Check)
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.credits <= 0) {
     if (!user?.isPro) return { success: false, error: "No credits remaining. Upgrade to Pro." };
  }

  try {
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) return { success: false, error: "Resume not found" };

    // 3. Create Analysis Record (Pending)
    const analysis = await prisma.jobAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId,
        jobDescription,
        status: "PROCESSING",
      },
    });

    // 4. Trigger AI (Optimistic or Async?)
    // For MVP we await it, but in prod use Inngest/Queue if >10s
    // Xenova is fast-ish for embedding, OpenAI is slow.
    
    const result = await aiService.generateTailoredResume(resume.content, jobDescription);

    await prisma.jobAnalysis.update({
      where: { id: analysis.id },
      data: {
        originalScore: Math.round(result.score * 0.5), // Dummy logic for original vs new
        tailoredScore: result.score,
        tailoredResume: result.tailoredContent,
        analysisReport: result.missingKeywords as any,
        status: "COMPLETED",
      },
    });

    // Decrement credit
    if (!user.isPro) {
      await prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, data: analysis.id };

  } catch (error) {
    console.error(error);
    return { success: false, error: "Analysis failed" };
  }
}

export async function generateInterviewQuestionsAction(resumeText: string, jobDescription: string): Promise<ActionResult<{ question: string; answer: string }[]>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const questions = await aiService.generateInterviewQuestions(resumeText, jobDescription);
    return { success: true, data: questions };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate questions" };
  }
}

export async function getAnalysesAction(): Promise<ActionResult<any[]>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const analyses = await prisma.jobAnalysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { resume: true }
    });
    return { success: true, data: analyses };
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return { success: false, error: "Failed to fetch analyses" };
  }
}

export async function getAnalysisAction(id: string): Promise<ActionResult<any>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const analysis = await prisma.jobAnalysis.findUnique({
      where: { id },
      include: { resume: true }
    });

    if (!analysis) return { success: false, error: "Analysis not found" };
    if (analysis.userId !== session.user.id) return { success: false, error: "Unauthorized" };

    return { success: true, data: analysis };
  } catch (error) {
    console.error("Failed to fetch analysis:", error);
    return { success: false, error: "Failed to fetch analysis" };
  }
}
// --- Job Tracker Actions ---

export async function extractJobDetailsAction(description: string): Promise<ActionResult<any>> {
  // Public wrapper for AI extraction
  try {
    const details = await aiService.extractJobDetails(description);
    return { success: true, data: details };
  } catch (error) {
    return { success: false, error: "Extraction failed" };
  }
}

export async function createJobApplicationAction(data: {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  description?: string;
  status: "WISHLIST" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
}): Promise<ActionResult<any>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Calculate simple fit score (Mock for now, could use AI)
    const fitScore = Math.floor(Math.random() * 30) + 70; // 70-100

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        ...data,
        fitScore,
      },
    });
    revalidatePath("/dashboard/tracker");
    return { success: true, data: application };
  } catch (error) {
    console.error("Create App Error:", error);
    return { success: false, error: "Failed to create application" };
  }
}

export async function updateApplicationStatusAction(id: string, status: "WISHLIST" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"): Promise<ActionResult<any>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const application = await prisma.jobApplication.update({
      where: { id, userId: session.user.id },
      data: { status },
    });
    revalidatePath("/dashboard/tracker");
    return { success: true, data: application };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function getApplicationsAction(): Promise<ActionResult<any[]>> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: applications };
  } catch (error) {
    return { success: false, error: "Failed to fetch applications" };
  }
}

export async function deleteApplicationAction(id: string): Promise<ActionResult<void>> {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Unauthorized" };
  
    try {
      await prisma.jobApplication.delete({
        where: { id, userId: session.user.id },
      });
      revalidatePath("/dashboard/tracker");
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: "Failed to delete" };
    }
  }
