import { useState } from 'react';
import { Plus, TrendingUp, History } from 'lucide-react';
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
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    measurements,
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
      toast.success('保存成功');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleUpdateMeasurement = async (id: string, data: any) => {
    try {
      await updateMeasurement(id, data);
      toast.success('保存成功');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    try {
      await deleteMeasurement(id);
      toast.success('保存成功');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">身体数据</h1>
            <p className="text-[#718096] mt-1">记录并追踪身体变化</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2"
          >
            <Plus className="w-4 h-4" />
            新增记录
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <BodyStatsCards stats={stats} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full overflow-x-auto flex-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger value="trends" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <TrendingUp className="w-4 h-4" />
              趋势
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <History className="w-4 h-4" />
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Weight Trend */}
            <BodyTrendChart
              title="体重趋势"
              data={weightChartData.map(d => ({ date: d.date, value: d.weight }))}
              unit="kg"
              color="#38B2AC"
            />

            {/* Body Fat Trend */}
            {bodyFatChartData.length > 0 && (
              <BodyTrendChart
                title="体脂率趋势"
                data={bodyFatChartData.map(d => ({ date: d.date, value: d.bodyFat }))}
                unit="%"
                color="#F59E0B"
              />
            )}

            {/* Measurement Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              {measurementChartData('waist').length > 0 && (
                <BodyTrendChart
                  title="腰围"
                  data={measurementChartData('waist')}
                  unit="cm"
                  color="#6D28D9"
                  height={250}
                />
              )}
              {measurementChartData('chest').length > 0 && (
                <BodyTrendChart
                  title="胸围"
                  data={measurementChartData('chest')}
                  unit="cm"
                  color="#EF4444"
                  height={250}
                />
              )}
              {measurementChartData('hips').length > 0 && (
                <BodyTrendChart
                  title="臀围"
                  data={measurementChartData('hips')}
                  unit="cm"
                  color="#EC4899"
                  height={250}
                />
              )}
              {measurementChartData('arms').length > 0 && (
                <BodyTrendChart
                  title="臂围"
                  data={measurementChartData('arms')}
                  unit="cm"
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
            <DialogTitle>新增记录</DialogTitle>
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
