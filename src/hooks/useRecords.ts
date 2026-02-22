import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  ExerciseRecord,
  ExerciseFormData,
  RecordFilter,
  ExerciseType,
  MoodLevel,
  IntensityLevel,
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
    if (!user) throw new Error('请先登录');

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

    const favoriteType = Object.keys(typeCounts).reduce((a, b) =>
      typeCounts[a] > typeCounts[b] ? a : b,
      Object.keys(typeCounts)[0] || null
    ) as ExerciseType | null;

    const thisWeek = getThisWeekRecords(records);
    const thisWeekWorkouts = thisWeek.length;
    const thisWeekDuration = thisWeek.reduce((sum, r) => sum + r.duration, 0);

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
    if (granularity === 'day') return getDailyData(records);
    if (granularity === 'week') return getWeeklyData(records);
    return getMonthlyData(records);
  }, [records]);

  const getCalendarEvents = useCallback(() => {
    return records.map((r) => ({
      id: r.id,
      title: r.type,
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

  const sortedDates = [...new Set(records.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
}

function getThisWeekRecords(records: ExerciseRecord[]): ExerciseRecord[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  return records.filter(r => new Date(r.date) >= startOfWeek);
}

function getDailyData(records: ExerciseRecord[]) {
  const dataMap: Record<string, { duration: number; count: number }> = {};
  records.forEach((r) => {
    if (!dataMap[r.date]) {
      dataMap[r.date] = { duration: 0, count: 0 };
    }
    dataMap[r.date].duration += r.duration;
    dataMap[r.date].count += 1;
  });

  return Object.entries(dataMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, ...value }));
}

function getWeeklyData(records: ExerciseRecord[]) {
  const dataMap: Record<string, { duration: number; count: number }> = {};
  records.forEach((r) => {
    const date = new Date(r.date);
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const key = start.toISOString().split('T')[0];
    if (!dataMap[key]) {
      dataMap[key] = { duration: 0, count: 0 };
    }
    dataMap[key].duration += r.duration;
    dataMap[key].count += 1;
  });

  return Object.entries(dataMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, ...value }));
}

function getMonthlyData(records: ExerciseRecord[]) {
  const dataMap: Record<string, { duration: number; count: number }> = {};
  records.forEach((r) => {
    const key = r.date.substring(0, 7);
    if (!dataMap[key]) {
      dataMap[key] = { duration: 0, count: 0 };
    }
    dataMap[key].duration += r.duration;
    dataMap[key].count += 1;
  });

  return Object.entries(dataMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, ...value }));
}

export default useRecords;
