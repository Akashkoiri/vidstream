import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchProgress = pgTable("watch_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  tmdbId: varchar("tmdb_id", { length: 32 }).notNull(),
  mediaType: varchar("media_type", { length: 10 }).notNull(), // "movie" | "tv"
  season: integer("season"),
  episode: integer("episode"),
  currentTime: integer("current_time").notNull(), // in seconds
  duration: integer("duration").notNull(),
  progressPercent: integer("progress_percent").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
