import { getAnthropicClient } from './client'

export interface ParsedIssue {
  type: 'damage' | 'replace' | 'paint' | 'missing' | 'other'
  comment: string
  urgency: 'high' | 'medium' | 'low'
  confidence: 'high' | 'medium' | 'low'
  clarification_needed: string | null
}

export async function parseIssue(rawInput: string, partContext?: string): Promise<ParsedIssue> {
  const client = getAnthropicClient()

  const systemPrompt = `Ты ассистент строительной площадки. Рабочий описывает проблему с деталью мебели.
Извлеки тип проблемы и напиши чистый комментарий на русском языке, используя инструмент report_issue.

Типы проблем:
- damage = деталь сломана, треснута, разбита, повреждена физически
- replace = не та деталь, не подходит по размеру или цвету, нужна замена
- paint = царапина, потёртость, нужна подкраска или перекраска
- missing = деталь отсутствует, не привезли, не нашли
- other = любая другая проблема

Всегда вызывай инструмент report_issue. Комментарий не более 120 символов, на русском.`

  const userMessage = partContext
    ? `Деталь: ${partContext}\nПроблема: ${rawInput}`
    : rawInput

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    tool_choice: { type: 'tool', name: 'report_issue' },
    tools: [
      {
        name: 'report_issue',
        description: 'Сохранить структурированную информацию о проблеме с деталью мебели',
        input_schema: {
          type: 'object' as const,
          properties: {
            type: {
              type: 'string',
              enum: ['damage', 'replace', 'paint', 'missing', 'other'],
              description: 'Тип проблемы',
            },
            comment: {
              type: 'string',
              description: 'Чистое описание проблемы на русском языке, не более 120 символов',
            },
            urgency: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Срочность: high=срочно/блокирует монтаж, medium=нужно решить, low=некритично',
            },
            confidence: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Уверенность в правильности классификации',
            },
            clarification_needed: {
              type: ['string', 'null'],
              description: 'Вопрос для уточнения, если недостаточно информации. Null если всё ясно.',
            },
          },
          required: ['type', 'comment', 'urgency', 'confidence', 'clarification_needed'],
        },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  })

  const toolUse = response.content.find((block) => block.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not call report_issue tool')
  }

  return toolUse.input as ParsedIssue
}
