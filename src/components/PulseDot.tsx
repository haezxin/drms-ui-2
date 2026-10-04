import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { toneDotClass } from '../utils/status';
import type { Tone } from '../types/mission';

export function PulseDot({ tone = 'critical', className = '' }: {tone?: Tone;className?: string;}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`inline-block h-[5px] w-[5px] shrink-0 rounded-full ${toneDotClass[tone]} ${className}`}
      animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />);


}