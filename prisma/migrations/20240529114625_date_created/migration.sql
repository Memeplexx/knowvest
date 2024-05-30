-- AlterTable
ALTER TABLE "note" ALTER COLUMN "date_created" DROP DEFAULT;

-- AlterTable
ALTER TABLE "note_tag" ALTER COLUMN "assigned_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tag" ALTER COLUMN "date_created" DROP DEFAULT;
