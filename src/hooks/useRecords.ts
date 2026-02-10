import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  ExerciseRecord, 
  ExerciseFormData, 
  RecordFilter,
  ExerciseType,
  MoodLevel,
  IntensityLevel 
} from '@/types';
import { recordsStorage } from '@/services/storage';
import useAuth from './useAuth';

interface UseRecordsReturn {
  records: ExerciseRecord[];
  filteredRecords: ExerciseRecord[];
  isLoading: boolean;
  filter: RecordFilter;
  setFilter: (filter: RecordFilter) => void;
  createRecord: (data: ExerciseFormData) => Promise<ExerciseRecord>;
  updateRecord: (id: string, data: Partial<ExerciseFormData>) => Promise<ExerciseRecord | null>;
  deleteRecord: (id: string) => Promise<boolean>;
  getRecordById: (id: string) => ExerciseRecord | null;
  getStatistics: () => {
    totalWorkouts: number;
    totalDuration: number;
    averageDuration: number;
    streakDays: number;
    favoriteType: ExerciseType | null;
    thisWeekWorkouts: number;
    thisWeekDuration: number;
  };
  getChartData: (granularity: 'day' | 'week' | 'month') => { date: string; duration: number; count: number }[];
  getCalendarEvents: () => { id: string; title: string; date: string; type: ExerciseType; duration: number }[];
}

export function useRecords(): UseRecordsReturn {
  const { user, isAuthenticated } = useAuth();
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<RecordFilter>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(true);
      const userRecords = recordsStorage.getByUserId(user.id);
      setRecords(userRecords);
      setIsLoading(false);
    } else {
      setRecords([]);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const filteredRecords = useMemo(() => {
    let result = [...records];

    if (filter.dateRange) {
      result = result.filter(r => 
        r.date >= filter.dateRange!.start && r.date <= filter.dateRange!.end
      );
    }

    if (filter.types?.length) {
      result = result.filter(r => filter.types!.includes(r.type));
    }

    if (filter.moods?.length) {
      result = result.filter(r => filter.moods!.includes(r.mood));
    }

    if (filter.intensity?.length) {
      result = result.filter(r => filter.intensity!.includes(r.intensity));
    }

    return result;
  }, [records, filter]);

  const createRecord = useCallback(async (data: ExerciseFormData): Promise<ExerciseRecord> => {
    if (!user) throw new Error('User not logged in');

    const newRecord = recordsStorage.create({
      ...data,
      userId: user.id,
    });

    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  }, [user]);

  const updateRecord = useCallback(async (id: string, data: Partial<ExerciseFormData>): Promise<ExerciseRecord | null> => {
    const updated = recordsStorage.update(id, data);
    if (updated) {
      setRecords(prev => prev.map(r => r.id === id ? updated : r));
    }
    return updated;
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    const success = recordsStorage.delete(id);
    if (success) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
    return success;
  }, []);

  const getRecordById = useCallback((id: string): ExerciseRecord | null => {
    return records.find(r => r.id === id) || null;
  }, [records]);

  const getStatistics = useCallback(() => {
    const totalWorkouts = records.length;
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    const streakDays = calculateStreak(records);

    const typeCounts: Record<string, number> = {};
    records.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    const favoriteType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] as ExerciseType | null;

    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const thisWeekRecords = records.filter(r => new Date(r.date) >= weekStart);
    const thisWeekWorkouts = thisWeekRecords.length;
    const thisWeekDuration = thisWeekRecords.reduce((sum, r) => sum + r.duration, 0);

    return {
      totalWorkouts,
      totalDuration,
      averageDuration,
      streakDays,
      favoriteType,
      thisWeekWorkouts,
      thisWeekDuration,
    };
  }, [records]);

  const getChartData = useCallback((granularity: 'day' | 'week' | 'month') => {
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dataMap = new Map<string, { duration: number; count: number }>();

    sortedRecords.forEach(record => {
      const date = new Date(record.date);
      let key: string;

      if (granularity === 'day') {
        key = record.date;
      } else if (granularity === 'week') {
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const existing = dataMap.get(key) || { duration: 0, count: 0 };
      dataMap.set(key, {
        duration: existing.duration + record.duration,
        count: existing.count + 1,
      });
    });

    return Array.from(dataMap.entries())
      .map(([date, stats]) => ({
        date,
        duration: stats.duration,
        count: stats.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [records]);

  const getCalendarEvents = useCallback(() => {
    return records.map(r => ({
      id: r.id,
      title: `${getExerciseTypeLabel(r.type)} - ${r.duration}min`,
      date: r.date,
      type: r.type,
      duration: r.duration,
    }));
  }, [records]);

  return {
    records,
    filteredRecords,
    isLoading,
    filter,
    setFilter,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordById,
    getStatistics,
    getChartData,
    getCalendarEvents,
  };
}

function calculateStreak(records: ExerciseRecord[]): number {
  if (records.length === 0) return 0;

  const sortedDates = [...new Set(records.map(r => r.date))].sort().reverse();
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}

function getExerciseTypeLabel(type: ExerciseType): string {
  const labels: Record<ExerciseType, string> = {
    running: 'Running',
    walking: 'Walking',
    cycling: 'Cycling',
    swimming: 'Swimming',
    weightlifting: 'Weights',
    yoga: 'Yoga',
    pilates: 'Pilates',
    hiit: 'HIIT',
    cardio: 'Cardio',
    sports: 'Sports',
    other: 'Other',
  };
  return labels[type] || type;
}

export default useRecords;
