import { useTheme, Theme } from '../../contexts/ThemeContext';
import { Sun, Moon, Zap, Leaf, Eye, Gamepad2 } from 'lucide-react';

interface ThemeOption {
    id: Theme;
    name: string;
    icon: typeof Sun;
    description: string;
}

const themes: ThemeOption[] = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'amoled', name: 'AMOLED', icon: Zap, description: 'Pure black, saves battery' },
    { id: 'solarized', name: 'Solarized', icon: Leaf, description: 'Warm and balanced' },
    { id: 'high-contrast', name: 'High Contrast', icon: Eye, description: 'Maximum visibility' },
    { id: 'retro', name: 'Retro', icon: Gamepad2, description: 'Classic calculator look' },
];

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Choose Theme
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {themes.map((t) => {
                    const Icon = t.icon;
                    const isActive = theme === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`
                p-3 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center gap-2 text-center
                ${isActive
                                    ? 'border-[var(--accent)] ring-2 ring-[var(--accent)] ring-opacity-50'
                                    : 'border-[var(--border)] hover:border-[var(--accent)]'
                                }
              `}
                            style={{
                                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                            }}
                            aria-pressed={isActive}
                            aria-label={`Select ${t.name} theme`}
                        >
                            <Icon
                                size={24}
                                style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                            />
                            <div>
                                <div className="font-medium text-sm">{t.name}</div>
                                <div
                                    className="text-xs mt-0.5"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {t.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
