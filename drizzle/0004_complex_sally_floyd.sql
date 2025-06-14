CREATE TABLE `metadata` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
