import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { buildOperations } from '../utils/operations';
import type {
  MissionCommandActions,
  MissionStatus,
  ModuleLifecycleStatus,
  ModuleType,
  OperationsSnapshot,
  SignalCondition } from
'../types/mission';

type DeployableModule = Extract<ModuleType, 'fire' | 'flood'>;

const OperationsContext = createContext<OperationsSnapshot | undefined>(undefined);

interface OperationsProviderProps {
  signalCondition: SignalCondition;
  children: React.ReactNode;
}

export function OperationsProvider({ signalCondition, children }: OperationsProviderProps) {
  const [selectedModule, setSelectedModule] = useState<DeployableModule | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [lastModule, setLastModule] = useState<DeployableModule>('flood');
  const [moduleStatus, setModuleStatus] = useState<ModuleLifecycleStatus>('none');
  const [missionStatus, setMissionStatus] = useState<MissionStatus>('none');

  const startMission = useCallback(() => {
    if (missionStatus === 'active' || missionStatus === 'deploying') return;
    setSelectedModule(null);
    setActiveModule(null);
    setModuleStatus('available');
    setMissionStatus('draft');
  }, [missionStatus]);

  const selectModule = useCallback((module: DeployableModule) => {
    if (missionStatus === 'active' || missionStatus === 'deploying') return;
    setSelectedModule(module);
    setActiveModule(null);
    setModuleStatus('selected');
    setMissionStatus('preparing');
  }, [missionStatus]);

  const attachModule = useCallback(() => {
    if (!selectedModule || moduleStatus !== 'selected') return;
    setModuleStatus('attached');
  }, [moduleStatus, selectedModule]);

  const detectModule = useCallback(() => {
    if (!selectedModule || moduleStatus !== 'attached') return;
    setModuleStatus('detected');
  }, [moduleStatus, selectedModule]);

  const runPreflight = useCallback(() => {
    if (!selectedModule || moduleStatus !== 'detected') return;
    setModuleStatus('deployment-ready');
    setMissionStatus('ready');
  }, [moduleStatus, selectedModule]);

  const deployModule = useCallback(() => {
    if (!selectedModule || moduleStatus !== 'deployment-ready') return;
    setModuleStatus('deploying');
    setMissionStatus('deploying');
  }, [moduleStatus, selectedModule]);

  const completeDeployment = useCallback(() => {
    if (!selectedModule || moduleStatus !== 'deploying') return;
    setActiveModule(selectedModule);
    setLastModule(selectedModule);
    setModuleStatus('active');
    setMissionStatus('active');
  }, [moduleStatus, selectedModule]);

  const endMission = useCallback(() => {
    if (activeModule === 'fire' || activeModule === 'flood') setLastModule(activeModule);
    setActiveModule(null);
    setSelectedModule(null);
    setModuleStatus('inactive');
    setMissionStatus('completed');
    window.setTimeout(() => {
      setModuleStatus('none');
      setMissionStatus('none');
    }, 250);
  }, [activeModule]);

  const cancelMission = useCallback(() => {
    if (missionStatus === 'active' || missionStatus === 'deploying') return;
    setSelectedModule(null);
    setActiveModule(null);
    setModuleStatus('none');
    setMissionStatus('none');
  }, [missionStatus]);

  const actions: MissionCommandActions = useMemo(
    () => ({
      startMission,
      selectModule,
      attachModule,
      detectModule,
      runPreflight,
      deployModule,
      completeDeployment,
      endMission,
      cancelMission
    }),
    [attachModule, cancelMission, completeDeployment, deployModule, detectModule, endMission, runPreflight, selectModule, startMission]
  );

  const value = useMemo(
    () => buildOperations({
      activeModule,
      selectedModule,
      moduleStatus,
      missionStatus,
      signalCondition,
      lastModule,
      actions
    }),
    [activeModule, actions, lastModule, missionStatus, moduleStatus, selectedModule, signalCondition]
  );

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within an OperationsProvider');
  return ctx;
}
