import { useState } from 'react';
import { Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExerciseForm from '@/components/records/ExerciseForm';
import RecordList from '@/components/records/RecordList';
import ExerciseCalendar from '@/components/calendar/ExerciseCalendar';
import { useRecords } from '@/hooks/useRecords';
import { useToast } from '@/components/ui/sonner';

export function RecordsSection() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    records,
    filteredRecords,
    filter,
    setFilter,
    createRecord,
    updateRecord,
    deleteRecord,
    getCalendarEvents,
  } = useRecords();

  const handleCreateRecord = async (data: any) => {
    try {
      await createRecord(data);
      setIsDialogOpen(false);
      toast.success('运动记录已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    }
  };

  const handleUpdateRecord = async (id: string, data: any) => {
    try {
      await updateRecord(id, data);
      toast.success('记录已更新');
    } catch (error) {
      toast.error('更新失败，请重试');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteRecord(id);
      toast.success('记录已删除');
    } catch (error) {
      toast.error('删除失败，请重试');
    }
  };

  const calendarEvents = getCalendarEvents();

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">运动记录</h1>
            <p className="text-[#718096] mt-1">记录和管理你的每一次运动</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2">
                <Plus className="w-4 h-4" />
                添加记录
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>记录新运动</DialogTitle>
              </DialogHeader>
              <ExerciseForm
                onSubmit={handleCreateRecord}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
            <TabsTrigger 
              value="list" 
              className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2"
            >
              <Filter className="w-4 h-4" />
              列表视图
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2"
            >
              <Calendar className="w-4 h-4" />
              日历视图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">所有记录</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordList
                  records={filteredRecords}
                  onUpdate={handleUpdateRecord}
                  onDelete={handleDeleteRecord}
                  filter={filter}
                  setFilter={setFilter}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <ExerciseCalendar
              events={calendarEvents}
              onDateClick={(date) => {
                console.log('Date clicked:', date);
              }}
              onEventClick={(eventId) => {
                console.log('Event clicked:', eventId);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">本月记录</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {records.filter(r => {
                  const date = new Date(r.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">本月时长</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {records.filter(r => {
                  const date = new Date(r.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).reduce((sum, r) => sum + r.duration, 0)}
                <span className="text-sm font-normal text-[#718096] ml-1">分钟</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">平均时长</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {records.length > 0 
                  ? Math.round(records.reduce((sum, r) => sum + r.duration, 0) / records.length)
                  : 0}
                <span className="text-sm font-normal text-[#718096] ml-1">分钟</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">最爱运动</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {(() => {
                  const typeCounts: Record<string, number> = {};
                  records.forEach(r => {
                    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
                  });
                  const favorite = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
                  if (!favorite) return '-';
                  const labels: Record<string, string> = {
                    running: '跑步',
                    walking: '步行',
                    cycling: '骑行',
                    swimming: '游泳',
                    weightlifting: '力量',
                    yoga: '瑜伽',
                    pilates: '普拉提',
                    hiit: 'HIIT',
                    cardio: '有氧',
                    sports: '球类',
                    other: '其他',
                  };
                  return labels[favorite[0]] || favorite[0];
                })()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default RecordsSection;
