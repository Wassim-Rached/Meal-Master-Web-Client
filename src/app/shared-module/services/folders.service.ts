import { Injectable } from '@angular/core';
import { Recipe } from './recipes-service.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Folder {
  id: string;
  name: string;
  recipes: Recipe[];
}

@Injectable({
  providedIn: 'root',
})
export class FoldersService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getMyFolders(): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${this.BASE_URL}/api/folders`);
  }

  getFolderDetails(folderId: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.BASE_URL}/api/folders/${folderId}`);
  }

  createFolder(name: string): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/api/folders`,
      { name },
      { responseType: 'text' as 'json' }
    );
  }

  deleteFolder(folderId: string): Observable<string> {
    return this.http.delete<string>(
      `${this.BASE_URL}/api/folders/${folderId}`,
      { responseType: 'text' as 'json' }
    );
  }

  addRecipeToFolder(folderId: string, recipeId: string): Observable<string> {
    return this.http.post<string>(
      `${this.BASE_URL}/api/folders/${folderId}/recipes?recipeId=${recipeId}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  removeRecipeFromFolder(
    folderId: string,
    recipeId: string
  ): Observable<string> {
    return this.http.delete<string>(
      `${this.BASE_URL}/api/folders/${folderId}/recipes?recipeId=${recipeId}`,
      { responseType: 'text' as 'json' }
    );
  }
}
