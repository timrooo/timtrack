import { useState } from 'react'
import { NavHook } from '../../hooks/useNav'

interface ScannerProps {
  nav: NavHook
}

export function ScannerScreen({ nav }: ScannerProps) {
  const [showResult, setShowResult] = useState(false)

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title">QR-сканер</div>
      </div>

      <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Camera placeholder */}
        <div
          style={{
            flex: 1,
            background: '#0a0a0a',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 320,
          }}
        >
          {/* Viewfinder */}
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            {/* Corner brackets */}
            {[
              { top: 0, left: 0, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '4px 0 0 0' },
              { top: 0, right: 0, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 4px 0 0' },
              { bottom: 0, left: 0, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 4px' },
              { bottom: 0, right: 0, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 4px 0' },
            ].map((style, i) => (
              <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...style as React.CSSProperties }} />
            ))}
            {/* Scan line */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                right: 10,
                top: '50%',
                height: 2,
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 1,
              }}
            />
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Наведите камеру на QR-код детали
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <button className="btn btn-ghost" onClick={() => setShowResult(true)}>
            Симулировать сканирование
          </button>
        </div>
      </div>

      {/* Scan result bottom sheet */}
      {showResult && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setShowResult(false)} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <span className="bottom-sheet-title">Деталь найдена</span>
              <button className="bottom-sheet-close" onClick={() => setShowResult(false)}>✕</button>
            </div>
            <div className="bottom-sheet-body">
              <div
                style={{
                  background: 'var(--status-done-bg)',
                  border: '1px solid var(--status-done)',
                  borderRadius: 'var(--r)',
                  padding: 16,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, background: 'var(--status-done)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Боковая панель левая</div>
                  <div style={{ fontSize: 13, color: 'var(--content-secondary)' }}>WS-A12 · Деталь #1</div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Проект', value: 'PDC05' },
                    { label: 'Этаж', value: 'Этаж 3' },
                    { label: 'Изделие', value: 'Workstation A-12' },
                    { label: 'Статус', value: 'Смонтировано' },
                  ].map((row) => (
                    <div key={row.label}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--content-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{row.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowResult(false)
                  nav.navigate({ name: 'part', partId: 1 })
                }}
              >
                Открыть деталь
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
