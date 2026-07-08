import { config } from "dotenv";
config({ path: ".env.local" });

import { storage } from "../lib/queries";
import { generateToken, tokenExpiry } from "../lib/tokens";

// Seed test data for end-to-end flow testing. Run: npm run db:seed
async function main() {
  console.log("Seeding…");

  // ── Coaching clients ──
  const c1 = await storage.findOrCreateContact("hassanurrahmaan2@gmail.com", {
    fullName: "Hassan Test",
    company: "Acme Corp",
    roleTitle: "VP Engineering",
  });
  const client1 = await storage.createCoachingClient({
    contactId: c1.id,
    coachingType: "10-Month Program",
    status: "Active",
    primaryGoals: "Lead a larger org, clearer decisions under pressure.",
  });

  const c2 = await storage.findOrCreateContact("idk131989@gmail.com", {
    fullName: "Riley Test",
    company: "Globex",
    roleTitle: "Director of Product",
  });
  await storage.createCoachingClient({
    contactId: c2.id,
    coachingType: "4-Month Program",
    status: "Prospect",
  });

  // ── A session note for client 1 ──
  await storage.createSessionNote({
    coachingClientId: client1.id,
    sessionDate: new Date(),
    sessionTitle: "Kickoff session",
    sessionNumber: 1,
    noteSource: "Live Notes",
    sessionFormat: "Zoom",
    keyThemesDiscussed: "Role transition, delegation, decision cadence.",
    plaudTranscriptText:
      "Coach: What's the biggest pressure right now? Client: Scaling the team while shipping. I keep getting pulled into the detail.",
  });

  // ── Insight (published) ──
  await storage.createInsight({
    title: "Leading Under Pressure",
    slug: "leading-under-pressure",
    excerpt: "Why the calls that hold up come from the environment a leader builds.",
    body: "# Leading Under Pressure\n\nResults come from the environment a leader builds, not the pressure they apply.\n\nThree decades of high-stakes calls taught one thing: clarity beats noise.",
    author: "Vajira Weerasekera",
    status: "published",
    publishedAt: new Date(),
    category: "Leadership",
    readTime: "4 min",
  });

  // ── Application (GHL-style submission) ──
  await storage.upsertFormSubmission({
    ghlSubmissionId: "seed-" + Date.now(),
    formType: "coaching_application",
    fullName: "Jordan Lee",
    email: "jordan.lee@example.com",
    company: "Initech",
    role: "Head of Engineering",
    message: "Navigating a reorg and want sharper judgment under pressure.",
    rawPayload: { source: "seed" },
  });

  // ── 360 cycle for client 1 + respondents (tokens ready) ──
  const cycle = await storage.createFeedbackCycle({
    coachingClientId: client1.id,
    title: "Hassan — 360 Leadership Insight",
    status: "active",
  });
  const respondents = [
    { fullName: "Hassan Test", email: "hassanurrahmaan2@gmail.com", relationship: "Self", isSelf: true },
    { fullName: "Sam Manager", email: "manager@example.com", relationship: "Manager", isSelf: false },
    { fullName: "Pat Peer", email: "peer@example.com", relationship: "Peer", isSelf: false },
    { fullName: "Dev Report", email: "report@example.com", relationship: "Direct Report", isSelf: false },
  ];
  for (const r of respondents) {
    await storage.createFeedbackRespondent({
      cycleId: cycle.id,
      fullName: r.fullName,
      email: r.email,
      relationship: r.relationship,
      token: generateToken(),
      tokenExpiresAt: tokenExpiry(21),
      status: "pending",
      isSelf: r.isSelf,
    });
  }

  console.log("✓ Seeded: 2 clients, 1 session note, 1 insight, 1 application, 1 360 cycle with 4 respondents.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
