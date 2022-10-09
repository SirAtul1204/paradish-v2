import { t } from "../t";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";
import { setCookie } from "cookies-next";

export const userRouter = t.router({
  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const passwordMatch = await bcrypt.compare(input.password, user.password);

      if (!passwordMatch)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email or password is incorrect",
        });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      setCookie("user-token", token, {
        req: ctx.req,
        res: ctx.res,
        httpOnly: true,
      });

      return {
        message: "Login successful",
      };
    }),
});
