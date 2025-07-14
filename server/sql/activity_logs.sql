CREATE TABLE "activity_logs" (
	"user_logs_id" SERIAL NOT NULL,
	"user_id" INTEGER NULL DEFAULT NULL,
	"action" VARCHAR(100) NOT NULL,
	"details" TEXT NULL DEFAULT NULL,
	"ip_address" VARCHAR(45) NULL DEFAULT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("user_logs_id"),
	CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON UPDATE NO ACTION ON DELETE NO ACTION
)
;