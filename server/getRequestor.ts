import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "./prisma";

export const getRequestor = async (payload: any): Promise<User> => {
  console.log({ payload });
  const requestor = await prisma.user.findUnique({
    where: {
      id: String(payload.id),
    },
  });

  if (!requestor)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource.",
    });

  return requestor;
};
