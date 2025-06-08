CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`date` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`bestAccuracy` real DEFAULT 0 NOT NULL,
	`bestWpm` integer DEFAULT 0 NOT NULL,
	`bestTime` integer DEFAULT 0 NOT NULL
);
