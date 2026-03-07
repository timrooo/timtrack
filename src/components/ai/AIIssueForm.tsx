import { useState } from 'react'
import { useAIParse } from '../../hooks/useAIParse'
import { ParsedIssue, Part } from '../../types'
import { BottomSheet } from '../ui/BottomSheet'
import { IssueTypeBadge, UrgencyBadge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'

interface AIIssueFormProps {
  open: boolean
  onClose: () => void
  part: Part
  constructionId: number
  onConfirm: (issue: ParsedIssue, rawInput: string) => Promise<void>
}

const ISSUE_TYPES = [
  { value: 'damage', label: 'Повреждение' },
  { value: 'replace', label: 'Замена' },
  { value: 'paint', label: 'Покраска' },
  { value: 'missing', label: 'Отсутствует' },
  { value: 'other', label: 'Прочее' },
]

const URGENCY_OPTS = [
  { value: 'high', label: 'Срочно' },
  { value: 'medium', label: 'Средне' },
  { value: 'low', label: 'Не срочно' },
]

export function AIIssueForm({ open, onClose, part, onConfirm }: AIIssueFormProps) {
  const [rawInput, setRawInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedIssue, setEditedIssue] = useState<ParsedIssue | null>(null)
  const { state, parse, reset } = useAIParse()

  const partContext = `${part.name_ru ?? part.name_he} (${part.dimensions}, ${part.material}, ${part.color})`

  function handleClose() {
    setRawInput('')
    setEditMode(false)
    setEditedIssue(null)
    reset()
    onClose()
  }

  async function handleParse() {
    if (!rawInput.trim()) return
    await parse(rawInput.trim(), partContext)
  }

  async function handleConfirm() {
    const issue = editMode ? editedIssue : state.status === 'done' ? state.result : null
    if (!issue) return
    setSaving(true)
    try {
      await onConfirm(issue, rawInput)
      handleClose()
    } finally {
      setSaving(false)
    }
  }

  function startEdit() {
    if (state.status !== 'done') return
    setEditedIssue({ ...state.result })
    setEditMode(true)
  }

  const parsed = editMode ? editedIssue : state.status === 'done' ? state.result : null

  return (
    <BottomSheet open={open} onClose={handleClose} title="Сообщить о проблеме">
      {/* Step 1: Input */}
      {state.status === 'idle' || state.status === 'error' ? (
        <>
          <div className="form-group">
            <label className="form-label">Опишите проблему</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Например: дверь поцарапана, не та деталь, трещина на панели..."
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              autoFocus
            />
          </div>
          {state.status === 'error' && (
            <p style={{ color: 'var(--status-defect)', fontSize: 14, marginBottom: 16 }}>
              Ошибка: {state.message}. Попробуйте ещё раз.
            </p>
          )}
          <button className="btn btn-primary" onClick={handleParse} disabled={!rawInput.trim()}>
            Анализировать AI
          </button>
        </>
      ) : state.status === 'loading' ? (
        <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner size={32} />
          <p style={{ color: 'var(--content-secondary)', fontSize: 15, margin: 0 }}>Claude анализирует проблему...</p>
        </div>
      ) : (
        /* Step 2: Preview / Edit */
        <>
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--r)',
              padding: '16px',
              marginBottom: 16,
              border: '1px solid var(--border-opaque)',
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--content-tertiary)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Исходный текст
            </p>
            <p style={{ fontSize: 15, margin: 0, color: 'var(--content-secondary)', fontStyle: 'italic' }}>"{rawInput}"</p>
          </div>

          {editMode && editedIssue ? (
            /* Edit form */
            <>
              <div className="form-group">
                <label className="form-label">Тип проблемы</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ISSUE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      className={`chip ${editedIssue.type === t.value ? 'active' : ''}`}
                      onClick={() => setEditedIssue({ ...editedIssue, type: t.value as ParsedIssue['type'] })}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Комментарий</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={editedIssue.comment}
                  onChange={(e) => setEditedIssue({ ...editedIssue, comment: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Срочность</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {URGENCY_OPTS.map((u) => (
                    <button
                      key={u.value}
                      className={`chip ${editedIssue.urgency === u.value ? 'active' : ''}`}
                      onClick={() => setEditedIssue({ ...editedIssue, urgency: u.value as ParsedIssue['urgency'] })}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Preview card */
            parsed && (
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1.5px solid var(--border-opaque)',
                  borderRadius: 'var(--r)',
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <IssueTypeBadge type={parsed.type} />
                  <UrgencyBadge urgency={parsed.urgency} />
                  {parsed.confidence === 'low' && (
                    <span style={{ fontSize: 12, color: 'var(--content-tertiary)', padding: '2px 10px' }}>Низкая уверенность</span>
                  )}
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 15 }}>{parsed.comment}</p>
                {parsed.clarification_needed && (
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--status-shortage)', background: 'var(--status-shortage-bg)', padding: '8px 12px', borderRadius: 'var(--r-sm)' }}>
                    ⚠ {parsed.clarification_needed}
                  </p>
                )}
              </div>
            )
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={editMode ? () => setEditMode(false) : startEdit}>
              {editMode ? '← Назад' : 'Редактировать'}
            </button>
            <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={handleConfirm} disabled={saving}>
              {saving ? <Spinner size={18} /> : 'Подтвердить'}
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  )
}
