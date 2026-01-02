import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Todo } from '../generated/prisma/client.js';


@Controller('todos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTodos(): Promise<Todo[]> {
    return this.appService.getTodos();
  }

  @Post()
  addTodo(@Body() todo: Omit<Todo, 'key'>): Promise<Todo> {
    return this.appService.addTodo(todo);
  }

  @Put(':key')
  updateTodo(@Param('key') key: string): Promise<Todo> {

    return this.appService.toggleTodoComplete(Number(key));
  }

  @Delete(':key')
  deleteTodo(@Param('key') key: string): void {
    this.appService.deleteTodo(Number(key));
  }
}