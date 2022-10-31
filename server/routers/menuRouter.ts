import { t } from "../t";
import { z } from "zod";
import { verifyCookie } from "../verifyCookie";
import { getRequestor } from "../getRequestor";
import { TRPCError } from "@trpc/server";
import { Role } from "@prisma/client";
import { prisma } from "../prisma";
import { formatCategoryName } from "../../utils/formatCategoryName";
import { deFormatCategoryName } from "../../utils/deFormatCategoryName";
import { generateId } from "../../utils/generateId";
import { MENU_ITEM_ID_LENGTH } from "../../utils/constants";

export const menuRouter = t.router({
  addItem: t.procedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        calories: z.number(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const payload = await verifyCookie(ctx);
      const requestor = await getRequestor(payload);

      if (!(requestor.role === Role.OWNER || requestor.role === Role.MANAGER)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
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

      const formattedType = formatCategoryName(input.type);
      let restaurantCategories = restaurant.categories;

      if (restaurantCategories) {
        if (!restaurantCategories.includes(formattedType))
          restaurantCategories += "," + formattedType;
      } else {
        restaurantCategories = formattedType;
      }
      const updatedRestaurant = await prisma.restaurant.update({
        where: {
          id: restaurant.id,
        },
        data: {
          name: restaurant.name,
          id: restaurant.id,
          categories: restaurantCategories,
        },
      });

      if (!updatedRestaurant) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Restaurant could not be updated",
        });
      }

      let itemId = "";
      do {
        itemId = generateId(MENU_ITEM_ID_LENGTH);
      } while (await prisma.menu.findUnique({ where: { id: itemId } }));

      const item = await prisma.menu.create({
        data: {
          id: itemId,
          name: input.name,
          price: input.price,
          calories: input.calories,
          type: deFormatCategoryName(formattedType),
          restaurantId: restaurant.id,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Menu item could not be created",
        });
      }

      return { message: "Menu item created successfully" };
    }),
  getMenu: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: requestor.restaurantId,
      },
    });

    if (!restaurant)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Restaurant not found",
      });

    if (!restaurant.categories) return {};

    const categories = restaurant.categories.split(",");
    const formattedCategories = categories.map((category) =>
      deFormatCategoryName(category)
    );

    const menuItems = await prisma.menu.findMany({
      where: {
        restaurantId: requestor.restaurantId,
      },
      include: {
        Ingredients: true,
      },
    });

    if (!menuItems) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Menu items not found",
      });
    }

    const menu: any = {};
    formattedCategories.forEach((category) => {
      menu[category] = [];
    });

    menuItems.forEach((item) => {
      menu[item.type].push(item);
    });

    return { message: "Menu retrieved successfully", menu };
  }),
  getAllSorted: t.procedure.query(async ({ ctx }) => {
    const payload = await verifyCookie(ctx);
    const requestor = await getRequestor(payload);

    const menuItems = await prisma.menu.findMany({
      where: {
        restaurantId: requestor.restaurantId,
      },
    });

    if (!menuItems) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Menu items not found",
      });
    }

    menuItems.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return { message: "Items retrieved successfully", items: menuItems };
  }),
});
