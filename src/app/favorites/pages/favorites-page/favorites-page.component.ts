import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../shared-module/services/favorites.service';
import { Recipe } from '../../../shared-module/services/recipes-service.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { RecipeCardComponent } from '../../../recipes/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css',
})
export class FavoritesPageComponent implements OnInit {
  recipes?: Recipe[];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.refreshFavorites();
  }

  refreshFavorites() {
    this.favoritesService.getMyFavorites().subscribe((recipes) => {
      this.recipes = recipes;
    });
  }
}
