import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Scale, TrendingUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useToast } from '@/components/ui/sonner';
import BodyMeasurementForm from '@/components/body/BodyMeasurementForm';
import BodyMeasurementList from '@/components/body/BodyMeasurementList';
import BodyStatsCards from '@/components/body/BodyStatsCards';
import BodyTrendChart from '@/components/body/BodyTrendChart';

export function BodySection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    measurements,
    isLoading,
    stats,
    weightChartData,
    bodyFatChartData,
    measurementChartData,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
  } = useBodyMeasurements();

  const handleCreateMeasurement = async (data: any) => {
    try {
      await createMeasurement(data);
      setIsDialogOpen(false);
      toast.success(t('profile.saveSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleUpdateMeasurement = async (id: string, data: any) => {
    try {
      await updateMeasurement(id, data);
      toast.success(t('profile.saveSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    try {
      await deleteMeasurement(id);
      toast.success(t('profile.saveSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">{t('body.title')}</h1>
            <p className="text-[#718096] mt-1">{t('body.subtitle')}</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('body.addRecord')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <BodyStatsCards stats={stats} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
            <TabsTrigger value="trends" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('body.trend')}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <History className="w-4 h-4" />
              {t('body.history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Weight Trend */}
            <BodyTrendChart
              title={t('body.weightTrend')}
              data={weightChartData.map(d => ({ date: d.date, value: d.weight }))}
              unit={t('common.kg')}
              color="#38B2AC"
            />

            {/* Body Fat Trend */}
            {bodyFatChartData.length > 0 && (
              <BodyTrendChart
                title={t('body.bodyFatTrend')}
                data={bodyFatChartData.map(d => ({ date: d.date, value: d.bodyFat }))}
                unit="%"
                color="#F59E0B"
              />
            )}

            {/* Measurement Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              {measurementChartData('waist').length > 0 && (
                <BodyTrendChart
                  title={t('body.waist')}
                  data={measurementChartData('waist')}
                  unit={t('common.cm')}
                  color="#6D28D9"
                  height={250}
                />
              )}
              {measurementChartData('chest').length > 0 && (
                <BodyTrendChart
                  title={t('body.chest')}
                  data={measurementChartData('chest')}
                  unit={t('common.cm')}
                  color="#EF4444"
                  height={250}
                />
              )}
              {measurementChartData('hips').length > 0 && (
                <BodyTrendChart
                  title={t('body.hips')}
                  data={measurementChartData('hips')}
                  unit={t('common.cm')}
                  color="#EC4899"
                  height={250}
                />
              )}
              {measurementChartData('arms').length > 0 && (
                <BodyTrendChart
                  title={t('body.arms')}
                  data={measurementChartData('arms')}
                  unit={t('common.cm')}
                  color="#10B981"
                  height={250}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <BodyMeasurementList
              measurements={measurements}
              onUpdate={handleUpdateMeasurement}
              onDelete={handleDeleteMeasurement}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Measurement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('body.addRecord')}</DialogTitle>
          </DialogHeader>
          <BodyMeasurementForm
            onSubmit={handleCreateMeasurement}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default BodySection;
