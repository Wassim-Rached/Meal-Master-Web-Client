import { Component, OnInit } from '@angular/core';
import {
  Recipe,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-recomendations',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './recomendations.component.html',
  styleUrl: './recomendations.component.css',
})
export class RecomendationsComponent implements OnInit {
  recipes?: Recipe[];

  constructor(private recipeService: RecipesService) {}

  ngOnInit() {
    this.recipeService.getRecipesRecommendations().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error(err);
        this.recipes = [];
      },
    });
  }
}
