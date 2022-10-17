import { t } from "../t";
import { z } from "zod";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { prisma } from "../prisma";
import { generateId } from "../../utils/generateId";
import { INVENTORY_ID_LENGTH } from "../../utils/constants";
import { TRPCError } from "@trpc/server";

export const inventoryRouter = t.router({
  addItem: t.procedure
    .input(
      z.object({
        name: z.string(),
        quantity: z.number(),
        unit: z.string(),
        pricePerUnit: z.number(),
        extension: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      let id = "";
      do {
        id = generateId(INVENTORY_ID_LENGTH);
      } while (await prisma.inventory.findUnique({ where: { id } }));

      const item = await prisma.inventory.create({
        data: {
          id,
          name: input.name,
          quantity: input.quantity,
          unit: input.unit,
          pricePerUnit: input.pricePerUnit,
          restaurantId: requestor.restaurantId,
          photo: input.extension
            ? `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env
                .AWS_S3_REGION!}.amazonaws.com/inventory_pics/${id}.${
                input.extension
              }`
            : "",
        },
      });

      if (!item)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create item",
        });

      return { message: "Item created successfully" };
    }),
});
