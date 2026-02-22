import { Suspense, lazy, useMemo, useState, useEffect } from 'react';
import { Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExerciseForm from '@/components/records/ExerciseForm';
import RecordList from '@/components/records/RecordList';
import { useRecords } from '@/hooks/useRecords';
import { useToast } from '@/components/ui/sonner';
import type { ExerciseType } from '@/types';
import { useLocation, useNavigate } from 'react-router-dom';

const ExerciseCalendar = lazy(() => import('@/components/calendar/ExerciseCalendar'));

export function RecordsSection() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getTabFromPath = (pathname: string) => (pathname.startsWith('/calendar') ? 'calendar' : 'list');
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>(() => getTabFromPath(location.pathname));
  const { records, filteredRecords, filter, setFilter, createRecord, updateRecord, deleteRecord, getCalendarEvents } = useRecords();

  useEffect(() => {
    const nextTab = getTabFromPath(location.pathname);
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [location.pathname, activeTab]);

  const handleCreateRecord = async (data: any) => {
    try {
      await createRecord(data);
      setIsDialogOpen(false);
      toast.success('保存成功');
    } catch {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleUpdateRecord = async (id: string, data: any) => {
    try {
      await updateRecord(id, data);
      toast.success('更新成功');
    } catch {
      toast.error('操作失败，请稍后重试');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteRecord(id);
      toast.success('删除成功');
    } catch {
      toast.error('操作失败，请稍后重试');
    }
  };

  const thisMonthRecords = useMemo(
    () =>
      records.filter((r) => {
        const date = new Date(r.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }),
    [records]
  );

  const favoriteTypeLabel = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    records.forEach((r) => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    const favorite = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    if (!favorite) return '-';
    const labelMap: Record<ExerciseType, string> = {
      running: '跑步',
      walking: '步行',
      cycling: '骑行',
      swimming: '游泳',
      weightlifting: '力量训练',
      yoga: '瑜伽',
      pilates: '普拉提',
      hiit: 'HIIT',
      cardio: '有氧',
      sports: '球类运动',
      other: '其他',
    };
    return labelMap[favorite[0] as ExerciseType] || favorite[0];
  }, [records]);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">运动记录</h1>
            <p className="text-[#718096] mt-1">记录并管理你的训练</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                新增记录
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增记录</DialogTitle>
              </DialogHeader>
              <ExerciseForm onSubmit={handleCreateRecord} onCancel={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const nextTab = value as 'list' | 'calendar';
            setActiveTab(nextTab);
            navigate(nextTab === 'calendar' ? '/calendar' : '/records');
          }}
          className="space-y-6"
        >
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full overflow-x-auto flex-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger value="list" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <Filter className="w-4 h-4" />
              列表
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <Calendar className="w-4 h-4" />
              日历
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">共 {filteredRecords.length} 条记录</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordList records={filteredRecords} onUpdate={handleUpdateRecord} onDelete={handleDeleteRecord} filter={filter} setFilter={setFilter} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            {activeTab === 'calendar' ? (
              <Suspense
                fallback={
                <Card>
                    <CardContent className="h-[360px] flex items-center justify-center text-[#718096]">加载中...</CardContent>
                </Card>
              }
            >
              <ExerciseCalendar events={getCalendarEvents()} />
            </Suspense>
            ) : null}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">本月次数</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">{thisMonthRecords.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">本月时长</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {thisMonthRecords.reduce((sum, r) => sum + r.duration, 0)}
                <span className="text-sm font-normal text-[#718096] ml-1">分钟</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">平均时长</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {records.length > 0 ? Math.round(records.reduce((sum, r) => sum + r.duration, 0) / records.length) : 0}
                <span className="text-sm font-normal text-[#718096] ml-1">分钟</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-[#718096]">最常训练</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">{favoriteTypeLabel}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default RecordsSection;
