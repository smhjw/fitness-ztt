import { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  Flame, 
  Smile, 
  Frown, 
  Meh, 
  Laugh, 
  Annoyed,
  Dumbbell,
  Activity,
  Zap,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ExerciseRecord, ExerciseType, MoodLevel, IntensityLevel } from '@/types';
import ExerciseForm from './ExerciseForm';

interface RecordListProps {
  records: ExerciseRecord[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  filter: {
    types?: ExerciseType[];
    moods?: MoodLevel[];
    intensity?: IntensityLevel[];
  };
  setFilter: (filter: any) => void;
}

const exerciseTypeLabels: Record<ExerciseType, string> = {
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

const intensityLabels: Record<IntensityLevel, { label: string; color: string }> = {
  low: { label: '低强度', color: 'bg-green-100 text-green-700' },
  medium: { label: '中等强度', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: '高强度', color: 'bg-orange-100 text-orange-700' },
  'very-high': { label: '极高强度', color: 'bg-red-100 text-red-700' },
};

const moodIcons: Record<MoodLevel, React.ReactNode> = {
  1: <Frown className="w-4 h-4 text-red-500" />,
  2: <Annoyed className="w-4 h-4 text-orange-500" />,
  3: <Meh className="w-4 h-4 text-yellow-500" />,
  4: <Smile className="w-4 h-4 text-lime-500" />,
  5: <Laugh className="w-4 h-4 text-green-500" />,
};

export function RecordList({ records, onUpdate, onDelete, filter, setFilter }: RecordListProps) {
  const [editingRecord, setEditingRecord] = useState<ExerciseRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleUpdate = (data: any) => {
    if (editingRecord) {
      onUpdate(editingRecord.id, data);
      setEditingRecord(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  const clearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters = filter.types?.length || filter.moods?.length || filter.intensity?.length;

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E6F7F6] flex items-center justify-center">
          <Activity className="w-8 h-8 text-[#38B2AC]" />
        </div>
        <h3 className="text-lg font-medium text-[#333333] mb-1">暂无运动记录</h3>
        <p className="text-[#718096]">开始记录你的第一次运动吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#718096]">
          共 {records.length} 条记录
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`gap-2 ${hasActiveFilters ? 'border-[#38B2AC] text-[#38B2AC]' : ''}`}
        >
          <Filter className="w-4 h-4" />
          筛选
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 bg-[#38B2AC] text-white">
              {(filter.types?.length || 0) + (filter.moods?.length || 0) + (filter.intensity?.length || 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#333333]">筛选条件</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#38B2AC] hover:text-[#2C9B95] flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                清除
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              value={filter.types?.[0] || 'all'}
              onValueChange={(value) => 
                setFilter({ ...filter, types: value === 'all' ? undefined : [value as ExerciseType] })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="运动类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                {Object.entries(exerciseTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.intensity?.[0] || 'all'}
              onValueChange={(value) => 
                setFilter({ ...filter, intensity: value === 'all' ? undefined : [value as IntensityLevel] })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="运动强度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有强度</SelectItem>
                {Object.entries(intensityLabels).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.moods?.[0]?.toString() || 'all'}
              onValueChange={(value) => 
                setFilter({ ...filter, moods: value === 'all' ? undefined : [parseInt(value) as MoodLevel] })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="心情" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有心情</SelectItem>
                <SelectItem value="5">很棒</SelectItem>
                <SelectItem value="4">不错</SelectItem>
                <SelectItem value="3">一般</SelectItem>
                <SelectItem value="2">较差</SelectItem>
                <SelectItem value="1">很差</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Records List */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="group p-4 bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F7F6] flex items-center justify-center">
                    {record.type === 'weightlifting' ? (
                      <Dumbbell className="w-5 h-5 text-[#38B2AC]" />
                    ) : record.type === 'hiit' ? (
                      <Zap className="w-5 h-5 text-[#38B2AC]" />
                    ) : (
                      <Activity className="w-5 h-5 text-[#38B2AC]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#333333]">
                      {exerciseTypeLabels[record.type]}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#718096]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.duration} 分钟
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={intensityLabels[record.intensity].color}>
                    {intensityLabels[record.intensity].label}
                  </Badge>
                  <span className="text-[#718096]">{moodIcons[record.mood]}</span>
                </div>
              </div>

              {record.notes && (
                <p className="mt-3 text-sm text-[#718096] pl-[52px]">
                  {record.notes}
                </p>
              )}

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingRecord(record)}
                  className="h-8 text-[#38B2AC] hover:text-[#2C9B95] hover:bg-[#E6F7F6]"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(record.id)}
                  className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑运动记录</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <ExerciseForm
              initialData={editingRecord}
              onSubmit={handleUpdate}
              onCancel={() => setEditingRecord(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-[#718096] mb-4">
            确定要删除这条运动记录吗？此操作无法撤销。
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="flex-1"
            >
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RecordList;
