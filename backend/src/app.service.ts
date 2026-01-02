import { Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service.js';
import { Todo, Prisma } from '../generated/prisma/client.js';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getTodos(): Promise<Todo[]> {
    return  this.prisma.todo.findMany();
  }

  async addTodo(todo: Omit<Todo, 'key'>): Promise<Todo> {
    return  this.prisma.todo.create({
      data: todo,
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