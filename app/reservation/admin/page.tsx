"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { supabase, BOOKINGS_TABLE } from "@/lib/supabase"
import type { Booking } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  subDays,
  addMonths,
  subMonths,
} from "date-fns"
import { cn } from "@/lib/utils" // Added cn utility

const TIMES = [
  "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

type ViewMode = "weekly" | "monthly";

export default function ReservationAdminPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const dateRange =
    viewMode === "weekly"
      ? eachDayOfInterval({ start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) })
      : eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });

  useEffect(() => {
    setLoading(true); // Set loading to true when effect runs
    const startDate = format(dateRange[0], "yyyy-MM-dd");
    const endDate = format(dateRange[dateRange.length - 1], "yyyy-MM-dd");

    supabase
      .from(BOOKINGS_TABLE)
      .select("*")
      .gte("appointment_date", startDate)
      .lte("appointment_date", endDate)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .then(({ data }) => {
        setBookings(data ?? []);
      })
      .catch(() => {
        setBookings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentDate, viewMode, dateRange]);

  const handlePrev = () => {
    if (viewMode === "weekly") {
      setCurrentDate(subDays(currentDate, 7));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "weekly") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">予約管理タイムテーブル</h1>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="flex items-center">
          <Button variant="outline" onClick={handlePrev} className="mr-2">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" onClick={handleNext}>
            <ChevronRight size={20} />
          </Button>
          <span className="ml-4 font-semibold text-sm sm:text-base">
            {format(dateRange[0], "yyyy年M月d日")} - {format(dateRange[dateRange.length - 1], "M月d日")}
          </span>
        </div>
        <div className="flex items-center">
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            onClick={() => setViewMode("weekly")}
            className="mr-2 px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            週間
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            onClick={() => setViewMode("monthly")}
            className="px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base"
          >
            月間
          </Button>
        </div>
      </div>

      {loading && <p className="text-sm mt-4 text-center">データを読み込み中...</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-sm mt-4 text-center">表示期間内に予約はありません</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-center">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-2 border-r sticky left-0 bg-gray-50 z-10 text-xs sm:text-sm font-medium text-gray-600">時間</th>
                {dateRange.map((day) => (
                  <th key={day.toString()} className="p-2 border-r min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm font-medium text-gray-600">
                    {format(day, "M/d")} <span className="hidden sm:inline">({format(day, "E")})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time) => (
                <tr key={time} className="border-b last:border-b-0">
                  <td className="p-2 border-r sticky left-0 bg-white z-10 text-xs sm:text-sm text-gray-700">{time}</td>
                  {dateRange.map((day) => {
                    const dayStr = format(day, "yyyy-MM-dd");
                    const booking = bookings.find(
                      (b) => b.appointment_date === dayStr && b.appointment_time === time,
                    );
                    const cellClasses = cn(
                      "p-1 sm:p-2 border-r h-16 transition-colors",
                      booking ? "bg-sky-50 hover:bg-sky-100" : "hover:bg-gray-50",
                      "last:border-r-0"
                    );
                    return (
                      <td key={day.toString() + time} className={cellClasses}>
                        {booking ? (
                          <div
                            className="text-[10px] sm:text-xs cursor-pointer h-full flex items-center justify-center p-1 rounded hover:ring-1 hover:ring-sky-300"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            {booking.patient_name}
                          </div>
                        ) : (
                          <div className="h-full w-full"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={(isOpen) => { if (!isOpen) setSelectedBooking(null); }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>予約詳細</DialogTitle>
              <DialogDescription>
                {selectedBooking.patient_name}様の予約情報
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right col-span-1 text-sm">日時:</label>
                <div className="col-span-3 text-sm">{selectedBooking.appointment_date} {selectedBooking.appointment_time}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right col-span-1 text-sm">氏名:</label>
                <div className="col-span-3 text-sm">{selectedBooking.patient_name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right col-span-1 text-sm">電話番号:</label>
                <div className="col-span-3 text-sm">{selectedBooking.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right col-span-1 text-sm">メール:</label>
                <div className="col-span-3 text-sm">{selectedBooking.email}</div>
              </div>
              {selectedBooking.notes && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right col-span-1 text-sm">備考:</label>
                  <div className="col-span-3 text-sm whitespace-pre-wrap">{selectedBooking.notes}</div>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setSelectedBooking(null)}>閉じる</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
