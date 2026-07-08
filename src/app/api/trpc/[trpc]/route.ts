import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@/server/trpc/root";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError({ error, path, type }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[trpc] ${type} ${path ?? "<no-path>"} failed:`, error);
      }
    },
  });

export { handler as GET, handler as POST };
