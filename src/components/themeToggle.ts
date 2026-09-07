// ==========================================
// Theme Toggle Component (Floating & Global)
// ==========================================

import { createElement } from '../utils/dom';
import { themeService } from '../services/themeService';

/** Render global floating theme toggle button */
export function renderFloatingThemeToggle(): HTMLElement {
  const existing = document.getElementById('floating-theme-toggle');
  if (existing) existing.remove();

  const button = createElement('button', {
    type: 'button',
    id: 'floating-theme-toggle',
    className: 'floating-theme-btn',
    title: 'Ganti Tampilan (Mode Cerah / Gelap)',
  });

  function updateContent() {
    const isLight = themeService.isLight();
    button.innerHTML = `
      <span class="theme-icon">${isLight ? '🌙' : '☀️'}</span>
      <span class="theme-text">${isLight ? 'Mode Gelap' : 'Mode Cerah'}</span>
    `;
  }

  updateContent();

  button.addEventListener('click', () => {
    themeService.toggleTheme();
  });

  window.addEventListener('app:theme-changed', updateContent);

  return button;
}
