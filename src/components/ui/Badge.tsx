interface BadgeProps {
  label: string
  type?: 'status' | 'part' | 'urgency' | 'neutral'
  value?: string
}

const STATUS_LABELS: Record<string, string> = {
  done: 'Готово',
  delivery: 'В доставке',
  shortage: 'Нехватка',
  defect: 'Дефект',
  ready: 'Ожидание',
  cancelled: 'Отменено',
}

const PART_STATUS_LABELS: Record<string, string> = {
  done: 'Смонтировано',
  transit: 'В пути',
  paint: 'Покраска',
  replace: 'Замена',
  warehouse: 'Склад',
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  damage: 'Повреждение',
  replace: 'Замена',
  paint: 'Покраска',
  missing: 'Отсутствует',
  other: 'Прочее',
}

const URGENCY_LABELS: Record<string, string> = {
  high: 'Срочно',
  medium: 'Средне',
  low: 'Не срочно',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        fontSize: '12px',
        fontWeight: 600,
        background: `var(--status-${status}-bg, #f6f6f6)`,
        color: `var(--status-${status}, #545454)`,
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function PartStatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        fontSize: '12px',
        fontWeight: 600,
        background: `var(--status-${status === 'transit' ? 'delivery' : status}-bg, #f6f6f6)`,
        color: `var(--part-${status}, var(--content-secondary))`,
        whiteSpace: 'nowrap',
      }}
    >
      {PART_STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function IssueTypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        fontSize: '12px',
        fontWeight: 600,
        background: type === 'damage' || type === 'replace' ? 'var(--status-defect-bg)' : type === 'paint' ? 'var(--status-shortage-bg)' : 'var(--status-ready-bg)',
        color: type === 'damage' || type === 'replace' ? 'var(--status-defect)' : type === 'paint' ? 'var(--status-shortage)' : 'var(--content-secondary)',
        whiteSpace: 'nowrap',
      }}
    >
      {ISSUE_TYPE_LABELS[type] ?? type}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        fontSize: '12px',
        fontWeight: 600,
        background: urgency === 'high' ? 'var(--status-defect-bg)' : urgency === 'medium' ? 'var(--status-shortage-bg)' : 'var(--status-done-bg)',
        color: urgency === 'high' ? 'var(--urgency-high)' : urgency === 'medium' ? 'var(--urgency-medium)' : 'var(--urgency-low)',
        whiteSpace: 'nowrap',
      }}
    >
      {URGENCY_LABELS[urgency] ?? urgency}
    </span>
  )
}

export default BadgeProps
