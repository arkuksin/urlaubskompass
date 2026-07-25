CREATE TABLE `destination_votes` (
	`trip_id` text NOT NULL,
	`voter` text NOT NULL,
	`vote` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`trip_id`, `voter`)
);
