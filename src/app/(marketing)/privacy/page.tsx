import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Vajira Weerasekera",
  description: "How Vajira Weerasekera collects, uses, shares, and protects your personal information.",
};

const sections: LegalSection[] = [
  {
    heading: "1. Introduction",
    blocks: [
      'This Privacy Policy explains how Vajira Weerasekera (ABN 15 379 487 873) ("we", "us", or "our") collects, uses, shares, and protects your personal information when you visit https://vajiraweerasekera.com (the "website") or submit a form to request a one-to-one call.',
      "By using the website or submitting your information through our forms, you confirm that you have read and understood this policy. If you do not agree with it, please do not use the site or submit your details.",
    ],
  },
  {
    heading: "2. Information We Collect",
    blocks: [
      "2.1 Information you provide directly",
      "When you complete our booking form to request a one-to-one call, we collect the following:",
      {
        bullets: [
          "Full name. Provided in the name field (required).",
          "Email address. Provided in the email field (required).",
          "Phone number. Provided in the phone field (required), used to contact you and, where you consent, to send text messages and phone calls.",
          "Job title. Provided in the job title field (optional).",
          'Your leadership challenge. Your free-text response to "What is your biggest leadership challenge right now?" (optional). You control what you include here, so please avoid sharing sensitive or confidential information you would not want recorded.',
          "Consent record. A record of the consent box you tick, including the date and time, so we can demonstrate that consent was given.",
        ],
      },
      "2.2 Information collected automatically",
      "When you browse the website, we and our service providers may automatically collect technical information such as your IP address, browser type, device type, pages viewed, time spent on the site, and the page that referred you. This is collected through cookies and similar technologies.",
    ],
  },
  {
    heading: "3. How We Use Your Information",
    blocks: [
      "We use the information described above to:",
      {
        bullets: [
          "Respond to your enquiry and schedule your one-to-one call.",
          "Provide information about coaching, the Emerging Executives Program, speaking, executive offsites, and related services.",
          "Send you marketing communications by email, text message, and phone where you have given consent.",
          "Operate, maintain, secure, and improve the website.",
          "Keep records and comply with our legal obligations.",
        ],
      },
    ],
  },
  {
    heading: "4. Legal Bases for Processing",
    blocks: [
      "For visitors in the United Kingdom and the European Economic Area, we rely on the following legal bases under the UK GDPR and EU GDPR:",
      {
        bullets: [
          "Consent. For marketing emails, text messages, phone calls, and non-essential cookies. You can withdraw consent at any time.",
          "Performance of a contract or steps before a contract. To respond to your booking request and arrange your call.",
          "Legitimate interests. To operate, secure, and improve our services, balanced against your rights and freedoms.",
          "Legal obligation. Where we are required by law to retain or disclose information.",
        ],
      },
    ],
  },
  {
    heading: "5. Text Messages, Phone Calls, and Marketing",
    blocks: [
      "By submitting the form and ticking the consent box, you agree to receive marketing text messages and phone calls from Vajira Weerasekera at the number you provide, including messages sent using automated technology. Providing consent is not a condition of receiving any service.",
      {
        bullets: [
          "Message frequency varies.",
          "Message and data rates may apply.",
          "Reply STOP to any text message to opt out at any time. Reply HELP for help. You can also opt out by emailing vajira@weerasekera.net.",
          "We do not sell, rent, or share your mobile phone number, text-message consent, or call consent with third parties or affiliates for their own marketing purposes.",
          "Every marketing email we send includes an unsubscribe link. You can opt out of email at any time.",
        ],
      },
    ],
  },
  {
    heading: "6. Cookies and Similar Technologies",
    blocks: [
      "Cookies are small files placed on your device that help a website function and help us understand how it is used.",
    ],
  },
  {
    heading: "7. How We Share Your Information",
    blocks: [
      "We do not sell your personal information. We share it only in the following circumstances:",
      {
        bullets: [
          "Service providers. Companies that process information on our behalf under contract. These include HighLevel, Inc. (GoHighLevel), the customer relationship management and marketing platform that stores your form submissions and powers our email, text-message, and scheduling functions; [our scheduling or calendar tool, if separate]; and [our analytics provider, if any].",
          "Professional advisers. Such as legal or accounting advisers, where reasonably necessary.",
          "Legal and safety. Where required by law, regulation, legal process, or to protect our rights, property, or safety, or those of others.",
          "Business transfers. If the business is involved in a merger, acquisition, or sale of assets, your information may be transferred to the successor entity.",
        ],
      },
    ],
  },
  {
    heading: "8. International Data Transfers",
    blocks: [
      "Some of our service providers, including GoHighLevel, are based in the United States. This means your personal information may be transferred to, stored in, and processed in countries outside Australia, including the United States, whose data protection laws may differ from those where you live. Where required, we take reasonable steps to ensure your information is handled consistently with this policy and applicable law.",
    ],
  },
  {
    heading: "9. Data Retention",
    blocks: [
      "We keep your personal information only for as long as necessary to fulfil the purposes set out in this policy, to comply with our legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    heading: "10. Data Security",
    blocks: [
      "We use reasonable technical and organisational measures to protect your personal information against loss, misuse, and unauthorised access. No method of transmission over the internet or method of electronic storage is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "11. Your Privacy Rights",
    blocks: [
      "11.1 Australia",
      "As an Australian business, we handle personal information in line with the Privacy Act 1988 (Cth) and the Australian Privacy Principles. You have the right to:",
      {
        bullets: [
          "Request access to the personal information we hold about you.",
          "Request correction of information that is inaccurate, out of date, incomplete, or misleading.",
          "Ask how we collect, use, and disclose your information.",
          "Opt out of marketing communications at any time.",
          "Make a complaint about how we have handled your information. If you are not satisfied with our response, you can contact the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.",
        ],
      },
      "11.2 United Kingdom and European Economic Area",
      "If you are in the UK or EEA, you have the right to:",
      {
        bullets: [
          "Access the personal information we hold about you.",
          "Request correction of inaccurate information.",
          "Request erasure of your information in certain circumstances.",
          "Request that we restrict or object to certain processing.",
          "Request portability of information you provided to us.",
          "Withdraw consent at any time, without affecting processing already carried out.",
          "Lodge a complaint with your local data protection authority.",
        ],
      },
      "11.3 California residents",
      "If you are a California resident, you have the right to:",
      {
        bullets: [
          "Know what personal information we collect, use, and disclose.",
          "Request access to and deletion or correction of your personal information.",
          "Opt out of the sale or sharing of personal information. We do not sell or share personal information as those terms are defined under California law.",
          "Limit the use of sensitive personal information.",
          "Not be discriminated against for exercising your rights.",
        ],
      },
      "11.4 How to exercise your rights",
      "To make any request, email us at vajira@weerasekera.net. We will respond within the timeframe required by applicable law. We may need to verify your identity before acting on a request.",
    ],
  },
  {
    heading: "12. Children's Privacy",
    blocks: [
      "The website and our services are intended for working professionals and are not directed to anyone under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with information, please contact us so we can delete it.",
    ],
  },
  {
    heading: "13. Third-Party Links",
    blocks: [
      "The website may contain links to external sites, such as LinkedIn, book retailers, or podcast platforms. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies.",
    ],
  },
  {
    heading: "14. Changes to This Policy",
    blocks: [
      'We may update this Privacy Policy from time to time. When we make material changes, we will post the updated policy on this page and revise the "Last updated" date above. We encourage you to review it periodically.',
    ],
  },
  {
    heading: "15. Contact Us",
    blocks: [
      "For privacy-related questions or requests, please contact:",
      "Vajira Weerasekera",
      "ABN: 15 379 487 873",
      "Email: vajira@weerasekera.net",
      "Governing law: Australia",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      meta={["Last updated: May 2026", "Effective date: May 2026"]}
      intro={[]}
      sections={sections}
    />
  );
}
