import { relations } from "drizzle-orm/relations";

import { orders, plan, user } from "./schema";

export const ordersRelations = relations(orders, ({ one }) => ({
  plan: one(plan, {
    fields: [orders.planId],
    references: [plan.id],
  }),
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
}));

export const planRelations = relations(plan, ({ many }) => ({
  orders: many(orders),
}));

export const userRelations = relations(user, ({ many }) => ({
  orders: many(orders),
}));
