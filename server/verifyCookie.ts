import { TRPCError } from "@trpc/server";
import { secretKey } from "../utils/key";
import * as jose from "jose";

export const verifyCookie = async (ctx: any): Promise<any> => {
  if (!ctx.req.cookies["user-token"])
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource.",
    });

  const { payload } = await jose.jwtVerify(
    ctx.req.cookies["user-token"],
    secretKey
  );
  if (!payload)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource.",
    });

  return payload;
};
