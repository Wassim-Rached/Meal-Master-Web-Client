import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ingredient {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.BASE_URL}/api/ingredients`);
  }
}
