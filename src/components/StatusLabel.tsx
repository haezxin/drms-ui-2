import React from 'react';
import { PulseDot } from './PulseDot';
import { toneFor, toneDotClass, toneTextClass } from '../utils/status';
import type { Tone } from '../types/mission';

interface StatusLabelProps {
  value: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  muted?: boolean;
  variant?: 'mono' | 'display';
  className?: string;
}

/** "● ACTIVE" — a small instrument indicator, never a pill. */
export function StatusLabel({
  value,
  tone,
  dot,
  pulse = false,
  muted = false,
  variant = 'mono',
  className = ''
}: StatusLabelProps) {
  const resolved: Tone = tone ?? (typeof value === 'string' ? toneFor(value) : 'neutral');
  const showDot = dot ?? resolved !== 'neutral';
  const color = muted ? 'text-ink-tertiary' : toneTextClass[resolved];
  const font = variant === 'display' ? 'font-display font-semibold' : 'font-mono';
  const dotSize = variant === 'display' ? 'h-[7px] w-[7px]' : 'h-[5px] w-[5px]';

  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap tabular-nums ${font} ${color} ${className}`}>
      {showDot && (
      pulse ?
      <PulseDot tone={resolved} /> :

      <span aria-hidden className={`${dotSize} shrink-0 rounded-full ${toneDotClass[resolved]}`} />)
      }
      {value}
    </span>);

}