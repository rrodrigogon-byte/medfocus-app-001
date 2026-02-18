CREATE TABLE `material_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`materialId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `material_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`templateType` enum('anamnese','exame_fisico','diagnostico_diferencial','prescricao','roteiro_revisao','mapa_mental','checklist_estudo','guia_completo','resumo_estruturado','caso_clinico_modelo') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`specialty` varchar(255),
	`year` int,
	`difficulty` enum('basico','intermediario','avancado') DEFAULT 'intermediario',
	`tags` text,
	`views` int NOT NULL DEFAULT 0,
	`saves` int NOT NULL DEFAULT 0,
	`rating` int,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subject_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subject_subscriptions_id` PRIMARY KEY(`id`)
);
