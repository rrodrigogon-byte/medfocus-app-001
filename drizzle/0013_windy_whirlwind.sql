CREATE TABLE `exam_calendar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examUserId` int NOT NULL,
	`examTitle` varchar(255) NOT NULL,
	`examType` varchar(50) NOT NULL,
	`examDate` timestamp NOT NULL,
	`examDescription` text,
	`examSubjects` text,
	`importance` varchar(20) NOT NULL DEFAULT 'high',
	`reminderDays` int NOT NULL DEFAULT 7,
	`examIsCompleted` tinyint NOT NULL DEFAULT 0,
	`examCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exam_calendar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flashcard_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deckId` int NOT NULL,
	`cardFront` text NOT NULL,
	`cardBack` text NOT NULL,
	`cardDifficulty` varchar(20) NOT NULL DEFAULT 'medium',
	`easeFactor` double NOT NULL DEFAULT 2.5,
	`sm2Interval` int NOT NULL DEFAULT 0,
	`repetitions` int NOT NULL DEFAULT 0,
	`nextReviewDate` timestamp NOT NULL DEFAULT (now()),
	`lastReviewDate` timestamp,
	`cardCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flashcard_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flashcard_decks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deckTitle` varchar(255) NOT NULL,
	`deckSubject` varchar(100) NOT NULL,
	`deckDescription` text,
	`cardCount` int NOT NULL DEFAULT 0,
	`sourceSummaryId` int,
	`deckIsPublic` tinyint NOT NULL DEFAULT 0,
	`deckCreatedAt` timestamp NOT NULL DEFAULT (now()),
	`deckUpdatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flashcard_decks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`suggUserId` int NOT NULL,
	`examId` int NOT NULL,
	`suggestionType` varchar(50) NOT NULL,
	`suggestionTitle` varchar(255) NOT NULL,
	`suggestionDescription` text,
	`suggestionSubject` varchar(100),
	`priority` int NOT NULL DEFAULT 0,
	`suggestionCompleted` tinyint NOT NULL DEFAULT 0,
	`suggestedDate` timestamp NOT NULL,
	`suggestionCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_suggestions_id` PRIMARY KEY(`id`)
);
