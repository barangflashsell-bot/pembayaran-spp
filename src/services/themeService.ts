// ==========================================
// Theme Service — Light & Dark Mode Management
// ==========================================

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'spp_theme_preference';

class ThemeService {
  private currentTheme: ThemeMode = 'dark';

  constructor() {
    this.init();
  }

  private init(): void {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') {
      this.currentTheme = saved;
    } else {
      this.currentTheme = 'dark';
    }
    this.applyTheme(this.currentTheme);
  }

  public getTheme(): ThemeMode {
    return this.currentTheme;
  }

  public isLight(): boolean {
    return this.currentTheme === 'light';
  }

  public setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
    window.dispatchEvent(new CustomEvent('app:theme-changed', { detail: { theme } }));
  }

  public toggleTheme(): ThemeMode {
    const next = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }
}

export const themeService = new ThemeService();
