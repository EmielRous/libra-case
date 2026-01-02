-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_parentTodoId_fkey";

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_parentTodoId_fkey" FOREIGN KEY ("parentTodoId") REFERENCES "Todo"("key") ON DELETE CASCADE ON UPDATE CASCADE;
