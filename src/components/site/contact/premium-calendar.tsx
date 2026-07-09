"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const TIME_SLOTS = ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM", "04:30 PM"];

export function PremiumCalendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getOrdinalSuffix = (i: number) => {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) return i + "st";
    if (j == 2 && k != 12) return i + "nd";
    if (j == 3 && k != 13) return i + "rd";
    return i + "th";
  };

  return (
    <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.1)] relative overflow-hidden">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline">
          <span className="text-2xl font-extrabold text-slate-900">October</span>
          <span className="font-serif italic font-normal text-blue-600 ml-2 text-2xl">2026</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="hover:bg-slate-100 rounded-full p-2 transition-colors">
            <ChevronLeft className="size-5 text-slate-600" />
          </button>
          <button type="button" className="hover:bg-slate-100 rounded-full p-2 transition-colors">
            <ChevronRight className="size-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {DAYS.map((day) => (
          <div key={day} className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
            {day}
          </div>
        ))}
        
        {/* Empty slots for month start (assuming month starts on Thursday -> 3 empty slots) */}
        <div />
        <div />
        <div />
        
        {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
          // Mock past dates
          const isPast = date < 15;
          const isSelected = selectedDate === date;
          
          if (isPast) {
            return (
              <div key={date} className="aspect-square flex items-center justify-center text-slate-300 cursor-not-allowed text-sm">
                {date}
              </div>
            );
          }
          
          return (
            <div
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              className={`aspect-square flex items-center justify-center cursor-pointer rounded-full transition-all text-sm ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                  : "hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-medium"
              }`}
            >
              {date}
            </div>
          );
        })}
      </div>

      {/* Time Selection Pane */}
      {selectedDate && (
        <div className="animate-fade-in-up mt-8 border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-500 font-medium mb-4">
            Thursday, October {getOrdinalSuffix(selectedDate)}
          </div>
          <div className="flex flex-wrap gap-3">
            {TIME_SLOTS.map((time) => {
              const isTimeSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`border rounded-full py-2 px-4 text-sm font-semibold cursor-pointer transition-colors ${
                    isTimeSelected
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Final CTA */}
      {selectedDate && selectedTime && (
        <button className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold tracking-[0.1em] uppercase hover:bg-blue-600 transition-colors mt-8 animate-fade-in-up">
          Confirm Appointment
        </button>
      )}
    </div>
  );
}
