CREATE TABLE "users" (
	"user_id" SERIAL NOT NULL,
	"username" VARCHAR(50) NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"role" VARCHAR(20) NOT NULL,
	"created_at" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("user_id"),
	UNIQUE ("username"),
	CONSTRAINT "users_role_check" CHECK ((((role)::text = ANY ((ARRAY['administrator'::character varying, 'user'::character varying])::text[]))))
)
;