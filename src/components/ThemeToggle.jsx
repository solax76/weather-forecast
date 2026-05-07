const OPTIONS = [
  { value: 'auto',  label: 'Auto',   icon: '🔄' },
  { value: 'light', label: 'Chiaro', icon: '☀️' },
  { value: 'dark',  label: 'Scuro',  icon: '🌙' },
]

export default function ThemeToggle({ preference, onThemeChange }) {
  return (
    <div className="theme-toggle-wrapper">
      <span className="theme-toggle-label">Tema</span>
      <div className="theme-toggle-group" role="group" aria-label="Selezione tema">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`theme-btn ${preference === opt.value ? 'theme-btn-active' : ''}`}
            onClick={() => onThemeChange(opt.value)}
            aria-pressed={preference === opt.value}
            title={opt.label}
          >
            <span className="theme-btn-icon">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
