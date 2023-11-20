-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "note_id" INTEGER NOT NULL,
    "date_for_next_question" TIMESTAMP(3) NOT NULL,
    "interval_in_hours" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);
