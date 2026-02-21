import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BodyMeasurement, BodyStats } from '@/types';
import { bodyStorage } from '@/services/bodyStorage';
import useAuth from './useAuth';

interface UseBodyMeasurementsReturn {
  measurements: BodyMeasurement[];
  isLoading: boolean;
  stats: BodyStats;
  latestMeasurement: BodyMeasurement | null;
  weightChartData: { date: string; weight: number }[];
  bodyFatChartData: { date: string; bodyFat: number }[];
  measurementChartData: (type: 'chest' | 'waist' | 'hips' | 'arms' | 'thighs') => { date: string; value: number }[];
  createMeasurement: (data: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>) => Promise<BodyMeasurement>;
  updateMeasurement: (id: string, data: Partial<BodyMeasurement>) => Promise<BodyMeasurement | null>;
  deleteMeasurement: (id: string) => Promise<boolean>;
  getMeasurementById: (id: string) => BodyMeasurement | null;
  refreshStats: () => void;
}

export function useBodyMeasurements(): UseBodyMeasurementsReturn {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<BodyStats>({
    currentWeight: 0,
    weightChange: 0,
    weightChangePercent: 0,
    minWeight: 0,
    maxWeight: 0,
    avgWeight: 0,
    bmi: 0,
    bmiCategory: 'normal',
  });

  const loadData = useCallback(() => {
    if (!user) {
      setMeasurements([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userMeasurements = bodyStorage.getAll(user.id);
    setMeasurements(userMeasurements);
    
    const latest = bodyStorage.getLatest(user.id);
    const userStats = bodyStorage.getStats(user.id, latest?.height);
    setStats(userStats);
    
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const latestMeasurement = useMemo(() => {
    return measurements[0] || null;
  }, [measurements]);

  const weightChartData = useMemo(() => {
    if (!user) return [];
    return bodyStorage.getWeightChartData(user.id);
  }, [user, measurements]);

  const bodyFatChartData = useMemo(() => {
    if (!user) return [];
    return bodyStorage.getBodyFatChartData(user.id);
  }, [user, measurements]);

  const measurementChartData = useCallback((type: 'chest' | 'waist' | 'hips' | 'arms' | 'thighs') => {
    if (!user) return [];
    return bodyStorage.getMeasurementChartData(user.id, type);
  }, [user, measurements]);

  const createMeasurement = useCallback(async (
    data: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>
  ): Promise<BodyMeasurement> => {
    if (!user) throw new Error('请先登录');
    
    const newMeasurement = bodyStorage.create(user.id, data);
    setMeasurements(prev => [newMeasurement, ...prev]);
    
    // Update stats
    const updatedStats = bodyStorage.getStats(user.id, newMeasurement.height);
    setStats(updatedStats);
    
    return newMeasurement;
  }, [user]);

  const updateMeasurement = useCallback(async (
    id: string, 
    data: Partial<BodyMeasurement>
  ): Promise<BodyMeasurement | null> => {
    if (!user) throw new Error('请先登录');
    
    const updated = bodyStorage.update(user.id, id, data);
    if (updated) {
      setMeasurements(prev => prev.map(m => m.id === id ? updated : m));
      
      // Update stats
      const latest = bodyStorage.getLatest(user.id);
      const updatedStats = bodyStorage.getStats(user.id, latest?.height);
      setStats(updatedStats);
    }
    
    return updated;
  }, [user]);

  const deleteMeasurement = useCallback(async (id: string): Promise<boolean> => {
    if (!user) throw new Error('请先登录');
    
    const success = bodyStorage.delete(user.id, id);
    if (success) {
      setMeasurements(prev => prev.filter(m => m.id !== id));
      
      // Update stats
      const latest = bodyStorage.getLatest(user.id);
      const updatedStats = bodyStorage.getStats(user.id, latest?.height);
      setStats(updatedStats);
    }
    
    return success;
  }, [user]);

  const getMeasurementById = useCallback((id: string): BodyMeasurement | null => {
    if (!user) return null;
    return bodyStorage.getById(user.id, id);
  }, [user]);

  const refreshStats = useCallback(() => {
    if (!user) return;
    const latest = bodyStorage.getLatest(user.id);
    const updatedStats = bodyStorage.getStats(user.id, latest?.height);
    setStats(updatedStats);
  }, [user]);

  return {
    measurements,
    isLoading,
    stats,
    latestMeasurement,
    weightChartData,
    bodyFatChartData,
    measurementChartData,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMeasurementById,
    refreshStats,
  };
}

export default useBodyMeasurements;
