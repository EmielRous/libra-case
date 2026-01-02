// app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Todo, Prisma } from '../generated/prisma/client.js';
import { AiIntegrationService } from './ai-integration.service.js';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private aiIntegrationService: AiIntegrationService,
  ) {}

  async getTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany({where: {isConcept: false, parentTodo: null}});
  }

  async addTodo(todo: Omit<Todo, 'key' | 'subtodos' | "parentTodo">): Promise<Todo> {
   return  this.prisma.todo.create({
      data: todo,
    });

  }

  async addSubtodos(key: number)  {
    const todo = await this.prisma.todo.findUnique({
      where: { key },
    });
    if(!todo) {
      throw Error("No Todos found")
    }

    const subTasks = await this.aiIntegrationService.generateSubTodos(todo.task);

    const subTodos = await Promise.all(
      subTasks.map(subTask =>
        this.prisma.todo.create({
          data: {
            task: subTask,
            isConcept: true,
          },
        }),
      ),
    );

    return this.prisma.todo.update({
      where: { key: key },
      data: { subtodos: { connect: subTodos.map(subTodo => ({ key: subTodo.key })) } },
    });
  }

  async toggleTodoComplete(key: number): Promise<Todo> {
    const todo = await this.prisma.todo.findUnique({
      where: { key },
    });

    if (!todo) {
      throw Error("No todo found");
    }

    return this.prisma.todo.update({
      where: { key },
      data: { completed: !todo.completed },
    });
  }

  async deleteTodo(key: number): Promise<void> {
    await this.prisma.todo.delete({
      where: { key },
    });
  }
}