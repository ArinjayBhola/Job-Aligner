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
