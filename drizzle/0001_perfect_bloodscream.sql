CREATE TABLE `items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`shop` varchar(255),
	`totalPledged` int NOT NULL DEFAULT 0,
	`isLocked` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pledges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`cellNumber` varchar(20) NOT NULL,
	`amount` int NOT NULL,
	`isFull` int NOT NULL DEFAULT 0,
	`popiConsent` int NOT NULL DEFAULT 1,
	`emailSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pledges_id` PRIMARY KEY(`id`)
);
