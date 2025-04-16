import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-range-date-picker',
  templateUrl: './range-date-picker.component.html',
  styleUrls: ['./range-date-picker.component.css']
})
export class RangeDatePickerComponent implements OnInit {
  @Input() bookings: { startDate: string, endDate: string }[] = [];
  @Output() dateRangeSelected = new EventEmitter<{ start: Date, end: Date }>();

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  calendar: Date[] = [];

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  unavailableDates: Set<string> = new Set();

  ngOnInit() {
    this.generateCalendar();
    this.processBookings();
  }

  generateCalendar() {
    this.calendar = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      this.calendar.push(new Date(d));
    }
  }

  processBookings() {
    for (let booking of this.bookings) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        this.unavailableDates.add(d.toDateString());
      }
    }
  }

  selectDate(date: Date) {
    const dateStr = date.toDateString();
    if (this.unavailableDates.has(dateStr)) return;

    if (!this.selectedStartDate || (this.selectedStartDate && this.selectedEndDate)) {
      this.selectedStartDate = date;
      this.selectedEndDate = null;
    } else {
      if (date > this.selectedStartDate) {
        this.selectedEndDate = date;
        this.dateRangeSelected.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
      } else {
        this.selectedStartDate = date;
        this.selectedEndDate = null;
      }
    }
  }

  isSelected(date: Date): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) return false;
    return date >= this.selectedStartDate && date <= this.selectedEndDate;
  }

  isUnavailable(date: Date): boolean {
    return this.unavailableDates.has(date.toDateString());
  }
}
