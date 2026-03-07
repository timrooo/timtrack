import { NavHook } from '../../hooks/useNav'

interface SettingsProps {
  nav: NavHook
}

export function SettingsScreen({ nav }: SettingsProps) {
  const sections = [
    {
      title: 'Профиль',
      items: [
        { label: 'Имя', value: 'Даниил К.' },
        { label: 'Телефон', value: '+972 50 123 4567' },
        { label: 'Роль', value: 'Монтажник' },
      ],
    },
    {
      title: 'Настройки',
      items: [
        { label: 'Язык', value: 'Русский' },
        { label: 'Уведомления', value: 'Включены' },
      ],
    },
    {
      title: 'Документы',
      items: [
        { label: 'Инструкция', value: '' },
        { label: 'Политика конфиденциальности', value: '' },
      ],
    },
  ]

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title">Настройки</div>
      </div>

      <div className="screen-content">
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px 24px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: 'var(--bg-inverse)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--content-inverse)',
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Д
          </div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Даниил К.</div>
          <div style={{ fontSize: 14, color: 'var(--content-secondary)', marginTop: 4 }}>Монтажник · PDC05</div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <div className="section-header">
              <span className="section-title" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--content-tertiary)' }}>
                {section.title}
              </span>
            </div>
            <div style={{ margin: '0 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-opaque)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: idx < section.items.length - 1 ? '1px solid var(--border-opaque)' : 'none',
                    cursor: item.value ? 'default' : 'pointer',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.value && <span style={{ fontSize: 15, color: 'var(--content-secondary)' }}>{item.value}</span>}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--content-tertiary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div style={{ padding: '24px 16px 16px' }}>
          <button
            className="btn btn-ghost"
            onClick={() => nav.reset({ name: 'login' })}
            style={{ color: 'var(--status-defect)', borderColor: 'var(--status-defect)' }}
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  )
}
