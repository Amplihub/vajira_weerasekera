import { FeedbackNominate } from "@/components/site/feedback/nominate";

export const metadata = { title: "360 Leadership Insight — Nominate Respondents", robots: { index: false } };

export default async function NominatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <FeedbackNominate token={token} />;
}
