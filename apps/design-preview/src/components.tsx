import { useEffect, useId, useRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type IconName = 'arrow' | 'chevron' | 'check' | 'close' | 'menu' | 'hanger' | 'grid' | 'sun' | 'moon' | 'spark' | 'user' | 'plus' | 'refresh' | 'layers';
const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  hanger: <><path d="M9 6a3 3 0 1 1 4 2.8L12 10v2L3 17a1.2 1.2 0 0 0 .6 2h16.8a1.2 1.2 0 0 0 .6-2l-9-5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>,
  moon: <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z" />,
  spark: <><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" /><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 6a8 8 0 0 1 14 6M4 12a8 8 0 0 0 14 6" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
};
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function Button({ variant = 'primary', size = 'md', loading, children, className = '', onClick, ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; loading?: boolean }) {
  return <button type="button" {...props} className={`button button--${variant} button--${size} ${className}`}
    aria-busy={loading || undefined} aria-disabled={loading || props.disabled || undefined}
    onClick={e => { if (!loading && !props.disabled) onClick?.(e); }}>
    {loading && <span className="spinner" aria-hidden="true" />}{children}
  </button>;
}
export function Badge({ children, kind = 'neutral' }: { children: ReactNode; kind?: 'neutral' | 'success' | 'info' | 'warning' }) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}
export function Photo({ name, alt, className = '', eager = false }: { name: 'jacket' | 'wardrobe' | 'portrait'; alt: string; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  return <img ref={ref} className={className} src={`/assets/${name}.webp`} alt={alt}
    width={name === 'jacket' ? 800 : name === 'portrait' ? 720 : 1200}
    height={name === 'jacket' ? 1067 : name === 'portrait' ? 997 : 1500}
    loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async"
    onError={() => { if (ref.current) { ref.current.style.opacity = '0'; ref.current.parentElement?.setAttribute('data-image-error', '图片暂不可用'); } }} />;
}
export function Modal({ title, theme, onClose, children, wide = false, sheet = false }:
  { title: string; theme: Theme; onClose: () => void; children: ReactNode; wide?: boolean; sheet?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const origin = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.querySelector<HTMLElement>('[data-dialog-heading]')?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (origin?.isConnected) origin.focus();
    };
  }, []);
  return <dialog ref={ref} data-theme={theme} aria-labelledby={id}
    className={`dialog ${wide ? 'dialog--wide' : ''} ${sheet ? 'dialog--sheet' : ''}`}
    onKeyDown={e => {
      if (e.key !== 'Tab') return;
      const candidates = [...e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
        .filter(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
      const stops = candidates.filter(el => {
        if (!(el instanceof HTMLInputElement) || el.type !== 'radio' || !el.name) return true;
        const group = candidates.filter(other => other instanceof HTMLInputElement && other.type === 'radio' && other.name === el.name) as HTMLInputElement[];
        return el === (group.find(radio => radio.checked) || group[0]);
      });
      if (!stops.length) { e.preventDefault(); return; }
      e.preventDefault();
      const current = stops.indexOf(document.activeElement as HTMLElement);
      const next = current < 0 ? (e.shiftKey ? stops.length - 1 : 0) : (current + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
      stops[next].focus();
    }}
    onCancel={e => { e.preventDefault(); onClose(); }}
    onClick={e => { if (e.target === e.currentTarget) {
      const box = e.currentTarget.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose();
    } }}>
    <div className="dialog-head"><h2 id={id} tabIndex={-1} data-dialog-heading>{title}</h2>
      <Button variant="ghost" size="sm" className="icon-button" aria-label="关闭弹窗" onClick={onClose}><Icon name="close" /></Button>
    </div><div className="dialog-body">{children}</div>
  </dialog>;
}
