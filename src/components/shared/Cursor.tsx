'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 5 + 'px';
        cursorRef.current.style.top = e.clientY - 5 + 'px';
      }
    };
    document.addEventListener('mousemove', move);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x - 18 + 'px';
        ringRef.current.style.top = ring.current.y - 18 + 'px';
      }
      requestAnimationFrame(animate);
    };
    animate();

    const grow = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(2.5)';
      if (ringRef.current) ringRef.current.style.transform = 'scale(1.5)';
    };
    const shrink = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'scale(1)';
      if (ringRef.current) ringRef.current.style.transform = 'scale(1)';
    };

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => document.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed',
        width: '10px', height: '10px',
        background: 'var(--green)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'transform 0.1s',
        mixBlendMode: 'screen',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed',
        width: '36px', height: '36px',
        border: '1px solid var(--green)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0.5,
        transition: 'transform 0.15s ease',
      }} />
    </>
  );
}
