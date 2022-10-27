import { t } from "../t";
import { z } from "zod";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { prisma } from "../prisma";
import { generateId } from "../../utils/generateId";
import { INVENTORY_ID_LENGTH } from "../../utils/constants";
import { TRPCError } from "@trpc/server";
import { getSignedUrlForInventoryPic } from "../../utils/aws";
import { DateTime } from "luxon";

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
            : `https://picsum.photos/200?random=${id}`,
          dateOfLastUpdate: DateTime.now().toISO(),
        },
      });

      if (!item)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create item",
        });

      return {
        message: "Item created successfully",
        signedUrl: input.extension
          ? await getSignedUrlForInventoryPic(id, input.extension)
          : null,
      };
    }),
  getAllItems: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    const items = await prisma.inventory.findMany({
      where: {
        restaurantId: requestor.restaurantId,
      },
    });

    return items as any;
  }),
  deleteMultiple: t.procedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      await prisma.inventory.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
          restaurantId: requestor.restaurantId,
        },
      });

      return {
        message: "Items deleted successfully",
      };
    }),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      const item = await prisma.inventory.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!item || item.restaurantId !== requestor.restaurantId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Item not found",
        });

      return item;
    }),
  updateItem: t.procedure
    .input(
      z.object({
        id: z.string(),
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

      const item = await prisma.inventory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          quantity: input.quantity,
          unit: input.unit,
          pricePerUnit: input.pricePerUnit,
          photo: input.extension
            ? `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env
                .AWS_S3_REGION!}.amazonaws.com/inventory_pics/${input.id}.${
                input.extension
              }`
            : undefined,
          dateOfLastUpdate: DateTime.now().toISO(),
        },
      });

      if (!item || item.restaurantId !== requestor.restaurantId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Item not found",
        });

      return {
        message: "Item updated successfully",
        signedUrl: input.extension
          ? await getSignedUrlForInventoryPic(input.id, input.extension)
          : null,
      };
    }),
});
