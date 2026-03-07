import { useEffect, useState } from 'react'
import { Construction, Floor } from '../../types'
import { NavHook } from '../../hooks/useNav'
import { StatusBadge } from '../../components/ui/Badge'
import { FilterChips } from '../../components/ui/FilterChips'

interface FloorProps {
  nav: NavHook
  floorId: number
  projectId: number
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'ready', label: 'Ожидание' },
  { value: 'delivery', label: 'В доставке' },
  { value: 'shortage', label: 'Нехватка' },
  { value: 'defect', label: 'Дефект' },
  { value: 'done', label: 'Готово' },
]

export function FloorScreen({ nav, floorId, projectId }: FloorProps) {
  const [floor, setFloor] = useState<Floor | null>(null)
  const [constructions, setConstructions] = useState<Construction[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}/floors`).then((r) => r.json()),
      fetch(`/api/constructions/floor/${floorId}`).then((r) => r.json()),
    ]).then(([floors, c]) => {
      const f = floors.find((fl: Floor) => fl.id === floorId)
      setFloor(f ?? null)
      setConstructions(c)
      setLoading(false)
    })
  }, [floorId, projectId])

  const filtered = constructions.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (loading || !floor) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="btn-back" onClick={nav.goBack}><BackIcon /></button>
          <span className="topbar-title">Загрузка...</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn-back" onClick={nav.goBack}><BackIcon /></button>
        <div style={{ flex: 1 }}>
          <div className="topbar-title">{floor.name}</div>
          <div className="topbar-subtitle">{floor.constructions_done}/{floor.constructions_total} изделий смонтировано</div>
        </div>
      </div>

      <div className="screen-content">
        {/* Floor progress */}
        <div style={{ padding: '12px 16px' }}>
          <div className="progress-bar" style={{ marginBottom: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${floor.parts_delivered_pct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>Деталей на объекте: {floor.parts_delivered_pct}%</div>
        </div>

        {/* Search */}
        <div className="search-bar">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Поиск изделий..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

        {/* Construction list */}
        <div className="card-list">
          {filtered.map((c) => (
            <ConstructionCard
              key={c.id}
              construction={c}
              onClick={() => nav.navigate({ name: 'construction', constructionId: c.id })}
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
    </div>
  )
}

function ConstructionCard({ construction: c, onClick }: { construction: Construction; onClick: () => void }) {
  const pct = c.parts_total > 0 ? Math.round((c.parts_on_site / c.parts_total) * 100) : 0
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: 'var(--content-tertiary)', marginTop: 2 }}>{c.code}</div>
        </div>
        <StatusBadge status={c.status} />
      </div>
      <div className="progress-bar" style={{ marginBottom: 4 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>Деталей: {c.parts_on_site}/{c.parts_total}</div>
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
