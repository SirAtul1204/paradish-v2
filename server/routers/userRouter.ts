import { t } from "../t";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jose from "jose";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";
import { setCookie } from "cookies-next";
import { secretKey } from "../../utils/key";
import { Role } from "@prisma/client";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { generateId } from "../../utils/generateId";
import { DateTime } from "luxon";
import { getSignedUrlForProfilePic } from "../../utils/aws";
import {
  EMPLOYEE_ID_LENGTH,
  EMPLOYEE_TEMPORARY_TOKEN_LENGTH,
} from "../../utils/constants";
import sendEmail, { EmailSubjects } from "../../utils/sendEmail";
import { getHtmlTemplate, HtmlTemplates } from "../../utils/htmlTemplates";

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

      const token = await new jose.SignJWT({
        id: user.id,
        role: user.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);

      setCookie("user-token", token, {
        req: ctx.req,
        res: ctx.res,
        httpOnly: true,
      });

      return {
        message: "Login successful",
      };
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    // console.log(payload);

    const requestor = await getRequestor(payload);
    // console.log({ requestor });

    if (requestor.role === Role.OWNER || requestor.role === Role.MANAGER) {
      const users: any = await prisma.user.findMany({
        where: {
          restaurantId: requestor.restaurantId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          aadharNumber: true,
          phone: true,
          address: true,
          panNumber: true,
          photo: true,
          dob: true,
          doj: true,
          salary: true,
        },
      });

      return users;
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource.",
      });
    }
  }),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        role: z.enum([Role.OWNER, Role.MANAGER, Role.WAITER, Role.CHEF]),
        aadharNumber: z.string(),
        phone: z.string(),
        address: z.string(),
        panNumber: z.string(),
        extension: z.string(),
        dob: z.string(),
        doj: z.string(),
        salary: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);
      if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const password = await generateId(EMPLOYEE_TEMPORARY_TOKEN_LENGTH);
      const hashedPassword = await bcrypt.hash(password, 10);
      let id = "";
      do {
        id = generateId(EMPLOYEE_ID_LENGTH);
      } while (await prisma!.user.findUnique({ where: { id } }));

      let resetPasswordToken = "";

      do {
        resetPasswordToken = generateId(EMPLOYEE_TEMPORARY_TOKEN_LENGTH);
      } while (
        await prisma!.user.findUnique({ where: { resetPasswordToken } })
      );

      const newUser = await prisma.user.create({
        data: {
          id,
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          aadharNumber: input.aadharNumber,
          phone: input.phone,
          address: input.address,
          panNumber: input.panNumber,
          restaurantId: requestor.restaurantId,
          dob: input.dob,
          doj: input.doj,
          salary: input.salary,
          resetPasswordToken: resetPasswordToken,
          photo: `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env
            .AWS_S3_REGION!}.amazonaws.com/profile_pictures/${id}.${
            input.extension
          }`,
        },
      });

      if (!newUser)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });

      const restaurant = await prisma.restaurant.findUnique({
        where: {
          id: requestor.restaurantId,
        },
      });

      if (!restaurant)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });

      sendEmail({
        email: input.email,
        subject: EmailSubjects.GetPassword,
        name: input.name,
        restaurantName: restaurant.name,
        htmlTemplate: getHtmlTemplate(HtmlTemplates.REGISTER_EMPLOYEE, {
          name: input.name,
          restaurantName: restaurant.name,
          token: resetPasswordToken,
        }),
      });

      return {
        message: "User created successfully",
        signedUrl: await getSignedUrlForProfilePic(id, input.extension),
      };
    }),
  signOut: t.procedure.mutation(async ({ ctx }) => {
    setCookie("user-token", "", {
      req: ctx.req,
      res: ctx.res,
      httpOnly: true,
    });
  }),
  deleteUser: t.procedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);
      if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      const ids = input.ids.filter((id) => id !== requestor.id);

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      const eligibleForDeletion = users.filter((user) => {
        if (user.role === Role.OWNER) {
          return false;
        } else if (user.role === Role.MANAGER) {
          return requestor.role === Role.OWNER;
        } else {
          return true;
        }
      });

      const eligibleIds = eligibleForDeletion.map((user) => user.id);

      await prisma.user.deleteMany({
        where: {
          id: {
            in: eligibleIds,
          },
        },
      });

      return {
        message: "Eligible users deleted successfully",
      };
    }),
  updatePassword: t.procedure
    .input(
      z.object({
        tempToken: z.string().length(EMPLOYEE_TEMPORARY_TOKEN_LENGTH),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({
        where: {
          resetPasswordToken: input.tempToken,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const hashedPassword = await bcrypt.hash(input.password, 10);

      let newResetPasswordToken = "";
      do {
        newResetPasswordToken = generateId(EMPLOYEE_TEMPORARY_TOKEN_LENGTH);
      } while (
        await prisma.user.findUnique({
          where: { resetPasswordToken: newResetPasswordToken },
        })
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          resetPasswordToken: newResetPasswordToken,
        },
      });

      return {
        message: "Password updated successfully",
      };
    }),
  getById: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);
      if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      if (user.restaurantId !== requestor.restaurantId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      return user;
    }),
  updateUser: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([Role.OWNER, Role.MANAGER, Role.CHEF, Role.WAITER]),
        address: z.string(),
        aadharNumber: z.string(),
        panNumber: z.string(),
        extension: z.string().optional(),
        phone: z.string(),
        dob: z.string(),
        doj: z.string(),
        salary: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);
      if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER))
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      const user = await prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      if (user.restaurantId !== requestor.restaurantId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource.",
        });

      if (user.role === Role.OWNER && input.role !== Role.OWNER)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to change the role of the owner.",
        });

      if (requestor.role === Role.MANAGER && input.role === Role.OWNER)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to promote anyone to owner",
        });

      if (input.extension) {
        await prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            role: input.role,
            address: input.address,
            aadharNumber: input.aadharNumber,
            panNumber: input.panNumber,
            photo: `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env
              .AWS_S3_REGION!}.amazonaws.com/profile_pictures/${input.id}.${
              input.extension
            }`,
            phone: input.phone,
            dob: input.dob,
            doj: input.doj,
            salary: input.salary,
          },
        });

        return {
          message: "User updated successfully",
          signedUrl: await getSignedUrlForProfilePic(input.id, input.extension),
        };
      } else {
        await prisma.user.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            role: input.role,
            address: input.address,
            aadharNumber: input.aadharNumber,
            panNumber: input.panNumber,
            phone: input.phone,
            dob: input.dob,
            doj: input.doj,
            salary: input.salary,
          },
        });

        return {
          message: "User updated successfully",
        };
      }
    }),
  isAuthenticated: t.procedure.query(async ({ ctx }) => {
    if (!ctx.req.cookies["user-token"]) return { isAuthenticated: false };

    const { payload } = await jose.jwtVerify(
      ctx.req.cookies["user-token"],
      secretKey
    );

    if (!payload) return { isAuthenticated: false };

    return { isAuthenticated: true };
  }),
});
