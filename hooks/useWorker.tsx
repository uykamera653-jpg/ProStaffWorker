import { useContext } from 'react';
import { WorkerContext } from '../contexts/WorkerContext';

export function useWorker() {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within WorkerProvider');
  }
  return context;
}
