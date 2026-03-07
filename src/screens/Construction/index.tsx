import { useEffect, useState } from 'react'
import { Construction, Part } from '../../types'
import { NavHook } from '../../hooks/useNav'
import { StatusBadge, PartStatusBadge } from '../../components/ui/Badge'
import { FilterChips } from '../../components/ui/FilterChips'

interface ConstructionProps {
  nav: NavHook
  constructionId: number
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'warehouse', label: 'Склад' },
  { value: 'transit', label: 'В пути' },
  { value: 'paint', label: 'Покраска' },
  { value: 'replace', label: 'Замена' },
  { value: 'done', label: 'Готово' },
]

export function ConstructionScreen({ nav, constructionId }: ConstructionProps) {
  const [construction, setConstruction] = useState<Construction | null>(null)
  const [parts, setParts] = useState<Part[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMarkDone, setShowMarkDone] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/constructions/${constructionId}`).then((r) => r.json()),
      fetch(`/api/parts/construction/${constructionId}`).then((r) => r.json()),
    ]).then(([c, p]) => {
      setConstruction(c)
      setParts(p)
      setLoading(false)
    })
  }, [constructionId])

  const filtered = parts.filter((p) => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchSearch = !search ||
      (p.name_ru ?? p.name_he).toLowerCase().includes(search.toLowerCase()) ||
      p.name_he.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (loading || !construction) {
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

  const pct = construction.parts_total > 0 ? Math.round((construction.parts_on_site / construction.parts_total) * 100) : 0

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn-back" onClick={nav.goBack}><BackIcon /></button>
        <div style={{ flex: 1 }}>
          <div className="topbar-title">{construction.name}</div>
          <div className="topbar-subtitle">{construction.code}</div>
        </div>
        <StatusBadge status={construction.status} />
      </div>

      <div className="screen-content">
        {/* Summary */}
        <div style={{ padding: '12px 16px' }}>
          <div className="progress-bar" style={{ marginBottom: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--content-secondary)' }}>Деталей на объекте</span>
            <span style={{ fontWeight: 600 }}>{construction.parts_on_site}/{construction.parts_total}</span>
          </div>
        </div>

        {construction.status !== 'done' && (
          <div style={{ padding: '0 16px 12px' }}>
            <button className="btn btn-success" onClick={() => setShowMarkDone(true)}>
              Отметить как готово
            </button>
          </div>
        )}

        {/* Search */}
        <div className="search-bar">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input className="search-input" placeholder="Поиск деталей..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

        <div className="card-list">
          {filtered.map((part) => (
            <PartRow
              key={part.id}
              part={part}
              onClick={() => nav.navigate({ name: 'part', partId: part.id })}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">Ничего не найдено</div>
            </div>
          )}
        </div>
      </div>

      {/* Mark as done modal */}
      {showMarkDone && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setShowMarkDone(false)} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Подтвердить монтаж</span>
              <button className="bottom-sheet-close" onClick={() => setShowMarkDone(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <p style={{ fontSize: 15, color: 'var(--content-secondary)', marginBottom: 24 }}>
                Вы уверены, что изделие <strong>{construction.name}</strong> полностью смонтировано?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowMarkDone(false)}>
                  Отмена
                </button>
                <button
                  className="btn btn-success"
                  style={{ flex: 2 }}
                  onClick={async () => {
                    await fetch(`/api/constructions/${constructionId}/status`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'done' }),
                    })
                    setConstruction({ ...construction, status: 'done' })
                    setShowMarkDone(false)
                  }}
                >
                  Да, готово
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function PartRow({ part, onClick }: { part: Part; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
            #{part.number} {part.name_ru ?? part.name_he}
          </div>
          <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>
            {part.name_he} · {part.dimensions}
          </div>
          <div style={{ fontSize: 12, color: 'var(--content-tertiary)', marginTop: 2 }}>
            {part.material} · {part.color}
          </div>
        </div>
        <PartStatusBadge status={part.status} />
      </div>
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
