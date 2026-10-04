import React from 'react';
import type { ModuleType } from '../../types/mission';
import { detections } from '../../data/missionData';
import { useSession } from '../../hooks/useSession';
import { FireFocal } from './FireFocal';
import { FloodFocal } from './FloodFocal';
import { BeaconFocal } from './BeaconFocal';

/**
 * The primary real-time surface — owned by whichever module the current mission carries.
 * Every role sees the same core visual; `detailed` only governs secondary engineering readouts
 * (confidence scores, ML state) that Dispatcher and Field Operator need but Responder doesn't.
 */
export function LiveFocal({ module }: {module: ModuleType;}) {
  const { role } = useSession();
  const detailed = role !== 'responder';

  switch (module) {
    case 'fire':
      return <FireFocal detections={detections} detailed={detailed} />;
    case 'flood':
      return <FloodFocal />;
    case 'beacon':
      return <BeaconFocal />;
    default:
      return null;
  }
}