CREATE TABLE `user_xp` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalXP` int NOT NULL DEFAULT 0,
	`weeklyXP` int NOT NULL DEFAULT 0,
	`monthlyXP` int NOT NULL DEFAULT 0,
	`streak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActiveDate` varchar(10),
	`simuladosCompleted` int NOT NULL DEFAULT 0,
	`questionsAnswered` int NOT NULL DEFAULT 0,
	`correctAnswers` int NOT NULL DEFAULT 0,
	`pomodoroMinutes` int NOT NULL DEFAULT 0,
	`flashcardsReviewed` int NOT NULL DEFAULT 0,
	`universityId` varchar(64),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_xp_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekStart` varchar(10) NOT NULL,
	`goalType` enum('questions','pomodoro_hours','study_hours','flashcards','simulados') NOT NULL,
	`targetValue` int NOT NULL,
	`currentValue` int NOT NULL DEFAULT 0,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `xp_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityType` enum('simulado_completed','question_correct','question_wrong','pomodoro_completed','flashcard_reviewed','streak_bonus','goal_completed','daily_login','material_reviewed') NOT NULL,
	`xpEarned` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xp_activities_id` PRIMARY KEY(`id`)
);
