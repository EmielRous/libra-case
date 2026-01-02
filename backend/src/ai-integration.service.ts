// ai-integration.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Todo } from '../generated/prisma/client.js';

@Injectable()
export class AiIntegrationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async callUntilValid(instructions: string, input: string): Promise<string[]> {
    let subTasksText: string;
    let subTasks: string[];

    while (true) {
      const response = await this.openai.responses.create({
        model: 'gpt-5.1',
        instructions,
        input,
      });

      subTasksText = response.output_text.trim();

      try {
        subTasks = JSON.parse(subTasksText);
        if (Array.isArray(subTasks)) {
          return subTasks;
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    }
  }

  async generateSubTodos(task: string): Promise<string[]> {
    const instructions = 'Generate subtasks for the following task. Your only response can be a JSON with the format: ["**", "**", "**"] where ** are the subtasks';
    return this.callUntilValid(instructions, task);
  }


  async rerunSubtodo(mainTodo: Todo, queryText: string): Promise<string> {
    const instructions = 'Please rewrite this subtodo using the comment from the queryText. The maintodo is added for reference. Make sure the todo makes sense in the context of the main and other subtodos. Only return the updated subtodo nothing else'
    const response = await this.openai.responses.create({
      model: 'gpt-5.1',
      instructions,
      input: JSON.stringify({mainTodo, queryText}),
    });

    const subTasksText = response.output_text.trim();
    return subTasksText
  }
}
