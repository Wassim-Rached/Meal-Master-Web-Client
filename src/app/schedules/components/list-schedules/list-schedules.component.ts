import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Schedule,
  SchedulesService,
} from '../../../shared-module/services/schedules.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { ToastrService } from 'ngx-toastr';

// calendar xmark icon
import { faCalendarXmark, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-list-schedules',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './list-schedules.component.html',
  styleUrl: './list-schedules.component.css',
})
export class ListSchedulesComponent {
  @Input({ required: true }) schedules: Schedule[] = [];
  @Output() scheduleDeleted = new EventEmitter<string>();
  isDeletingSchedules: string[] = [];

  constructor(
    private scheduleService: SchedulesService,
    private toastService: ToastrService
  ) {}

  // Method to delete a schedule
  deleteSchedule(scheduleId: string): void {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    this.isDeletingSchedules.push(scheduleId);
    this.scheduleService.deleteSchedule(scheduleId).subscribe({
      next: () => {
        this.scheduleDeleted.emit(scheduleId);
        this.isDeletingSchedules = this.isDeletingSchedules.filter(
          (id) => id !== scheduleId
        );
        this.toastService.success('Schedule deleted successfully');
      },
      error: (error) => {
        const errorMessage = error.error || 'An error occurred';
        this.toastService.error(errorMessage);
        this.isDeletingSchedules = this.isDeletingSchedules.filter(
          (id) => id !== scheduleId
        );
      },
    });
  }

  isBeingDeleted(scheduleId: string): boolean {
    return this.isDeletingSchedules.includes(scheduleId);
  }

  get solidIcons() {
    return { faCalendarXmark, faCalendar };
  }
}
