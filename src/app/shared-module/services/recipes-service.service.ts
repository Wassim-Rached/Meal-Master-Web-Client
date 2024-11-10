import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredients.service';
import { MeasurementUnit } from './measurments-units.service';
import { environment } from '../../../environments/environment';
import { Page } from '../../../types';
import { Account } from './accounts.service';

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  coverImgUrl?: string;
  cookingTime: number;
  servingSize: number;
  owner: Account;
  instructions: Instruction[];
  recipeIngredients: RecipeIngredient[];
}

export interface Instruction {
  id: string;
  stepNumber: number;
  text: string;
  timeEstimate: number;
}

export interface RecipeIngredient {
  id: string;
  amount: number;
  ingredient: Ingredient;
  measurementUnit: MeasurementUnit;
}

export interface RecipeSearchParams {
  search?: string;
  minCookingTime?: number;
  maxCookingTime?: number;
  minServingSize?: number;
  maxServingSize?: number;
  sort: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getRecipesRecommendations(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      `${this.BASE_URL}/api/recipes/recommendation`
    );
  }

  searchRecipes(searchParams: RecipeSearchParams): Observable<Page<Recipe>> {
    const {
      search = '',
      maxCookingTime,
      minCookingTime,
      maxServingSize,
      minServingSize,
      sort,
      page,
      size,
    } = searchParams;

    const params = new HttpParams()
      .set('search', search)
      .set('maxCookingTime', maxCookingTime?.toString() || '')
      .set('minCookingTime', minCookingTime?.toString() || '')
      .set('maxServingSize', maxServingSize?.toString() || '')
      .set('minServingSize', minServingSize?.toString() || '')
      .set('sort', sort)
      .set('page', page?.toString() || '')
      .set('size', size?.toString() || '4');

    return this.http.get<Page<Recipe>>(`${this.BASE_URL}/api/recipes/search`, {
      params,
    });
  }

  createRecipe(recipe: CreateRecipeRequestDTO): Observable<string> {
    return this.http.post<string>(`${this.BASE_URL}/api/recipes`, recipe);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.BASE_URL}/api/recipes/${id}`);
  }

  getMyRecipes({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Observable<Page<Recipe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Recipe>>(`${this.BASE_URL}/api/recipes/my`, {
      params,
    });
  }

  updateRecipe(id: string, recipe: UpdateRecipeRequestDTO): Observable<string> {
    return this.http.put<string>(`${this.BASE_URL}/api/recipes/${id}`, recipe, {
      responseType: 'text' as 'json',
    });
  }
}

export interface CreateRecipeRequestDTO {
  title: string;
  description?: string;
  coverImgUrl?: string;
  cookingTime: number;
  servingSize: number;
  instructions: CreateInstructionRequestDTO[];
  recipeIngredients: CreateRecipeIngredientRequestDTO[];
}

export interface UpdateRecipeRequestDTO {
  title: string;
  description: string;
  coverImgUrl: string;
  cookingTime: number;
  servingSize: number;
  instructions: CreateInstructionRequestDTO[];
  recipeIngredients: CreateRecipeIngredientRequestDTO[];
}

export interface CreateInstructionRequestDTO {
  step_number: number;
  text: string;
  time_estimate: number;
}

export interface CreateRecipeIngredientRequestDTO {
  amount: number;
  ingredientId: string;
  measurementUnitId: string;
}
