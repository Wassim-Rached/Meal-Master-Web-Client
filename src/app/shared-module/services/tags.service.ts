import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tag {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  searchTags(name: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(
      `${this.BASE_URL}/api/tags/search?name=${name}`
    );
  }
}
