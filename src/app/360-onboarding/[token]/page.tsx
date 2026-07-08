import { FeedbackOnboarding } from "@/components/site/feedback/onboarding";

export const metadata = { title: "360 Leadership Insight — Confirm Participation", robots: { index: false } };

export default async function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <FeedbackOnboarding token={token} />;
}
