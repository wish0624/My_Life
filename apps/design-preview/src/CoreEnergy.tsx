import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';

export function CoreMark() {
  return <svg className="core-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="m20 2 15.6 9v18L20 38 4.4 29V11Z" stroke="currentColor" strokeWidth="2" />
    <path d="m20 8 10.4 6v12L20 32 9.6 26V14Z" stroke="currentColor" opacity=".55" />
    <path d="m12 15 8 14 8-14h-4l-4 7-4-7Z" fill="currentColor" /><path d="M17 13h6l-3 5Z" fill="currentColor" />
  </svg>;
}

export function CoreEnergy({ onActivate, igniting, reduced }: {
  onActivate: () => void; igniting: boolean; reduced: boolean;
}) {
  const assembly = useRef<HTMLSpanElement>(null);
  function reset() { assembly.current?.style.removeProperty('transform'); }
  useEffect(() => {
    reset();
    window.addEventListener('blur', reset);
    return () => window.removeEventListener('blur', reset);
  }, [reduced, igniting]);
  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (reduced || igniting || event.pointerType !== 'mouse' || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    if (assembly.current) assembly.current.style.transform = `perspective(850px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg) translate(${x * 8}px, ${y * 6}px)`;
  }
  return <div className="reactor-stage">
    <button type="button" className="reactor-control" aria-label="点亮反应堆，进入模块总览" aria-disabled={igniting} onClick={onActivate}
      onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}>
      <span className="reactor-guides" aria-hidden="true"><i /></span>
      <span className="reactor-orbit" aria-hidden="true" />
      <span ref={assembly} className="reactor-assembly" aria-hidden="true"><img src="/assets/ignition-reactor.webp" width="1254" height="1254" alt="" fetchPriority="high" draggable="false" /><i /></span>
    </button>
    <svg className="reactor-leaders" viewBox="0 0 600 530" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor"><path pathLength="1" d="M405 110l34-36h67"/><path pathLength="1" d="M185 355l-44 48H64"/><circle cx="405" cy="110" r="3"/><circle cx="185" cy="355" r="3"/></g></svg>
  </div>;
}
