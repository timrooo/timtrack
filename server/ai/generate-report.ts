import { getAnthropicClient } from './client'
import { Response } from 'express'

interface ReportContext {
  project: { name: string; site_code: string; address: string; progress_pct: number; status: string }
  floors: Array<{ name: string; parts_delivered_pct: number; constructions_total: number; constructions_done: number }>
  issues: Array<{ type: string; comment: string; urgency: string; created_at: string }>
  constructions: Array<{ name: string; code: string; status: string; parts_total: number; parts_on_site: number }>
}

export async function streamReport(ctx: ReportContext, res: Response): Promise<void> {
  const client = getAnthropicClient()

  const systemPrompt = `Ты аналитик строительного проекта. Пиши краткий отчёт о прогрессе на русском языке в формате Markdown.
Разделы: ## Общий прогресс | ## По этажам | ## Проблемы | ## Рекомендации
Используй реальные цифры. Тон: профессиональный, конкретный. Без воды.`

  const dataText = `
Проект: ${ctx.project.name} (${ctx.project.site_code})
Адрес: ${ctx.project.address}
Общий прогресс: ${ctx.project.progress_pct}%
Статус: ${ctx.project.status}

Этажи (${ctx.floors.length} всего):
${ctx.floors.map((f) => `- ${f.name}: ${f.constructions_done}/${f.constructions_total} изделий, поставка деталей ${f.parts_delivered_pct}%`).join('\n')}

Изделия (всего ${ctx.constructions.length}):
${ctx.constructions.slice(0, 20).map((c) => `- [${c.code}] ${c.name}: статус=${c.status}, деталей ${c.parts_on_site}/${c.parts_total}`).join('\n')}
${ctx.constructions.length > 20 ? `...и ещё ${ctx.constructions.length - 20} изделий` : ''}

Открытые проблемы (${ctx.issues.length}):
${ctx.issues.slice(0, 10).map((i) => `- [${i.urgency}] ${i.type}: ${i.comment} (${i.created_at.slice(0, 10)})`).join('\n')}
${ctx.issues.length > 10 ? `...и ещё ${ctx.issues.length - 10} проблем` : ''}
`.trim()

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache')

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Напиши отчёт по следующим данным:\n\n${dataText}` }],
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      res.write(chunk.delta.text)
    }
  }

  res.end()
}
