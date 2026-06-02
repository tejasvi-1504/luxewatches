import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const isHovering = useRef(false);

  const springX = useSpring(cursorX, { stiffness: 120, damping: 18 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    const onEnter = () => { isHovering.current = true; };
    const onLeave = () => { isHovering.current = false; };

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => window.removeEventListener('mousemove', move);
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#C9A84C]/60 pointer-events-none z-[9999] mix-blend-difference"
      />
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#C9A84C] pointer-events-none z-[9999]"
      />
    </>
  );
}
