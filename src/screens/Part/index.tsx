import { useEffect, useState } from 'react'
import { Issue, Part, ScanEvent } from '../../types'
import { ParsedIssue } from '../../types'
import { NavHook } from '../../hooks/useNav'
import { PartStatusBadge, IssueTypeBadge, UrgencyBadge } from '../../components/ui/Badge'
import { AIIssueForm } from '../../components/ai/AIIssueForm'

interface PartProps {
  nav: NavHook
  partId: number
}

export function PartScreen({ nav, partId }: PartProps) {
  const [part, setPart] = useState<Part | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [scanHistory, setScanHistory] = useState<ScanEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/parts/${partId}`).then((r) => r.json()),
      fetch(`/api/issues/part/${partId}`).then((r) => r.json()),
      fetch(`/api/parts/${partId}/scan-history`).then((r) => r.json()),
    ]).then(([p, i, s]) => {
      setPart(p)
      setIssues(i)
      setScanHistory(s)
      setLoading(false)
    })
  }, [partId])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleConfirmIssue(parsed: ParsedIssue, rawInput: string) {
    if (!part) return
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_id: part.id,
        construction_id: part.construction_id,
        type: parsed.type,
        comment: parsed.comment,
        urgency: parsed.urgency,
        reported_by: 'Даниил К.',
        raw_input: rawInput,
      }),
    })
    if (res.ok) {
      const newIssue = await fetch(`/api/issues/part/${partId}`).then((r) => r.json())
      setIssues(newIssue)
      showToast('Проблема сохранена')
    }
  }

  if (loading || !part) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="btn-back" onClick={nav.goBack}><BackIcon /></button>
          <span className="topbar-title">Загрузка...</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn-back" onClick={nav.goBack}><BackIcon /></button>
        <div style={{ flex: 1 }}>
          <div className="topbar-title">Деталь #{part.number}</div>
          <div className="topbar-subtitle">{part.name_ru ?? part.name_he}</div>
        </div>
        <PartStatusBadge status={part.status} />
      </div>

      <div className="screen-content">
        {/* Part detail card */}
        <div style={{ padding: '12px 16px' }}>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px' }}>
              <DetailRow label="Название (ивр.)" value={part.name_he} />
              <DetailRow label="Название (рус.)" value={part.name_ru ?? '—'} />
              <DetailRow label="Размер" value={part.dimensions} />
              <DetailRow label="Материал" value={part.material} />
              <DetailRow label="Цвет" value={part.color} />
              <DetailRow label="Номер" value={`#${part.number}`} />
            </div>
          </div>
        </div>

        {/* Report issue button */}
        <div style={{ padding: '0 16px 12px' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setShowIssueForm(true)}
            style={{ gap: 8 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Сообщить о проблеме
          </button>
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <>
            <div className="divider" />
            <div className="section-header">
              <span className="section-title">Проблемы ({issues.length})</span>
            </div>
            <div className="card-list">
              {issues.map((issue) => (
                <div key={issue.id} className="card">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <IssueTypeBadge type={issue.type} />
                    <UrgencyBadge urgency={issue.urgency} />
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 14 }}>{issue.comment}</p>
                  <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>
                    {issue.reported_by} · {issue.created_at.slice(0, 16).replace('T', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Scan history */}
        {scanHistory.length > 0 && (
          <>
            <div className="divider" />
            <div className="section-header">
              <span className="section-title">История сканирований</span>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              {scanHistory.map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: 12, paddingBottom: 16, position: 'relative' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-inverse)',
                    marginTop: 5, flexShrink: 0,
                    boxShadow: '0 0 0 2px var(--bg-primary), 0 0 0 3px var(--border-opaque)',
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{event.event}</div>
                    <div style={{ fontSize: 12, color: 'var(--content-tertiary)', marginTop: 2 }}>
                      {event.location} · {event.scanned_by}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>
                      {event.created_at.slice(0, 16).replace('T', ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AIIssueForm
        open={showIssueForm}
        onClose={() => setShowIssueForm(false)}
        part={part}
        constructionId={part.construction_id}
        onConfirm={handleConfirmIssue}
      />

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--content-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
