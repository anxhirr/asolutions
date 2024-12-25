import {
  bigint,
  doublePrecision,
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const currency = pgEnum("CURRENCY", ["ALL", "EUR", "USD"]);
export const orderStatus = pgEnum("ORDER_STATUS", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);
export const paypalOrderStatus = pgEnum("PAYPAL_ORDER_STATUS", [
  "PAYER_ACTION_REQUIRED",
]);
export const product = pgEnum("PRODUCT", ["INV"]);
export const userRole = pgEnum("UserRole", ["ADMIN", "USER"]);

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  email: text("email").notNull(),
});

export const plan = pgTable("plan", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "plan_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
  product: product("product").notNull(),
  name: text("name").notNull(),
  monthlyPrice: numeric("monthlyPrice").notNull(),
  yearlyPrice: numeric("yearlyPrice").notNull(),
});

export const orders = pgTable(
  "orders",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "orders_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    userId: uuid("userId").notNull(),
    status: orderStatus("status").notNull(),
    totalAmount: doublePrecision("totalAmount").notNull(),
    currency: currency("currency").notNull(),
    paypalOrderId: text("paypalOrderId").notNull(),
    paypalPayerId: text("paypalPayerId"),
    paypalPaymentId: text("paypalPaymentId"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    planId: bigint("planId", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      ordersPlanIdFkey: foreignKey({
        columns: [table.planId],
        foreignColumns: [plan.id],
        name: "orders_planId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      ordersUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [user.id],
        name: "orders_userId_fkey",
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
      ordersIdKey: unique("orders_id_key").on(table.id),
    };
  },
);
