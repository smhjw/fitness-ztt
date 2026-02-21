import { useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ExerciseType } from '@/types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: ExerciseType;
  duration: number;
}

interface ExerciseCalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: string) => void;
  onEventClick?: (eventId: string) => void;
}

const exerciseTypeColors: Record<ExerciseType, string> = {
  running: '#38B2AC',
  walking: '#10B981',
  cycling: '#3B82F6',
  swimming: '#06B6D4',
  weightlifting: '#6D28D9',
  yoga: '#F59E0B',
  pilates: '#EC4899',
  hiit: '#EF4444',
  cardio: '#F97316',
  sports: '#8B5CF6',
  other: '#6B7280',
};

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

export function ExerciseCalendar({ events, onDateClick, onEventClick }: ExerciseCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        backgroundColor: exerciseTypeColors[event.type],
        borderColor: exerciseTypeColors[event.type],
        textColor: '#fff',
      })),
    [events]
  );

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="w-5 h-5 text-[#38B2AC]" />
            训练日历
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => calendarRef.current?.getApi().prev()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => calendarRef.current?.getApi().today()}>
              今天
            </Button>
            <Button variant="outline" size="sm" onClick={() => calendarRef.current?.getApi().next()}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="exercise-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            locales={[zhCnLocale]}
            locale="zh-cn"
            firstDay={1}
            headerToolbar={false}
            height="auto"
            dayMaxEvents={3}
            moreLinkText="更多"
            buttonText={{
              today: '今天',
              month: '月',
              week: '周',
              day: '日',
            }}
            dateClick={(info: any) => {
              const date = info.dateStr;
              setSelectedDate(date);
              setSelectedDateEvents(events.filter((e) => e.date === date));
              onDateClick?.(date);
            }}
            eventClick={(info: any) => {
              onEventClick?.(info.event.id);
            }}
            eventContent={(eventInfo: any) => (
              <div className="flex items-center gap-1 px-1 py-0.5 overflow-hidden">
                <span className="text-xs font-medium truncate">{eventInfo.event.title}</span>
              </div>
            )}
            dayCellClassNames="hover:bg-[#E6F7F6] transition-colors cursor-pointer"
            eventClassNames="rounded-md text-xs"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-[#718096] mb-2">运动类型</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(exerciseTypeColors) as ExerciseType[]).slice(0, 6).map((type) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: exerciseTypeColors[type] }} />
                <span className="text-xs text-[#718096]">{exerciseTypeLabels[type]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedDate}</DialogTitle>
          </DialogHeader>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: exerciseTypeColors[event.type] }} />
                    <span className="font-medium text-[#333333]">{exerciseTypeLabels[event.type]}</span>
                  </div>
                  <p className="text-sm text-[#718096] mt-1">
                    {event.duration} 分钟
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#718096] py-4">当天没有记录</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ExerciseCalendar;
