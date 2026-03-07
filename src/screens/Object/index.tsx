import { useEffect, useState } from 'react'
import { Floor, Project } from '../../types'
import { NavHook } from '../../hooks/useNav'
import { AIReportBlock } from '../../components/ai/AIReportBlock'

interface ObjectProps {
  nav: NavHook
  projectId: number
}

export function ObjectScreen({ nav, projectId }: ObjectProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [floors, setFloors] = useState<Floor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}`).then((r) => r.json()),
      fetch(`/api/projects/${projectId}/floors`).then((r) => r.json()),
    ]).then(([p, f]) => {
      setProject(p)
      setFloors(f)
      setLoading(false)
    })
  }, [projectId])

  if (loading || !project) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="btn-back" onClick={nav.goBack}>
            <BackIcon />
          </button>
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
        <button className="btn-back" onClick={nav.goBack}>
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}>
          <div className="topbar-title">{project.site_code}</div>
          <div className="topbar-subtitle">{project.name}</div>
        </div>
      </div>

      <div className="screen-content">
        {/* Project summary */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{ fontSize: 13, color: 'var(--content-secondary)', marginBottom: 8 }}>{project.address}</div>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${project.progress_pct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--content-secondary)' }}>Общий прогресс</span>
            <span style={{ fontWeight: 700 }}>{project.progress_pct}%</span>
          </div>
        </div>

        {/* AI Report */}
        <AIReportBlock projectId={projectId} />

        <div className="divider" />

        <div className="section-header">
          <span className="section-title">Этажи ({floors.length})</span>
        </div>

        <div className="card-list">
          {floors.map((floor) => (
            <FloorCard
              key={floor.id}
              floor={floor}
              onClick={() => nav.navigate({ name: 'floor', floorId: floor.id, projectId })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FloorCard({ floor, onClick }: { floor: Floor; onClick: () => void }) {
  const doneCount = floor.constructions_done
  const totalCount = floor.constructions_total
  const pct = floor.parts_delivered_pct

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>{floor.name}</span>
        <span style={{ fontSize: 13, color: 'var(--content-secondary)' }}>
          {doneCount}/{totalCount} изд.
        </span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 6 }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: pct === 100 ? 'var(--status-done)' : undefined }}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--content-tertiary)' }}>Деталей на объекте: {pct}%</div>
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
