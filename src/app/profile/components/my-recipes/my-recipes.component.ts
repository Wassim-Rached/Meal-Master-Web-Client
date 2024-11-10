import { Component, OnInit } from '@angular/core';
import {
  Recipe,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { RecipeCardComponent } from '../../../recipes/components/recipe-card/recipe-card.component';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './my-recipes.component.html',
  styleUrl: './my-recipes.component.css',
})
export class MyRecipesComponent implements OnInit {
  recipes?: Recipe[];
  currentPage = 0;
  totalPages = 1; // Default so it can started with 0

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.refreshMyRecipes();
  }

  refreshMyRecipes(page = 0) {
    if (page < 0 || page >= this.totalPages) return;
    this.recipes = undefined;
    this.recipesService.getMyRecipes({ size: 3, page }).subscribe({
      next: (response) => {
        this.recipes = response.content;
        this.currentPage = response.pageable.pageNumber;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        this.recipes = undefined;
        console.error('Error loading recipes', error);
      },
    });
  }

  get paginationArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
