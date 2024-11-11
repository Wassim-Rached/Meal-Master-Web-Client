import { Component, OnInit } from '@angular/core';
import { SchedulesCalendarComponent } from '../../components/schedules-calendar/schedules-calendar.component';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { CalendarEvent } from 'angular-calendar';
import {
  Schedule,
  SchedulesService,
} from '../../../shared-module/services/schedules.service';
import { CreateScheduleComponent } from '../../components/create-schedule/create-schedule.component';
import { ListSchedulesComponent } from '../../components/list-schedules/list-schedules.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schedules-page',
  standalone: true,
  imports: [
    SharedModule,
    SchedulesCalendarComponent,
    CreateScheduleComponent,
    ListSchedulesComponent,
  ],
  templateUrl: './schedules-page.component.html',
  styleUrl: './schedules-page.component.css',
})
export class SchedulesPageComponent implements OnInit {
  events: CalendarEvent[] = [];
  schedules?: Schedule[];

  constructor(
    private schedulesService: SchedulesService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.refreshSchedules();
  }

  refreshSchedules() {
    this.schedulesService.getMySchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.processSchedules();
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Failed to load schedules';
        this.toastrService.error(errorMessage);
      },
    });
  }
  processSchedules() {
    if (!this.schedules) return;

    this.events = this.schedules.map((schedule) => {
      const colors = [
        { primary: '#1abc9c', secondary: '#d1f2eb' },
        { primary: '#3498db', secondary: '#d6eaf8' },
        { primary: '#9b59b6', secondary: '#ebdef0' },
        { primary: '#e74c3c', secondary: '#fadbd8' },
        { primary: '#f39c12', secondary: '#fef9e7' },
        { primary: '#2ecc71', secondary: '#d4efdf' },
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        title: schedule.folder.name,
        start: new Date(schedule.scheduledDate),
        color: randomColor,
        meta: {
          link: `/folders/${schedule.folder.id}`,
        },
      };
    });
  }

  onScheduleCreated() {
    this.refreshSchedules();
  }

  onScheduleDeleted(scheduleId: string) {
    this.schedules = this.schedules?.filter(
      (schedule) => schedule.id !== scheduleId
    );
    this.processSchedules();
  }
}
