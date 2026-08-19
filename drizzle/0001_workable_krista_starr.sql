CREATE INDEX `idx_ai_usage_visitor_created` ON `ai_usage` (`visitor_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_ai_usage_created_at` ON `ai_usage` (`created_at`);--> statement-breakpoint
PRAGMA optimize;
