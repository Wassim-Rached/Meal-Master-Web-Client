import { Component, Input } from '@angular/core';
import { Recipe } from '../../../shared-module/services/recipes-service.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
// fa stopwatch
import { faStopwatch, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  get solidIcons() {
    return { faStopwatch, faUserFriends };
  }
}
