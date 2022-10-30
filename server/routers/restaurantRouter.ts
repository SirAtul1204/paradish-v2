import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateId } from "../../utils/generateId";
import { t } from "../t";
import * as bcrypt from "bcrypt";
import sendEmail, { EmailSubjects } from "../../utils/sendEmail";
import { getHtmlTemplate, HtmlTemplates } from "../../utils/htmlTemplates";
import { prisma } from "../prisma";
import {
  EMPLOYEE_ID_LENGTH,
  EMPLOYEE_TEMPORARY_TOKEN_LENGTH,
} from "../../utils/constants";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { deFormatCategoryName } from "../../utils/deFormatCategoryName";

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
        id = generateId(EMPLOYEE_ID_LENGTH);
      } while (await prisma!.user.findUnique({ where: { id } }));

      const hashedPassword = await bcrypt.hash(input.password, 10);

      let resetPasswordToken = "";
      do {
        resetPasswordToken = generateId(EMPLOYEE_TEMPORARY_TOKEN_LENGTH);
      } while (
        await prisma!.user.findUnique({ where: { resetPasswordToken } })
      );

      const user = await prisma.user.create({
        data: {
          id: id,
          email: input.email,
          password: hashedPassword,
          restaurantId: restaurant.id,
          role: Role.OWNER,
          resetPasswordToken: resetPasswordToken,
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
  getTypes: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: requestor.restaurantId,
      },
    });

    if (!restaurant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Restaurant not found",
      });
    }

    if (!restaurant.categories) return { categories: [] };

    const categories = restaurant.categories.split(",");
    const formattedCategories = categories.map((category) =>
      deFormatCategoryName(category)
    );
    return { categories: formattedCategories };
  }),
});
