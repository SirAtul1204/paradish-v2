import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { helloRouter } from "../../../server/routers/helloRouter";
import { restaurantRouter } from "../../../server/routers/restaurantRouter";
import { userRouter } from "../../../server/routers/userRouter";
import { t } from "../../../server/t";
import { createContext } from "../../../server/createContext";
import { inventoryRouter } from "../../../server/routers/inventoryRouter";
export const appRouter = t.router({
  hello: helloRouter,
  restaurant: restaurantRouter,
  user: userRouter,
  inventory: inventoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
