import { Injectable } from '@angular/core';
import { Folder } from './folders.service';
import { Account } from './accounts.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Schedule {
  id: string;
  scheduledDate: Date;
  folder: Folder;
  account: Account;
}
export interface CreateScheduleRequestDTO {
  scheduledDate: string; // ISO 8601 string representation of the date
  folderId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  createSchedule(requestBody: CreateScheduleRequestDTO): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/api/schedules`,
      requestBody,
      { responseType: 'text' as 'json' }
    );
  }

  deleteSchedule(id: string): Observable<string> {
    return this.http.delete<string>(`${this.BASE_URL}/api/schedules/${id}`, {
      responseType: 'text' as 'json',
    });
  }

  getMySchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.BASE_URL}/api/schedules`);
  }
}
