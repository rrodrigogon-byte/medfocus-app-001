CREATE TABLE `clinical_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialty` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`caseDifficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`patientInfo` text NOT NULL,
	`conversationHistory` json,
	`currentPhase` enum('anamnesis','physical_exam','lab_tests','hypothesis','treatment','completed') NOT NULL DEFAULT 'anamnesis',
	`finalDiagnosis` varchar(500),
	`score` int,
	`xpEarned` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clinical_cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_battles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengerId` int NOT NULL,
	`opponentId` int,
	`inviteCode` varchar(20) NOT NULL,
	`battleStatus` enum('waiting','active','completed','expired') NOT NULL DEFAULT 'waiting',
	`battleSpecialty` varchar(100),
	`totalQuestions` int NOT NULL DEFAULT 10,
	`challengerScore` int DEFAULT 0,
	`opponentScore` int DEFAULT 0,
	`currentQuestionIndex` int DEFAULT 0,
	`questionIds` json,
	`challengerAnswers` json,
	`opponentAnswers` json,
	`winnerId` int,
	`battleCompletedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`battleCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `question_battles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smart_summaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(500) NOT NULL,
	`summarySpecialty` varchar(100),
	`summaryContent` text NOT NULL,
	`mnemonics` json,
	`isPublic` boolean DEFAULT false,
	`shareCode` varchar(20),
	`summaryLikes` int DEFAULT 0,
	`summaryCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `smart_summaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_feed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`feedEventType` enum('badge_earned','simulado_completed','streak_milestone','clinical_case_solved','battle_won','level_up','goal_completed','summary_shared') NOT NULL,
	`feedTitle` varchar(300) NOT NULL,
	`feedDescription` text,
	`feedMetadata` json,
	`feedLikes` int DEFAULT 0,
	`feedCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_feed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_feed_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commentFeedItemId` int NOT NULL,
	`commentUserId` int NOT NULL,
	`commentContent` text NOT NULL,
	`commentCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_feed_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_feed_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`feedItemId` int NOT NULL,
	`userId` int NOT NULL,
	`likeCreatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_feed_likes_id` PRIMARY KEY(`id`)
);
