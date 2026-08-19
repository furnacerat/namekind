import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const aiUsage = sqliteTable("ai_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  visitorHash: text("visitor_hash").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_ai_usage_visitor_created").on(table.visitorHash, table.createdAt),
  index("idx_ai_usage_created_at").on(table.createdAt),
]);
