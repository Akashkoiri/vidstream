import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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

// ----------------------------
// PLAYLISTS
// ----------------------------
export const playlists = pgTable("playlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  description: text("description"),
  coverImage: varchar("cover_image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const playlistItems = pgTable("playlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  playlistId: uuid("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  tmdbId: varchar("tmdb_id", { length: 32 }).notNull(),
  mediaType: varchar("media_type", { length: 10 }).notNull(), // "movie" | "tv"
  position: integer("position").notNull().default(0),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// ---------------------------
// Relations
// ---------------------------
export const playlistRelations = relations(playlists, ({ many }) => ({
  items: many(playlistItems),
}));

export const playlistItemsRelations = relations(playlistItems, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistItems.playlistId],
    references: [playlists.id],
  }),
}));
