import ReactMarkdown from 'react-markdown'
import { useReport } from '../../hooks/useReport'
import { Spinner } from '../ui/Spinner'

interface AIReportBlockProps {
  projectId: number
}

export function AIReportBlock({ projectId }: AIReportBlockProps) {
  const { text, loading, error, generate, reset } = useReport()

  if (!text && !loading && !error) {
    return (
      <div style={{ padding: '16px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => generate(projectId)}
          style={{ gap: 8 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          AI-отчёт по проекту
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--r)',
          border: '1px solid var(--border-opaque)',
          padding: '16px',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--content-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--content-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AI-отчёт
          </span>
          {loading && <Spinner size={14} />}
        </div>

        {error ? (
          <p style={{ color: 'var(--status-defect)', fontSize: 14, margin: 0 }}>Ошибка: {error}</p>
        ) : (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--content-primary)',
            }}
            className="ai-report-content"
          >
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={reset} style={{ width: 'auto' }}>
        Скрыть отчёт
      </button>
    </div>
  )
}
