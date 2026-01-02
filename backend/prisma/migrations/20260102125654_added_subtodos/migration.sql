-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "isConcept" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentTodoId" INTEGER,
ADD COLUMN     "todoKey" INTEGER;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_parentTodoId_fkey" FOREIGN KEY ("parentTodoId") REFERENCES "Todo"("key") ON DELETE SET NULL ON UPDATE CASCADE;
