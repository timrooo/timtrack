export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '2px solid var(--border-opaque)',
        borderTopColor: 'var(--content-primary)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  )
}
