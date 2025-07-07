PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text NOT NULL,
	`date` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`bestAccuracy` real DEFAULT 0 NOT NULL,
	`bestWpm` integer DEFAULT 0 NOT NULL,
	`bestTime` integer DEFAULT 0 NOT NULL,
	`category` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_activity`("id", "userId", "date", "count", "bestAccuracy", "bestWpm", "bestTime", "category") SELECT "id", "userId", "date", "count", "bestAccuracy", "bestWpm", "bestTime", "category" FROM `activity`;--> statement-breakpoint
DROP TABLE `activity`;--> statement-breakpoint
ALTER TABLE `__new_activity` RENAME TO `activity`;--> statement-breakpoint
PRAGMA foreign_keys=ON;