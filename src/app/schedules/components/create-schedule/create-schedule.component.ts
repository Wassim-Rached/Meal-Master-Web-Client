import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CreateScheduleRequestDTO,
  Schedule,
  SchedulesService,
} from '../../../shared-module/services/schedules.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared-module.module';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';
import { ToastrService } from 'ngx-toastr';
// fa calendar plus
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-create-schedule',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './create-schedule.component.html',
  styleUrl: './create-schedule.component.css',
})
export class CreateScheduleComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  folders?: Folder[];
  @Output() scheduleCreated = new EventEmitter<void>();

  constructor(
    private scheduleService: SchedulesService,
    private foldersService: FoldersService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      folderId: ['', Validators.required],
      scheduledDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.refreshFolders();
  }

  onSubmit() {
    if (!this.eventForm.valid) return;
    this.isSubmitting = true;

    const { folderId, scheduledDate } = this.eventForm.value;

    const requestBody: CreateScheduleRequestDTO = {
      folderId: folderId,
      scheduledDate: new Date(scheduledDate).toISOString(),
    };

    this.scheduleService.createSchedule(requestBody).subscribe({
      next: (_) => {
        this.isSubmitting = false;
        this.toastrService.success('Schedule created successfully');
        this.scheduleCreated.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.error || 'Failed to create schedule';
        this.toastrService.error(errorMessage);
      },
    });
  }

  refreshFolders(): void {
    this.foldersService.getMyFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        this.folders = [];
        console.error(error);
      },
    });
  }

  get solidIcons() {
    return { faCalendarPlus };
  }
}
