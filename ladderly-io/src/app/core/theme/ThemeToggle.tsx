import { useTheme } from './ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="mx-2 rounded-lg bg-white p-2"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <div className="flex size-5 items-center justify-center">🌙</div>
      ) : (
        <div className="flex size-5 items-center justify-center">☀️</div>
      )}
    </button>
  )
}
