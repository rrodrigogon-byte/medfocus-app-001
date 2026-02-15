CREATE TABLE `generated_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`universityId` varchar(64) NOT NULL,
	`universityName` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`year` int NOT NULL,
	`contentType` enum('full','summary','flashcards','quiz') NOT NULL DEFAULT 'full',
	`content` text NOT NULL,
	`research` text,
	`qualityScore` int,
	`accessCount` int NOT NULL DEFAULT 1,
	`lastAccessedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_materials_id` PRIMARY KEY(`id`)
);
