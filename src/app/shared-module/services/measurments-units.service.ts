import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MeasurementUnit {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MeasurmentsUnitsService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getMeasurementUnits(): Observable<MeasurementUnit[]> {
    return this.http.get<MeasurementUnit[]>(
      `${this.BASE_URL}/api/measurements-units`
    );
  }
}
