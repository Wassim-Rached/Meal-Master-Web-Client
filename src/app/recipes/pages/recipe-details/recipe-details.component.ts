import { Component, OnInit } from '@angular/core';
import {
  Recipe,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe?: Recipe | null;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        console.log(recipe);
      },
      error: (error) => {
        console.error(error);
        this.recipe = null;
      },
    });
  }
}
