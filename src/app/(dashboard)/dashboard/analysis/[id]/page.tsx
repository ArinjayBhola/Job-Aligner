import { AnalysisClient } from "./analysis-client";

export default async function AnalysisResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnalysisClient id={id} />;
}
