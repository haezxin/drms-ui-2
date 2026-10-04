import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { MapEntity } from '../../types/mission';

interface TacticalMapProps {
  entities: MapEntity[];
  className?: string;
  annotations?: boolean;
  active?: boolean;
}

const contours = [
'M -5 16 C 20 6, 40 20, 62 12 S 95 4, 110 10',
'M -5 29 C 18 19, 42 35, 64 26 S 92 19, 110 25',
'M -5 43 C 22 33, 38 49, 58 41 S 70 30, 110 38',
'M -5 76 C 24 68, 42 84, 70 74 S 92 70, 110 76',
'M -5 89 C 20 81, 46 97, 72 87 S 96 83, 110 89',
'M 56 50 C 66 42, 82 47, 82 58 S 70 74, 58 70 S 46 58, 56 50 Z',
'M 60 54 C 66 50, 76 53, 76 59 S 68 68, 61 66 S 54 59, 60 54 Z'];

const routePoints = [
  [18, 70],
  [28, 60],
  [37, 52],
  [50, 44],
  [64, 52],
  [72, 62]
];

function buildRoutePath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return '';
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

const hazardMarkers = [
  { x: 36, y: 42, label: 'FLAME', tone: 'critical' },
  { x: 51, y: 55, label: 'FLAME', tone: 'critical' },
  { x: 24, y: 60, label: 'SMOKE', tone: 'warning' }
];

const contourStroke = { stroke: 'rgb(var(--ink-primary) / 0.1)' };
const gridStroke = { stroke: 'rgb(var(--ink-primary) / 0.05)' };
const linkStroke = { stroke: 'rgb(var(--ink-primary) / 0.45)' };
const routeStroke = { stroke: 'rgb(var(--accent-info) / 0.9)' };

export function TacticalMap({ entities, className = '', annotations = true, active = true }: TacticalMapProps) {
  const reduce = useReducedMotion();
  const live = active && entities.length > 0;
  const drone = live ? entities.find((e) => e.kind === 'drone') : undefined;
  const module = live ? entities.find((e) => e.kind === 'module') : undefined;
  const routePath = live ? buildRoutePath([
    ...(drone ? [{ x: drone.x, y: drone.y }] : []),
    ...routePoints.map(([x, y]) => ({ x, y })),
    ...(module ? [{ x: module.x, y: module.y }] : [])
  ]) : '';

  return (
    <div
      role="img"
      aria-label={`Mission map: ${drone?.label ?? 'drone'} and ${module?.label ?? 'active module'}`}
      className={`map-surface relative overflow-hidden border border-line bg-[radial-gradient(circle_at_center,_rgb(var(--surface-2))_0%,_rgb(var(--surface-1))_48%,_rgb(var(--surface-0))_100%)] shadow-[inset_0_0_24px_rgba(255,255,255,0.02)] ${className}`}>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.08),_transparent_60%)]" aria-hidden />
      <div className={`absolute right-3 top-3 z-20 flex items-center gap-2 rounded-[2px] border px-2 py-1 font-mono text-[8px] tracking-[0.2em] ${live ? 'border-ink-primary/30 bg-surface-0/70 text-ink-primary' : 'border-line bg-surface-0/50 text-ink-tertiary'}`}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${live ? 'bg-accent-normal shadow-[0_0_10px_rgba(110,163,124,0.9)]' : 'bg-ink-tertiary'} `} />
        {live ? 'LIVE' : 'NO SIGNAL'}
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`v${i}`} x1={(i + 1) * 10} y1={0} x2={(i + 1) * 10} y2={100} style={gridStroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )}
        {Array.from({ length: 9 }).map((_, i) =>
        <line key={`h${i}`} x1={0} y1={(i + 1) * 10} x2={100} y2={(i + 1) * 10} style={gridStroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )}
        {contours.map((d) =>
        <path key={d} d={d} fill="none" style={contourStroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )}
        {routePath &&
        <path
          d={routePath}
          fill="none"
          style={routeStroke}
          strokeWidth={1.2}
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke" />
        }
        {drone && module &&
        <line
          x1={drone.x}
          y1={drone.y}
          x2={module.x}
          y2={module.y}
          style={linkStroke}
          strokeWidth={1}
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke" />

        }
      </svg>

      {live && hazardMarkers.map((marker) => (
        <div
          key={marker.label + marker.x}
          className="absolute z-10"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
          <span
            aria-hidden
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border ${
              marker.tone === 'critical' ? 'border-accent-critical bg-accent-critical/20' : 'border-accent-warning bg-accent-warning/20'
            }`} style={{ width: '16px', height: '16px', boxShadow: marker.tone === 'critical' ? '0 0 18px rgba(214,88,66,0.55)' : '0 0 18px rgba(214,142,66,0.45)' }} />
          <span
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px] border px-1.5 py-0.5 font-mono text-[7px] tracking-[0.2em] ${
              marker.tone === 'critical' ? 'border-accent-critical/70 bg-surface-0 text-accent-critical' : 'border-accent-warning/70 bg-surface-0 text-accent-warning'
            }`} style={{ left: '12px', top: '-12px' }}>
            {marker.label}
          </span>
        </div>
      ))}

      {module &&
      <>
          <div
          aria-hidden
          className="absolute rounded-full border border-dashed border-line-strong bg-surface-0/10"
          style={{ left: `${module.x}%`, top: `${module.y}%`, width: '30%', aspectRatio: '1 / 1', transform: 'translate(-50%, -50%)' }} />
        
          <div className="absolute z-20" style={{ left: `${module.x}%`, top: `${module.y}%` }}>
            <span className="absolute -ml-[5px] -mt-[5px] flex h-2.5 w-2.5 items-center justify-center border border-ink-primary bg-surface-0 shadow-[0_0_12px_rgba(255,255,255,0.5)]">
              <span className="h-[3px] w-[3px] bg-ink-primary" />
            </span>
            <div className="absolute left-3.5 top-1 whitespace-nowrap font-mono text-[9px] leading-tight tracking-widest2">
              <div className="text-ink-primary">{module.label}</div>
              {module.sublabel && <div className="text-ink-tertiary">{module.sublabel}</div>}
            </div>
          </div>
        </>
      }

      {drone &&
      <div className="absolute" style={{ left: `${drone.x}%`, top: `${drone.y}%` }}>
          {!reduce &&
        <motion.span
          aria-hidden
          className="absolute -ml-3 -mt-3 h-6 w-6 rounded-full border border-ink-primary/40"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />

        }
          <svg
          aria-hidden
          width={14}
          height={14}
          viewBox="0 0 14 14"
          className="absolute -ml-[7px] -mt-[7px]"
          style={{ transform: `rotate(${drone.heading ?? 0}deg)` }}>
          
            <path d="M7 1 L12 12 L7 9.5 L2 12 Z" style={{ fill: 'rgb(var(--ink-primary))' }} />
          </svg>
          <div className="absolute -top-1 right-3.5 whitespace-nowrap text-right font-mono text-[9px] leading-tight tracking-widest2">
            <div className="text-ink-primary">{drone.label}</div>
            {drone.sublabel && <div className="text-ink-tertiary">{drone.sublabel}</div>}
          </div>
        </div>
      }

      {annotations &&
      <>
          <div className="absolute left-4 top-4 flex flex-col items-center gap-1 font-mono text-[9px] tracking-widest2 text-ink-tertiary">
            <span>N</span>
            <span aria-hidden className="h-4 w-px bg-ink-tertiary/60" />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[9px] tracking-widest2 text-ink-tertiary">
            <span aria-hidden className="h-px w-10 bg-ink-tertiary" />
            100 M
          </div>
          <div className="absolute bottom-4 right-4 rounded-[2px] border border-line bg-surface-0/80 px-2 py-1 font-mono text-[8px] tracking-[0.2em] text-ink-secondary">
            SECTOR A1
          </div>
        </>
      }
    </div>);

}