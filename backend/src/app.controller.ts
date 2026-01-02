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

  @Post('rerun-subtodo/:key')
  rerunSubtodo(@Param('key') key: string,@Body() rerunQuerytext: string) {
    return this.appService.rerunSubtodo(Number(key), rerunQuerytext);
  }

  @Put('generate-subtodos/:key')
  generateSubtodos(@Param('key') key: string): Promise<Todo> {
    return this.appService.addSubtodos(Number(key));
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