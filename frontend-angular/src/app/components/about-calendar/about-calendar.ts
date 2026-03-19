import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Calendar event interface
interface CalendarEvent {
  day: number;
  title: string;
  description: string;
  time: string;
}

// About Calendar component
@Component({
  selector: 'app-about-calendar',
  imports: [CommonModule],
  templateUrl: './about-calendar.html',
  styleUrl: './about-calendar.css'
})
export class AboutCalendar {
  // Day names
  readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Month names
  readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Events
  readonly events: CalendarEvent[] = [
    { day: 7, title: 'Learn About Your Zoo', description: 'Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.', time: '10:00 AM - 11:30 AM' },
    { day: 15, title: 'Feed the Animals', description: 'Experience the joy of feeding our animals! Watch as zookeepers provide meals and learn about the dietary needs of different species. Perfect for families!', time: '2:00 PM - 3:00 PM' },
    { day: 20, title: 'Learn About Your Zoo', description: 'Join our expert guides for an educational tour of the zoo. Learn about animal habitats, conservation efforts, and the important work we do to protect wildlife.', time: '10:00 AM - 11:30 AM' }
  ];

  // Current month and year
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  // Selected event
  selectedEvent: { day: number; event: CalendarEvent } | null = null;

  // Change month
  changeMonth(direction: number): void {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
  }

  // Leading empty cells
  leadingEmptyCells(): number[] {
    return Array.from({ length: new Date(this.currentYear, this.currentMonth, 1).getDay() }, (_, i) => i);
  }

  // Calendar days
  calendarDays(): number[] {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  // Events for day
  eventsForDay(day: number): CalendarEvent[] {
    return this.events.filter((event) => event.day === day);
  }

  // Is today
  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();
  }

  // Open event
  openEvent(day: number): void {
    const event = this.eventsForDay(day)[0];
    if (!event) return;
    this.selectedEvent = { day, event };
    document.body.style.overflow = 'hidden';
  }

  // Close event
  closeEvent(): void {
    this.selectedEvent = null;
    document.body.style.overflow = '';
  }
}
