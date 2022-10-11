import { t } from "../t";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import * as jose from "jose";
import { TRPCError } from "@trpc/server";
import { prisma } from "../prisma";
import { setCookie } from "cookies-next";
import { KeyObject } from "crypto";
import { secretKey } from "../../utils/key";
import { Role } from "@prisma/client";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { generateId } from "../../utils/generateId";
import { DateTime } from "luxon";
import { getSignedUrlForProfilePic } from "../../utils/aws";

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

      //TODO : Generate password
      const hashedPassword = await bcrypt.hash("some pass here", 10);
      console.log("hashedPassword", hashedPassword);
      let id = "";
      do {
        id = generateId(6);
      } while (await prisma!.user.findUnique({ where: { id } }));

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

      return {
        message: "User created successfully",
        signedUrl: await getSignedUrlForProfilePic(id, input.extension),
      };
    }),
});
