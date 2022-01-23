-- AlterTable
CREATE SEQUENCE "opening_hours_id_seq";
ALTER TABLE "opening_hours" ALTER COLUMN "id" SET DEFAULT nextval('opening_hours_id_seq');
ALTER SEQUENCE "opening_hours_id_seq" OWNED BY "opening_hours"."id";
