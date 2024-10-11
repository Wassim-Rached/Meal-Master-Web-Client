import { Component, Input } from '@angular/core';
import { Recipe } from '../../../shared-module/services/recipes-service.service';
import { SharedModule } from '../../../shared-module/shared-module.module';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
}
