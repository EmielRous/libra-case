-- CreateTable
CREATE TABLE "Todo" (
    "key" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("key")
);
