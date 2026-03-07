import { Screen } from '../../types'

interface BottomNavProps {
  current: Screen
  onNavigate: (screen: Screen) => void
}

const TABS = [
  {
    name: 'home' as const,
    label: 'Объекты',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: 'scanner' as const,
    label: 'Сканер',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="16" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="16" width="5" height="5" rx="1" />
        <path d="M21 16h-3a2 2 0 00-2 2v3" />
        <path d="M21 21v-1" />
        <path d="M12 3v3" />
        <path d="M12 9v1" />
        <path d="M3 12h3" />
        <path d="M9 12h1" />
        <path d="M12 12h1" />
        <path d="M15 12h1" />
        <path d="M12 15v3" />
        <path d="M12 21v-1" />
      </svg>
    ),
  },
  {
    name: 'settings' as const,
    label: 'Настройки',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
]

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  const activeTab = ['scanner', 'settings'].includes(current.name) ? current.name : 'home'

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 72,
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-opaque)',
        display: 'flex',
        zIndex: 50,
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.name
        return (
          <button
            key={tab.name}
            onClick={() => onNavigate({ name: tab.name } as Screen)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: active ? 'var(--content-primary)' : 'var(--content-tertiary)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {tab.icon(active)}
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
