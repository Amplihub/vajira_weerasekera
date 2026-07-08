import { createTRPCRouter, publicProcedure } from "../trpc";
import { insightsRouter } from "./insights";
import { applicationsRouter } from "./applications";
import { coachingRouter } from "./coaching";
import { cyclesRouter } from "./cycles";
import { feedbackPublicRouter } from "./feedback-public";
import { emailLogsRouter } from "./email-logs";
import { clarityMapRouter } from "./clarity-map";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ ok: true, ts: Date.now() })),
  insights: insightsRouter,
  applications: applicationsRouter,
  coaching: coachingRouter,
  cycles: cyclesRouter,
  feedback: feedbackPublicRouter,
  emailLogs: emailLogsRouter,
  clarityMap: clarityMapRouter,
});

export type AppRouter = typeof appRouter;
