CREATE TABLE "collaterals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fund_name" text NOT NULL,
	"isin" text NOT NULL,
	"units" integer NOT NULL,
	"nav" integer NOT NULL,
	"pledged_value" integer NOT NULL,
	"loan_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_name" text NOT NULL,
	"product_id" varchar NOT NULL,
	"requested_amount" integer NOT NULL,
	"status" text NOT NULL,
	"approved_at" timestamp,
	"approved_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"interest_rate" integer NOT NULL,
	"max_ltv" integer NOT NULL,
	"min_amount" integer NOT NULL,
	"max_amount" integer NOT NULL,
	"tenure_months" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
