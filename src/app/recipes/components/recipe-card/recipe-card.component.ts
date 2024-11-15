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

  constructor(private favoriteService: FavoritesService) {}

  ngOnInit() {
    this.favoriteService.isFavorite(this.recipe.id).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (error) => {
        this.isFavorite = false;
      },
    });
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
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
