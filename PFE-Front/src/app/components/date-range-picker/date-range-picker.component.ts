// date-range-picker.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Booking } from 'src/app/models/property.model';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {
  @Input() bookings: Booking[] = [];
  @Output() dateRangeChange = new EventEmitter<{ startDate: Date; endDate: Date | null }>();
  
  currentDate = new Date();
  currentMonth: number;
  currentYear: number;
  calendarDays: any[] = [];
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  startDate: Date | null = null;
  endDate: Date | null = null;
  hoveredDate: Date | null = null;
  
  // Quick selection options
  quickSelectionRanges = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: -1 },
    { label: 'This Week', days: 7 },
    { label: 'Last Week', days: 14 },
    { label: 'This Month', days: 30 },
    { label: 'Last Month', days: 60 }
  ];

  constructor() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const today = new Date();
    
    // Get days from previous month to fill first week
    const firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek !== 0) { // If not Sunday
      const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const date = new Date(this.currentYear, this.currentMonth - 1, day);
        this.calendarDays.push({
          date,
          day,
          isCurrentMonth: false,
          isBooked: this.isDayBooked(date),
          isToday: this.isToday(date),
          isPast: this.isPastDate(date)
        });
      }
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.calendarDays.push({
        date,
        day,
        isCurrentMonth: true,
        isBooked: this.isDayBooked(date),
        isToday: this.isToday(date),
        isPast: this.isPastDate(date)
      });
    }
    
    // Next month days to complete the last week
    const lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek !== 6) { // If not Saturday
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        this.calendarDays.push({
          date,
          day: i,
          isCurrentMonth: false,
          isBooked: this.isDayBooked(date),
          isToday: this.isToday(date),
          isPast: this.isPastDate(date)
        });
      }
    }
  }

  isDayBooked(date: Date): boolean {
    return this.bookings.some(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return date >= startDate && date <= endDate;
    });
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    return date < today;
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(date: Date): void {
    if (this.isDayBooked(date) || this.isPastDate(date)) {
      return; // Don't allow selection of booked dates or past dates
    }

    if (!this.startDate || (this.startDate && this.endDate)) {
      // Start new selection
      this.startDate = date;
      this.endDate = null;
      this.dateRangeChange.emit({ startDate: this.startDate, endDate: null });
    } else {
      // Complete the selection
      if (date < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = date;
      } else {
        this.endDate = date;
      }

      // Check if selected range contains any booked dates
      if (this.isRangeValid()) {
        this.dateRangeChange.emit({
          startDate: this.startDate,
          endDate: this.endDate
        });
      } else {
        // Reset if invalid
        this.endDate = null;
        this.dateRangeChange.emit({ startDate: this.startDate, endDate: null });
      }
    }
  }

  isRangeValid(): boolean {
    if (!this.startDate || !this.endDate) return true;
    
    // Convert to timestamp for easier comparison
    const start = this.startDate.getTime();
    const end = this.endDate.getTime();
    
    // Check if any day in the range is booked
    return !this.bookings.some(booking => {
      const bookingStart = new Date(booking.startDate).getTime();
      const bookingEnd = new Date(booking.endDate).getTime();
      
      // Check for any overlap
      return (start <= bookingEnd && end >= bookingStart);
    });
  }

  handleHover(date: Date): void {
    this.hoveredDate = date;
  }

  isInRange(date: Date): boolean {
    if (!this.startDate) return false;
    if (this.endDate) return date >= this.startDate && date <= this.endDate;
    return this.hoveredDate ? date >= this.startDate && date <= this.hoveredDate : false;
  }
  
  isStartDate(date: Date): boolean {
    if (!this.startDate) return false;
    return date.getTime() === this.startDate.getTime();
  }

  isEndDate(date: Date): boolean {
    if (!this.endDate) return false;
    return date.getTime() === this.endDate.getTime();
  }

  quickSelect(days: number): void {
    const endDate = new Date();
    let startDate;
    
    if (days === 0) {
      // Today
      startDate = new Date();
    } else if (days === -1) {
      // Yesterday
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
    } else {
      // Other ranges
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }
    
    this.startDate = startDate;
    this.endDate = endDate;
    
    if (this.isRangeValid()) {
      this.dateRangeChange.emit({
        startDate: this.startDate,
        endDate: this.endDate
      });
    } else {
      this.startDate = new Date();
      this.endDate = new Date();
      this.dateRangeChange.emit({ startDate: this.startDate, endDate: this.endDate });
      // Show message that the selected range contains booked dates
    }
  }

  // Add a method to get the current selection
  getCurrentSelection(): { startDate: Date | null; endDate: Date | null } {
    return {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}