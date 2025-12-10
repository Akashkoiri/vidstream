CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"avatar_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watch_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tmdb_id" varchar(32) NOT NULL,
	"media_type" varchar(10) NOT NULL,
	"season" integer,
	"episode" integer,
	"current_time" integer NOT NULL,
	"duration" integer NOT NULL,
	"progress_percent" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
