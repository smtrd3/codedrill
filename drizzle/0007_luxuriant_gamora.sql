ALTER TABLE `templates` ADD `category` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `activity` DROP COLUMN `category`;