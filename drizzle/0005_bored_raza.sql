CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('quiz','flashcards','assignment','reading','discussion') NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`points` int NOT NULL DEFAULT 100,
	`activityStatus` enum('draft','active','completed','archived') NOT NULL DEFAULT 'draft',
	`content` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classrooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(32) NOT NULL,
	`professorId` int NOT NULL,
	`subject` varchar(128) NOT NULL,
	`year` int NOT NULL,
	`semester` int NOT NULL,
	`university` varchar(128) NOT NULL,
	`description` text,
	`maxStudents` int NOT NULL DEFAULT 60,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classrooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `classrooms_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`studentId` int NOT NULL,
	`status` enum('active','inactive','removed') NOT NULL DEFAULT 'active',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityId` int NOT NULL,
	`studentId` int NOT NULL,
	`score` int,
	`submissionStatus` enum('pending','submitted','graded') NOT NULL DEFAULT 'pending',
	`response` text,
	`feedback` text,
	`submittedAt` timestamp,
	`gradedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
