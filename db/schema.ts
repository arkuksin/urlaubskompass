import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const destinationVotes = sqliteTable(
  "destination_votes",
  {
    tripId: text("trip_id").notNull(),
    voter: text("voter", { enum: ["me", "wife"] }).notNull(),
    vote: text("vote", { enum: ["yes", "maybe", "no"] }).notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.tripId, table.voter] })],
);

export const vacationSettings = sqliteTable("vacation_settings", {
  id: text("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const tripSchedule = sqliteTable("trip_schedule", {
  tripId: text("trip_id").primaryKey(),
  plannedDate: text("planned_date").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
