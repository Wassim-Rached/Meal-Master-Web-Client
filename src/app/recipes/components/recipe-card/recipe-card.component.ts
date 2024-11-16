import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../../shared-module/services/recipes-service.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
// fa stopwatch
import {
  faStopwatch,
  faUserFriends,
  faHeart,
  faClock,
  faHeartBroken,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FavoritesService } from '../../../shared-module/services/favorites.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent implements OnInit {
  @Input({ required: true }) recipe!: Recipe;
  isFavorite?: boolean = false;
  isLoadingFavorite = false;

  constructor(
    private favoritesService: FavoritesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.refreshIsFavorite();
  }

  refreshIsFavorite() {
    this.isFavorite = undefined;
    this.isLoadingFavorite = true;
    this.favoritesService.isFavorite(this.recipe.id).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
        this.isLoadingFavorite = false;
      },
      error: (error) => {
        this.isFavorite = false;
        this.isLoadingFavorite = false;
      },
    });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.removeFromFavorites(this.recipe);
    } else {
      this.addToFavorites(this.recipe);
    }
  }

  private addToFavorites(recipe: Recipe) {
    this.isLoadingFavorite = true;
    this.favoritesService.addRecipeToFavorites(recipe.id).subscribe({
      next: () => {
        this.toastr.success('Recipe added to favorites!');
        this.isFavorite = true;
        this.isLoadingFavorite = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to add recipe to favorites');
        this.isLoadingFavorite = false;
      },
    });
  }

  private removeFromFavorites(recipe: Recipe) {
    this.isLoadingFavorite = true;
    this.favoritesService.removeRecipeFromFavorites(recipe.id).subscribe({
      next: () => {
        this.toastr.success('Recipe removed from favorites!');
        this.isFavorite = false;
        this.isLoadingFavorite = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to remove recipe from favorites');
        this.isLoadingFavorite = false;
      },
    });
  }

  get solidIcons() {
    return {
      faStopwatch,
      faUserFriends,
      faHeart,
      faClock,
      faHeartBroken,
      faInfoCircle,
    };
  }
}
