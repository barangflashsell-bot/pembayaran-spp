// ==========================================
// DOM Helper Utilities
// ==========================================

import type { ToastType } from '../types';

/** Query selector shorthand */
export function $(selector: string, parent: Element | Document = document): Element | null {
  return parent.querySelector(selector);
}

/** Query selector all shorthand */
export function $$(selector: string, parent: Element | Document = document): Element[] {
  return Array.from(parent.querySelectorAll(selector));
}

/** Create element with attributes and children */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  ...children: (string | Node)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'innerHTML') {
        el.innerHTML = value;
      } else if (key === 'textContent') {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  }

  return el;
}

/** Set innerHTML safely */
export function setHTML(el: Element, html: string): void {
  el.innerHTML = html;
}

/** Toast notification icons */
const TOAST_ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

/** Show toast notification */
export function showToast(message: string, type: ToastType = 'info', duration: number = 4000): void {
  let container = $('.toast-container');
  if (!container) {
    container = createElement('div', { className: 'toast-container' });
    document.body.appendChild(container);
  }

  const toast = createElement('div', {
    className: `toast toast-${type} toast-enter`,
    innerHTML: `
      <span class="toast-icon">${TOAST_ICONS[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Tutup">×</button>
    `,
  });

  container.appendChild(toast);

  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn?.addEventListener('click', () => removeToast(toast));

  // Auto dismiss
  setTimeout(() => removeToast(toast), duration);
}

/** Remove toast with animation */
function removeToast(toast: Element): void {
  toast.classList.remove('toast-enter');
  toast.classList.add('toast-exit');
  setTimeout(() => toast.remove(), 300);
}

/** Show modal */
export function showModal(title: string, content: HTMLElement | string): HTMLElement {
  // Remove existing modal
  $('.modal-backdrop')?.remove();

  const backdrop = createElement('div', { className: 'modal-backdrop' });

  const modalContent = typeof content === 'string' ? content : '';
  
  const modal = createElement('div', {
    className: 'modal',
    innerHTML: `
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" aria-label="Tutup">×</button>
      </div>
      <div class="modal-body">${modalContent}</div>
    `,
  });

  if (typeof content !== 'string') {
    modal.querySelector('.modal-body')!.appendChild(content);
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Trigger animation
  requestAnimationFrame(() => backdrop.classList.add('visible'));

  // Close handlers
  const closeModal = () => {
    backdrop.classList.remove('visible');
    setTimeout(() => backdrop.remove(), 300);
  };

  backdrop.querySelector('.modal-close')?.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // ESC key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return modal;
}

/** Close modal */
export function closeModal(): void {
  const backdrop = $('.modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('visible');
    setTimeout(() => backdrop.remove(), 300);
  }
}

/** Confirm dialog */
export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const body = createElement('div', {
      innerHTML: `
        <p style="margin-bottom: var(--space-6); color: var(--color-text-secondary); font-size: var(--font-size-sm);">${message}</p>
        <div class="form-actions" style="border-top: none; margin-top: 0; padding-top: 0;">
          <button class="btn btn-secondary" id="confirm-cancel">Batal</button>
          <button class="btn btn-danger" id="confirm-ok">Ya, Lanjutkan</button>
        </div>
      `,
    });

    const modal = showModal('Konfirmasi', body);

    modal.querySelector('#confirm-ok')?.addEventListener('click', () => {
      closeModal();
      resolve(true);
    });

    modal.querySelector('#confirm-cancel')?.addEventListener('click', () => {
      closeModal();
      resolve(false);
    });
  });
}
