import { useState } from 'react'
import { NavHook } from '../../hooks/useNav'

interface LoginProps {
  nav: NavHook
}

type Step = 'invite' | 'phone' | 'otp' | 'profile' | 'welcome'

export function LoginScreen({ nav }: LoginProps) {
  const [step, setStep] = useState<Step>('invite')
  const [phone, setPhone] = useState('+972 ')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')

  const DEMO_CODE = '1234'

  if (step === 'invite') {
    return (
      <LoginLayout>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📲</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Добро пожаловать</h1>
        <p style={{ fontSize: 15, color: 'var(--content-secondary)', textAlign: 'center', marginBottom: 40 }}>
          TimTrack помогает монтажникам отслеживать мебель на строительных объектах
        </p>
        <button className="btn btn-primary" onClick={() => setStep('phone')}>
          Войти по SMS-коду
        </button>
        <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => nav.reset({ name: 'home' })}>
          Демо-вход (без авторизации)
        </button>
      </LoginLayout>
    )
  }

  if (step === 'phone') {
    return (
      <LoginLayout>
        <button className="btn-back" style={{ alignSelf: 'flex-start', marginBottom: 24 }} onClick={() => setStep('invite')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ваш номер телефона</h2>
        <p style={{ fontSize: 14, color: 'var(--content-secondary)', marginBottom: 32 }}>Мы отправим SMS с кодом подтверждения</p>
        <div className="form-group" style={{ width: '100%' }}>
          <label className="form-label">Номер телефона</label>
          <input
            className="search-input"
            style={{ paddingLeft: 16, width: '100%', borderRadius: 'var(--r)', background: 'var(--bg-secondary)' }}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" onClick={() => setStep('otp')} disabled={phone.length < 10}>
          Получить код
        </button>
      </LoginLayout>
    )
  }

  if (step === 'otp') {
    return (
      <LoginLayout>
        <button className="btn-back" style={{ alignSelf: 'flex-start', marginBottom: 24 }} onClick={() => setStep('phone')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Введите код</h2>
        <p style={{ fontSize: 14, color: 'var(--content-secondary)', marginBottom: 32 }}>
          Отправили код на {phone}. Для демо: <strong>{DEMO_CODE}</strong>
        </p>
        <div className="form-group" style={{ width: '100%' }}>
          <label className="form-label">Код из SMS</label>
          <input
            className="search-input"
            style={{ paddingLeft: 16, width: '100%', borderRadius: 'var(--r)', background: 'var(--bg-secondary)', textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: 700 }}
            type="number"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 4))}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" onClick={() => setStep('profile')} disabled={otp.length < 4}>
          Подтвердить
        </button>
      </LoginLayout>
    )
  }

  if (step === 'profile') {
    return (
      <LoginLayout>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ваше имя</h2>
        <p style={{ fontSize: 14, color: 'var(--content-secondary)', marginBottom: 32 }}>Как вас зовут? Это увидят коллеги</p>
        <div className="form-group" style={{ width: '100%' }}>
          <label className="form-label">Имя</label>
          <input
            className="search-input"
            style={{ paddingLeft: 16, width: '100%', borderRadius: 'var(--r)', background: 'var(--bg-secondary)' }}
            type="text"
            placeholder="Иван И."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <button className="btn btn-primary" onClick={() => setStep('welcome')} disabled={name.length < 2}>
          Продолжить
        </button>
      </LoginLayout>
    )
  }

  // Welcome
  return (
    <LoginLayout>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Готово, {name}!</h2>
      <p style={{ fontSize: 15, color: 'var(--content-secondary)', textAlign: 'center', marginBottom: 40 }}>
        Теперь вы можете отслеживать монтаж мебели на своих объектах
      </p>
      <button className="btn btn-primary" onClick={() => nav.reset({ name: 'home' })}>
        Начать работу
      </button>
    </LoginLayout>
  )
}

function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 12,
        background: 'var(--bg-primary)',
        width: '100%',
      }}
    >
      {children}
    </div>
  )
}
