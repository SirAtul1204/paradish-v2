import { t } from "../t";
import { prisma } from "../prisma";
import { z } from "zod";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { generateId } from "../../utils/generateId";
import { ORDER_ID_LENGTH } from "../../utils/constants";
import { TRPCError } from "@trpc/server";
import { OrderStatus } from "@prisma/client";

export const orderRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        tableNumber: z.string(),
        items: z.string(),
        totalPrice: z.number(),
        totalQuantity: z.number(),
        totalCalories: z.number(),
        status: z.enum([
          OrderStatus.ACCEPTED,
          OrderStatus.CANCELLED,
          OrderStatus.COMPLETED,
          OrderStatus.PENDING,
          OrderStatus.PROCESSING,
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      let id = "";
      do {
        id = generateId(ORDER_ID_LENGTH);
      } while (await prisma.order.findUnique({ where: { id } }));

      const order = await prisma.order.create({
        data: {
          id,
          tableNo: input.tableNumber,
          items: input.items,
          totalPrice: input.totalPrice,
          totalQuantity: input.totalQuantity,
          totalCalories: input.totalCalories,
          status: input.status,
          restaurantId: requestor.restaurantId,
        },
      });

      if (!order)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
        });

      return { message: "Order created successfully", orderId: order.id };
    }),
  getAll: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    const orders = await prisma.order.findMany({
      where: { restaurantId: requestor.restaurantId },
    });

    return orders;
  }),
  updateStatus: t.procedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          OrderStatus.ACCEPTED,
          OrderStatus.CANCELLED,
          OrderStatus.COMPLETED,
          OrderStatus.PENDING,
          OrderStatus.PROCESSING,
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      const order = await prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      if (!order)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
        });

      return { message: "Order updated successfully" };
    }),
  getCompleted: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          { restaurantId: requestor.restaurantId },
          { status: OrderStatus.COMPLETED },
          { paid: false },
        ],
      },
    });

    return orders;
  }),
  setToPaid: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      const order = await prisma.order.update({
        where: { id: input.id },
        data: { status: OrderStatus.COMPLETED, paid: true },
      });

      if (!order)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
        });

      return { message: "Order updated successfully" };
    }),
});
