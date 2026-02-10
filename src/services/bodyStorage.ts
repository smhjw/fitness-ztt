import type { BodyMeasurement, BodyStats } from '@/types';

const STORAGE_KEY = 'fittrack_body_measurements';

export const bodyStorage = {
  // Get all measurements for a user
  getAll: (userId: string): BodyMeasurement[] => {
    const data = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!data) return [];
    
    const measurements: BodyMeasurement[] = JSON.parse(data);
    return measurements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  // Get measurement by ID
  getById: (userId: string, id: string): BodyMeasurement | null => {
    const measurements = bodyStorage.getAll(userId);
    return measurements.find(m => m.id === id) || null;
  },

  // Get latest measurement
  getLatest: (userId: string): BodyMeasurement | null => {
    const measurements = bodyStorage.getAll(userId);
    return measurements[0] || null;
  },

  // Create new measurement
  create: (userId: string, data: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>): BodyMeasurement => {
    const measurements = bodyStorage.getAll(userId);
    
    const newMeasurement: BodyMeasurement = {
      ...data,
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };
    
    measurements.push(newMeasurement);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(measurements));
    
    return newMeasurement;
  },

  // Update measurement
  update: (userId: string, id: string, updates: Partial<BodyMeasurement>): BodyMeasurement | null => {
    const measurements = bodyStorage.getAll(userId);
    const index = measurements.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    measurements[index] = { ...measurements[index], ...updates };
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(measurements));
    
    return measurements[index];
  },

  // Delete measurement
  delete: (userId: string, id: string): boolean => {
    const measurements = bodyStorage.getAll(userId);
    const filtered = measurements.filter(m => m.id !== id);
    
    if (filtered.length === measurements.length) return false;
    
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
    return true;
  },

  // Get chart data for weight
  getWeightChartData: (userId: string): { date: string; weight: number }[] => {
    const measurements = bodyStorage.getAll(userId);
    return measurements
      .filter(m => m.weight)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({ date: m.date, weight: m.weight }));
  },

  // Get chart data for body fat
  getBodyFatChartData: (userId: string): { date: string; bodyFat: number }[] => {
    const measurements = bodyStorage.getAll(userId);
    return measurements
      .filter(m => m.bodyFat)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({ date: m.date, bodyFat: m.bodyFat }));
  },

  // Get chart data for measurements
  getMeasurementChartData: (userId: string, measurement: 'chest' | 'waist' | 'hips' | 'arms' | 'thighs'): { date: string; value: number }[] => {
    const measurements = bodyStorage.getAll(userId);
    return measurements
      .filter(m => m[measurement])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({ date: m.date, value: m[measurement]! }));
  },

  // Get statistics
  getStats: (userId: string, height?: number): BodyStats => {
    const measurements = bodyStorage.getAll(userId);
    
    if (measurements.length === 0) {
      return {
        currentWeight: 0,
        weightChange: 0,
        weightChangePercent: 0,
        minWeight: 0,
        maxWeight: 0,
        avgWeight: 0,
        bmi: 0,
        bmiCategory: 'normal',
      };
    }

    const weights = measurements.filter(m => m.weight).map(m => m.weight);
    const currentWeight = weights[0];
    const firstWeight = weights[weights.length - 1];
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    
    const weightChange = currentWeight - firstWeight;
    const weightChangePercent = firstWeight ? (weightChange / firstWeight) * 100 : 0;

    // BMI calculation
    let bmi = 0;
    let bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese' = 'normal';
    
    if (height && height > 0) {
      const heightInMeters = height / 100;
      bmi = currentWeight / (heightInMeters * heightInMeters);
      
      if (bmi < 18.5) bmiCategory = 'underweight';
      else if (bmi < 25) bmiCategory = 'normal';
      else if (bmi < 30) bmiCategory = 'overweight';
      else bmiCategory = 'obese';
    }

    // Body fat stats
    const bodyFats = measurements.filter(m => m.bodyFat).map(m => m.bodyFat!);
    const currentBodyFat = bodyFats[0];
    const firstBodyFat = bodyFats[bodyFats.length - 1];
    const bodyFatChange = currentBodyFat !== undefined && firstBodyFat !== undefined 
      ? currentBodyFat - firstBodyFat 
      : undefined;

    return {
      currentWeight,
      weightChange,
      weightChangePercent,
      minWeight,
      maxWeight,
      avgWeight,
      currentBodyFat,
      bodyFatChange,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
    };
  },
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default bodyStorage;
