import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BAR_COUNT = 28;

/**
 * Stylized outgoing-audio indicator — bars only move while actually transmitting, never implying
 * activity that isn't happening.
 */
export function AudioActivity({ active }: {active: boolean;}) {
  const reduce = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={active ? 'Outgoing audio activity' : 'No audio activity'}
      className="flex h-14 items-end gap-[3px] border-y border-line px-0.5 py-2">
      
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const base = 10 + i * 7 % 5 * 4;
        const peak = 30 + i * 13 % 60;
        return (
          <motion.span
            key={i}
            className="w-full rounded-[1px] bg-ink-primary"
            style={{ opacity: active ? 0.75 : 0.25 }}
            animate={
            active && !reduce ?
            { height: [`${base}%`, `${peak}%`, `${base + 10}%`] } :
            { height: `${Math.min(base, 16)}%` }
            }
            transition={
            active && !reduce ?
            { duration: 0.7 + i % 4 * 0.12, repeat: Infinity, ease: 'easeInOut', delay: i % 7 * 0.04 } :
            { duration: 0.2 }
            } />);


      })}
    </div>);

}