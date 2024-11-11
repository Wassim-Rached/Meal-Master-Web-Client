import { Component, Input } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import {
  startOfDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  format,
} from 'date-fns';
import { SharedModule } from '../../../shared-module/shared-module.module';
// next arrow icon and previous arrow icon
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-schedules-calendar',
  standalone: true,
  imports: [SharedModule, CalendarModule, FontAwesomeModule],
  templateUrl: './schedules-calendar.component.html',
  styleUrls: ['./schedules-calendar.component.css'],
})
export class SchedulesCalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  @Input({ required: true }) events: CalendarEvent[] = [];

  setView(view: string) {
    this.view = view as CalendarView;
  }

  navigate(direction: string) {
    if (direction === 'prev') {
      if (this.view === 'month') {
        this.viewDate = subMonths(this.viewDate, 1);
      } else if (this.view === 'week') {
        this.viewDate = subWeeks(this.viewDate, 1);
      } else if (this.view === 'day') {
        this.viewDate = subDays(this.viewDate, 1);
      }
    } else if (direction === 'next') {
      if (this.view === 'month') {
        this.viewDate = addMonths(this.viewDate, 1);
      } else if (this.view === 'week') {
        this.viewDate = addWeeks(this.viewDate, 1);
      } else if (this.view === 'day') {
        this.viewDate = addDays(this.viewDate, 1);
      }
    }
  }

  getMonthYear(): string {
    return format(this.viewDate, 'MMMM yyyy');
  }

  getWeekHeader(): string {
    const startOfWeek = startOfDay(this.viewDate);
    const endOfWeek = addDays(startOfWeek, 6);
    return `Week ${format(startOfWeek, 'w')}: ${format(
      startOfWeek,
      'MMM dd, yyyy'
    )} - ${format(endOfWeek, 'MMM dd, yyyy')}`;
  }

  getDayHeader(): string {
    return format(this.viewDate, 'EEE, MMMM dd, yyyy');
  }

  onEventClicked(event: { event: CalendarEvent }): void {
    const eventLink = event.event.meta?.link; // Get the link from the event's meta data
    if (eventLink) {
      window.open(eventLink, '_blank'); // Open the link in a new tab
    }
  }

  get solidIcons() {
    return {
      faChevronLeft,
      faChevronRight,
    };
  }
}
