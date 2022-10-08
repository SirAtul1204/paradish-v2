import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateId } from "../../utils/generateId";
import { t } from "../t";
import * as bcrypt from "bcrypt";
import sendEmail, { EmailSubjects } from "../../utils/sendEmail";
import { getHtmlTemplate, HtmlTemplates } from "../../utils/htmlTemplates";
import { prisma } from "../prisma";

export const restaurantRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const checkUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (checkUser)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });

      const restaurant = await prisma.restaurant.create({
        data: {
          name: input.name,
        },
      });

      if (!restaurant)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant could not be created",
        });

      let id = "";
      do {
        id = generateId(6);
      } while (await prisma!.user.findUnique({ where: { id } }));

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          id: id,
          email: input.email,
          password: hashedPassword,
          restaurantId: restaurant.id,
          role: Role.OWNER,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User could not be created",
        });

      sendEmail({
        subject: EmailSubjects.Register,
        email: input.email,
        restaurantName: input.name,
        htmlTemplate: getHtmlTemplate(HtmlTemplates.REGISTER_RESTAURANT, {
          name: input.name,
        }),
      });

      return {
        restaurant,
        user,
      };
    }),
});
