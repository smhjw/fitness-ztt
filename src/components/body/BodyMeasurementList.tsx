import { useState } from 'react';
import { Edit2, Trash2, Calendar, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BodyMeasurement } from '@/types';
import BodyMeasurementForm from './BodyMeasurementForm';

interface BodyMeasurementListProps {
  measurements: BodyMeasurement[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function BodyMeasurementList({ measurements, onUpdate, onDelete }: BodyMeasurementListProps) {
  const [editingMeasurement, setEditingMeasurement] = useState<BodyMeasurement | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleUpdate = (data: any) => {
    if (editingMeasurement) {
      onUpdate(editingMeasurement.id, data);
      setEditingMeasurement(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  if (measurements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF1EA] flex items-center justify-center">
          <Scale className="w-8 h-8 text-[#FF6A3D]" />
        </div>
        <h3 className="text-lg font-medium text-[#333333] mb-1">暂无体测记录</h3>
        <p className="text-[#718096]">开始记录你的身体变化</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {measurements.map((measurement) => (
        <div
          key={measurement.id}
          className="group p-4 bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF1EA] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#FF6A3D]" />
              </div>
              <div>
                <h4 className="font-medium text-[#333333]">
                  {new Date(measurement.date).toLocaleDateString()}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-[#718096]">
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    {measurement.weight} kg
                  </span>
                  {measurement.bodyFat && (
                    <Badge variant="outline" className="text-xs">
                      体脂 {measurement.bodyFat}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedId(expandedId === measurement.id ? null : measurement.id)}
                className="h-8 text-[#718096]"
              >
                {expandedId === measurement.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingMeasurement(measurement)}
                className="h-8 text-[#FF6A3D] hover:text-[#F4511E] hover:bg-[#FFF1EA]"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmId(measurement.id)}
                className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded details */}
          {expandedId === measurement.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {measurement.height && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">身高</p>
                    <p className="font-medium text-[#333333]">{measurement.height} cm</p>
                  </div>
                )}
                {measurement.chest && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">胸围</p>
                    <p className="font-medium text-[#333333]">{measurement.chest} cm</p>
                  </div>
                )}
                {measurement.waist && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">腰围</p>
                    <p className="font-medium text-[#333333]">{measurement.waist} cm</p>
                  </div>
                )}
                {measurement.hips && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">臀围</p>
                    <p className="font-medium text-[#333333]">{measurement.hips} cm</p>
                  </div>
                )}
                {measurement.arms && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">臂围</p>
                    <p className="font-medium text-[#333333]">{measurement.arms} cm</p>
                  </div>
                )}
                {measurement.thighs && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-[#718096]">大腿围</p>
                    <p className="font-medium text-[#333333]">{measurement.thighs} cm</p>
                  </div>
                )}
              </div>
              {measurement.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-[#718096]">备注</p>
                  <p className="text-sm text-[#333333]">{measurement.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Edit Dialog */}
      <Dialog open={!!editingMeasurement} onOpenChange={() => setEditingMeasurement(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑记录</DialogTitle>
          </DialogHeader>
          {editingMeasurement && (
            <BodyMeasurementForm
              initialData={editingMeasurement}
              onSubmit={handleUpdate}
              onCancel={() => setEditingMeasurement(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>删除记录</DialogTitle>
          </DialogHeader>
          <p className="text-[#718096] mb-4">
            删除后无法恢复，确定要删除吗？
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1">
              取消
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)} className="flex-1">
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BodyMeasurementList;
