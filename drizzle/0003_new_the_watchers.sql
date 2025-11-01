ALTER TABLE `pledges` ADD `pledgeNumber` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `pledges` ADD CONSTRAINT `pledges_pledgeNumber_unique` UNIQUE(`pledgeNumber`);