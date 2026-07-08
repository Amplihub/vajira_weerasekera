import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — Vajira Weerasekera",
  description: "Terms & Conditions governing coaching services provided through this website.",
};

const sections: LegalSection[] = [
  {
    heading: "1. Coaching Services",
    blocks: [
      "1.1 The services offered through this website are professional coaching services designed to support leadership development, decision-making, performance, reflection, and personal effectiveness.",
      "1.2 Coaching is not psychological therapy, counselling, medical advice, legal advice, financial advice, or crisis support. If you require support in any of those areas, you should seek an appropriately qualified professional.",
    ],
  },
  {
    heading: "2. Client Responsibility",
    blocks: [
      "2.1 You acknowledge that coaching is a collaborative process and that you remain solely responsible for your decisions, actions, and results arising from the coaching engagement.",
      "2.2 No guarantee is given regarding any particular outcome, business result, promotion, performance improvement, or personal result.",
    ],
  },
  {
    heading: "3. Applications and Acceptance",
    blocks: [
      "3.1 Submission of an application through this website does not automatically create a coaching engagement. Applications may be reviewed to determine fit, availability, and scope.",
      "3.2 A coaching engagement begins only once it has been confirmed by Vajira Weerasekera in writing.",
    ],
  },
  {
    heading: "4. Fees and Payment",
    blocks: [
      "4.1 Fees for coaching services will be as stated on the website, proposal, invoice, or other written communication at the time of engagement.",
      "4.2 Unless otherwise agreed in writing, payment must be made before the relevant session or program begins.",
      "4.3 All prices are stated in USD.",
    ],
  },
  {
    heading: "5. Rescheduling and Cancellations",
    blocks: [
      "5.1 If you need to reschedule a session, at least 24 hours' notice is requested.",
      "5.2 Sessions cancelled or missed with less than 24 hours' notice may be treated as forfeited, except where otherwise agreed at discretion.",
      "5.3 Where a program includes multiple sessions, unused sessions may expire at the end of the engagement period unless otherwise agreed in writing.",
    ],
  },
  {
    heading: "6. Communications and Marketing Consent",
    blocks: [
      "6.1 When you submit a form on this website and provide your phone number, you agree to receive text messages and phone calls from Vajira Weerasekera, including marketing communications, at the number provided.",
      "6.2 You can opt out of these communications at any time by replying STOP to any text message, or by contacting Vajira Weerasekera at vajira@weerasekera.net.",
      "6.3 Message and data rates may apply.",
    ],
  },
  {
    heading: "7. Confidentiality",
    blocks: [
      "7.1 Information shared during coaching sessions will be treated as confidential and will not be intentionally disclosed to third parties, except:",
      {
        bullets: [
          "where required by law,",
          "where there is a serious risk of harm,",
          "where disclosure is necessary to protect legal rights, or",
          "where you have provided consent.",
        ],
      },
    ],
  },
  {
    heading: "8. Notes, Recordings, and Session Capture",
    blocks: [
      "8.1 To support the coaching process, Vajira Weerasekera may create and retain handwritten notes, typed notes, session summaries, action points, and related coaching records.",
      "8.2 With your consent, sessions may also be recorded or captured using audio recording, transcription tools, or AI-assisted summarisation tools for the purpose of supporting reflection, continuity, and mutual understanding.",
      "8.3 No session recording will be made without your consent.",
    ],
  },
  {
    heading: "9. AI-Assisted Summaries",
    blocks: [
      "9.1 Where consent is provided, AI tools may be used to help transcribe, organise, or summarise coaching discussions and notes.",
      "9.2 These tools are used to support the coaching process, reduce administrative burden, and improve continuity between sessions.",
      "9.3 AI-generated summaries may contain errors and should be treated as support material only, not as a verbatim record.",
    ],
  },
  {
    heading: "10. Personal Information",
    blocks: [
      "10.1 Personal information submitted through this website or during the coaching engagement may be collected, stored, and used for purposes including:",
      {
        bullets: [
          "reviewing your application,",
          "communicating with you,",
          "managing your coaching engagement,",
          "maintaining session notes and summaries,",
          "scheduling and administration, and",
          "improving service quality.",
        ],
      },
      "10.2 Your personal information is handled in accordance with the Privacy Policy published on this website.",
    ],
  },
  {
    heading: "11. Intellectual Property",
    blocks: [
      "11.1 Any frameworks, tools, worksheets, written materials, assessments, or resources provided as part of the coaching engagement remain the intellectual property of Vajira Weerasekera unless otherwise stated.",
      "11.2 They are provided for your personal or internal professional use only and may not be copied, resold, republished, or distributed without prior written permission.",
    ],
  },
  {
    heading: "12. Website and Service Availability",
    blocks: [
      "12.1 Reasonable efforts will be made to maintain the availability of this website and related systems. However, uninterrupted access is not guaranteed.",
      "12.2 Services may be updated, rescheduled, suspended, or withdrawn where reasonably necessary.",
    ],
  },
  {
    heading: "13. Limitation of Liability",
    blocks: [
      "13.1 To the maximum extent permitted by law, Vajira Weerasekera is not liable for any indirect, consequential, special, or incidental loss arising out of or connected with the coaching services or use of this website.",
      "13.2 You acknowledge that all decisions and actions taken after coaching sessions remain your responsibility.",
      "13.3 Nothing in these Terms excludes any rights that cannot lawfully be excluded under Australian law.",
    ],
  },
  {
    heading: "14. Governing Law",
    blocks: ["14.1 These Terms & Conditions are governed by the laws of New South Wales, Australia."],
  },
  {
    heading: "15. Contact",
    blocks: [
      "15.1 For questions regarding these Terms & Conditions, please contact:",
      "Vajira Weerasekera",
      "ABN: 15 379 487 873",
      "Contact Email: vajira@weerasekera.net",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Coaching Terms & Conditions"
      meta={[
        "Last updated: May 2026",
        "Effective date: May 2026",
        "ABN: 15 379 487 873",
        "Contact Email: vajira@weerasekera.net",
      ]}
      intro={[
        "These Terms & Conditions govern the coaching services provided through this website and any related coaching engagements, programs, sessions, and communications.",
        "By submitting an application, booking a session, or participating in any coaching service, you agree to these Terms & Conditions.",
      ]}
      sections={sections}
    />
  );
}
