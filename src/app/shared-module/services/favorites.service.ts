import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Recipe } from './recipes-service.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getMyFavorites(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.BASE_URL}/api/favorites`);
  }

  addRecipeToFavorites(favoriteId: string) {
    return this.http.post(
      `${this.BASE_URL}/api/favorites?recipeId=${favoriteId}`,
      {}
    );
  }

  removeRecipeFromFavorites(favoriteId: string) {
    return this.http.delete(`${this.BASE_URL}/api/favorites/${favoriteId}`);
  }

  isFavorite(recipeId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASE_URL}/api/favorites/${recipeId}`);
  }
}
