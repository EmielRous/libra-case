// ai-integration.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiIntegrationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSubTodos(task: string): Promise<string[]> {
    const prompt = `Generate sub-todos for the following task: "${task}". Only answer with the todos nothing else and put each todo on a new line`;
    const models = await this.openai.models.list();
    for (const m of models.data) {
      console.log(m.id);
    }

    const response = await this.openai.completions.create({
      model: 'gpt-5.1',
      prompt,
      max_tokens: 100,
    });

    const subTasksText = response.choices[0].text?.trim();
    return subTasksText
      ? subTasksText
        .split('\n')
        .map(sub => sub.trim())
        .filter(sub => sub.length > 0)
      : [];
  }
}
