import { useEffect, useState } from 'react'
import { Project } from '../../types'
import { NavHook } from '../../hooks/useNav'
import { StatusBadge } from '../../components/ui/Badge'

interface HomeProps {
  nav: NavHook
}

export function HomeScreen({ nav }: HomeProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const active = projects.filter((p) => p.status !== 'done')
  const archived = projects.filter((p) => p.status === 'done')

  return (
    <div className="screen">
      {/* Top bar */}
      <div className="topbar">
        <div style={{ flex: 1 }}>
          <div className="topbar-title">Мои объекты</div>
          <div className="topbar-subtitle">Вы вошли как Даниил К.</div>
        </div>
        <button
          className="btn btn-icon"
          onClick={() => nav.navigate({ name: 'settings' })}
          aria-label="Настройки"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 10-16 0" />
          </svg>
        </button>
      </div>

      <div className="screen-content">
        {loading ? (
          <div className="empty-state">
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <div className="spinner" />
            </div>
          </div>
        ) : (
          <>
            <div className="section-header">
              <span className="section-title">Активные ({active.length})</span>
              {archived.length > 0 && (
                <button
                  style={{ fontSize: 14, color: 'var(--content-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onClick={() => setShowArchive(true)}
                >
                  Архив
                </button>
              )}
            </div>

            <div className="card-list">
              {active.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => nav.navigate({ name: 'object', projectId: project.id })}
                />
              ))}
              {active.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-text">Нет активных объектов</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Archive modal */}
      {showArchive && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setShowArchive(false)} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Архив</span>
              <button className="bottom-sheet-close" onClick={() => setShowArchive(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              {archived.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => {
                    setShowArchive(false)
                    nav.navigate({ name: 'object', projectId: project.id })
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{project.name}</div>
          <div style={{ fontSize: 13, color: 'var(--content-secondary)', marginTop: 2 }}>
            {project.site_code} · {project.address}
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="progress-bar" style={{ marginBottom: 6 }}>
        <div className="progress-bar-fill" style={{ width: `${project.progress_pct}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: 'var(--content-secondary)' }}>Прогресс монтажа</span>
        <span style={{ fontWeight: 600 }}>{project.progress_pct}%</span>
      </div>
    </div>
  )
}
