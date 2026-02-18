CREATE TABLE `calendar_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`eventType` enum('prova','trabalho','seminario','pratica','revisao','simulado','outro') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`university` varchar(255),
	`year` int,
	`eventDate` timestamp NOT NULL,
	`reminderDays` int DEFAULT 3,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`linkedMaterialIds` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `calendar_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `revision_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`calendarEventId` int NOT NULL,
	`suggestedDate` timestamp NOT NULL,
	`subject` varchar(255) NOT NULL,
	`revisionType` enum('leitura','flashcards','quiz','resumo','simulado') NOT NULL,
	`materialSuggestion` text,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `revision_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`subject` varchar(255),
	`isPinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shared_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`sharedByUserId` int NOT NULL,
	`shareCode` varchar(32) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`university` varchar(255),
	`year` int,
	`views` int NOT NULL DEFAULT 0,
	`copies` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shared_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `shared_templates_shareCode_unique` UNIQUE(`shareCode`)
);
--> statement-breakpoint
CREATE TABLE `simulado_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`area` varchar(128) NOT NULL,
	`subArea` varchar(128),
	`questionDifficulty` enum('facil','medio','dificil') NOT NULL DEFAULT 'medio',
	`questionExamType` enum('enamed','revalida','residencia') NOT NULL DEFAULT 'enamed',
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctIndex` int NOT NULL,
	`explanation` text NOT NULL,
	`references` text,
	`year` int,
	`timesAnswered` int NOT NULL DEFAULT 0,
	`timesCorrect` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simulado_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`examType` enum('enamed','revalida','residencia','custom') NOT NULL,
	`totalQuestions` int NOT NULL,
	`timeLimit` int NOT NULL,
	`areas` text NOT NULL,
	`simuladoStatus` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`score` int,
	`correctAnswers` int,
	`timeSpent` int,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`results` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simulados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_room_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`messageType` enum('text','note','link','file') NOT NULL DEFAULT 'text',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_room_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_room_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`participantRole` enum('owner','moderator','member') NOT NULL DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_room_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(16) NOT NULL,
	`createdByUserId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`university` varchar(255),
	`year` int,
	`description` text,
	`maxParticipants` int NOT NULL DEFAULT 20,
	`isActive` boolean NOT NULL DEFAULT true,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_rooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_rooms_code_unique` UNIQUE(`code`)
);
