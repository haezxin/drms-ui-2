import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneId } from '../../data/missionData';

/**
 * Demonstrates the one-drone / one-module physical constraint as a real interaction: Dispatcher and
 * Field Operator can attempt a deployment, but the drone can only carry one module per flight, so the
 * attempt is always refused while a mission is active. Responder has no deployment capability at all,
 * so this renders nothing for that role. Sits inline in the DRONE & MODULE STATUS header rather than
 * as its own section — it's a single related action, not a standalone topic.
 */
export function ModuleDeployment() {
  const ops = useOperations();
  const { can } = useSession();
  const [attempted, setAttempted] = useState(false);

  if (!can('module.deploy')) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAttempted(true)}
        className="shrink-0 font-mono text-[10px] tracking-widest2 text-ink-secondary underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink-primary">
        
        DEPLOY MODULE
      </button>
      <AnimatePresence initial={false}>
        {attempted &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="order-last w-full basis-full overflow-hidden">
          
            <p
            role="alert"
            className={`mt-1 border-l-2 py-0.5 pl-4 text-[13px] leading-snug ${
            ops.missionActive ? 'border-accent-warning text-ink-primary' : 'border-line-strong text-ink-secondary'}`
            }>
            
              {ops.missionActive ?
            `${droneId} already has an active mission. Another module cannot be activated during this flight.` :
            'No active mission. Starting a new deployment is managed outside this prototype.'}
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}