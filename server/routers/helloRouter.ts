import { z } from "zod";
import { t } from "../t";

export const helloRouter = t.router({
  world: t.procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? "mvadmvsnvj"}`,
      };
    }),
});
