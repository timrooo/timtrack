interface FilterChipsProps {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}

export function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <div className="filter-chips">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`chip ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
