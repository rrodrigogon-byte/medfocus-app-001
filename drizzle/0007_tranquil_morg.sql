CREATE TABLE `library_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`libraryMaterialType` enum('livro','artigo','diretriz','atlas','videoaula','podcast','tese','revisao_sistematica','caso_clinico','guideline') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`specialty` varchar(255),
	`year` int,
	`authorName` varchar(500) NOT NULL,
	`authorTitle` varchar(255),
	`authorInstitution` varchar(500),
	`authorCountry` varchar(64) DEFAULT 'Brasil',
	`source` varchar(500),
	`doi` varchar(255),
	`externalUrl` text,
	`publishedYear` int,
	`impactFactor` varchar(32),
	`aiCurated` boolean NOT NULL DEFAULT true,
	`relevanceScore` int DEFAULT 80,
	`searchQuery` varchar(500),
	`views` int NOT NULL DEFAULT 0,
	`saves` int NOT NULL DEFAULT 0,
	`rating` int,
	`language` varchar(10) DEFAULT 'pt-BR',
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `library_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_saved_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`materialId` int NOT NULL,
	`notes` text,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_saved_materials_id` PRIMARY KEY(`id`)
);
