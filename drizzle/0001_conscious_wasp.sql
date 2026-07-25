CREATE TABLE `trip_schedule` (
	`trip_id` text PRIMARY KEY NOT NULL,
	`planned_date` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vacation_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`updated_at` integer NOT NULL
);
