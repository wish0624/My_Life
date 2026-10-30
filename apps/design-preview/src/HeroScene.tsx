import { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { Photo } from './components';

export function HeroScene({ direction, reduced }: { direction: 'a' | 'b'; reduced: boolean }) {
  const x = useMotionValue(0), y = useMotionValue(0), rotate = useMotionValue(0);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  useEffect(() => { if (reduced) { cancelAnimationFrame(frame.current); x.set(0); y.set(0); rotate.set(0); } }, [reduced, x, y, rotate]);
  const reset = () => { cancelAnimationFrame(frame.current); x.set(0); y.set(0); rotate.set(0); };
  return <div className={`hero-scene scene--${direction}`} role="img"
    aria-label={direction === 'a' ? '原创建筑门廊构图：层叠拱门、石质基座与衣物摄影卡' : '摄影陈列构图：衣架、赤陶色夹克与材质色卡'}
    onPointerLeave={reset}
    onPointerMove={e => {
      if (reduced || !matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)').matches) { reset(); return; }
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - .5, py = (e.clientY - rect.top) / rect.height - .5;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => { x.set(px * 12); y.set(py * 24); rotate.set(px * 4); });
    }}>
    {direction === 'a' ? <>
      <div className="scene-floor" /><div className="portal portal--back" /><div className="portal portal--front"><div className="portal-inset" /></div>
      <div className="stone-plinth" /><div className="stone-shadow" />
      <motion.div className="portal-photo" style={{ x, y, rotateY: rotate }} aria-hidden="true">
        <Photo name="jacket" alt="" eager /><div className="photo-mat"><span>THE EVERYDAY</span><span>01 / 03</span></div>
      </motion.div><span className="scene-coordinate">YOUR SPACE, REIMAGINED.</span>
    </> : <>
      <div className="still-life-floor" />
      <motion.div className="editorial-photo" style={{ x, y }} aria-hidden="true"><Photo name="wardrobe" alt="" eager /></motion.div>
      <motion.div className="object-photo" style={{ rotateY: rotate }} aria-hidden="true"><Photo name="jacket" alt="" eager /><span>01 — THE EVERYDAY JACKET</span></motion.div>
      <div className="material-card" aria-hidden="true"><span>MATERIAL STUDY</span><div className="material-swatches"><i /><i /><i /></div><b>Collected.<br />Not cluttered.</b></div>
      <span className="scene-coordinate">A SMALL COLLECTION OF GOOD THINGS.</span>
    </>}
  </div>;
}
