import { Component } from '@angular/core';
import { SchedulesCalendarComponent } from '../../components/schedules-calendar/schedules-calendar.component';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-schedules-page',
  standalone: true,
  imports: [SharedModule, SchedulesCalendarComponent],
  templateUrl: './schedules-page.component.html',
  styleUrl: './schedules-page.component.css',
})
export class SchedulesPageComponent {}
