CREATE TABLE `material_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`materialId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`helpful` int NOT NULL DEFAULT 0,
	`reported` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `material_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pubmed_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pmid` varchar(32) NOT NULL,
	`title` text NOT NULL,
	`authors` text NOT NULL,
	`journal` varchar(500),
	`pubDate` varchar(32),
	`doi` varchar(255),
	`abstractText` text,
	`articleSource` enum('pubmed','scielo') NOT NULL DEFAULT 'pubmed',
	`searchQuery` varchar(500),
	`keywords` text,
	`language` varchar(10) DEFAULT 'en',
	`isOpenAccess` boolean DEFAULT false,
	`citationCount` int,
	`views` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pubmed_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `pubmed_articles_pmid_unique` UNIQUE(`pmid`)
);
--> statement-breakpoint
CREATE TABLE `user_study_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemType` enum('material','article','quiz','flashcard','subject') NOT NULL,
	`itemId` varchar(255) NOT NULL,
	`itemTitle` varchar(500) NOT NULL,
	`subject` varchar(255),
	`score` int,
	`timeSpentMinutes` int,
	`completed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_study_history_id` PRIMARY KEY(`id`)
);
