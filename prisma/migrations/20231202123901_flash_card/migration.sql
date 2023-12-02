-- CreateTable
CREATE TABLE "flash_card" (
    "id" SERIAL NOT NULL,
    "note_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "next_question_date" TIMESTAMP(3) NOT NULL,
    "clean_run_count" INTEGER NOT NULL,

    CONSTRAINT "flash_card_pkey" PRIMARY KEY ("id")
);
