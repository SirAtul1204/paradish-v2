import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { helloRouter } from "../../../server/hello";
import { t } from "../../../server/t";

export const appRouter = t.router({
  hello: helloRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
