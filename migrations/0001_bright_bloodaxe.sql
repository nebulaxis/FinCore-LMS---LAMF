CREATE TABLE "loans" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar(36) NOT NULL,
	"sanctioned_amount" integer NOT NULL,
	"outstanding_amount" integer NOT NULL,
	"status" text NOT NULL,
	"risk_status" text DEFAULT 'NORMAL',
	"disbursed_at" timestamp,
	"closed_at" timestamp,
	"closure_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "collaterals" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "collaterals" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "collaterals" ALTER COLUMN "loan_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "loan_applications" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "loan_applications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "loan_applications" ALTER COLUMN "product_id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();