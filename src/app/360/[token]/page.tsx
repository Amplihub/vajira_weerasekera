import { FeedbackSurvey } from "@/components/site/feedback/survey";

export const metadata = { title: "360 Leadership Feedback", robots: { index: false } };

export default async function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <FeedbackSurvey token={token} />;
}
