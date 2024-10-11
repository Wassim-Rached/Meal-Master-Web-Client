import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared-module/shared-module.module';
import {
  Recipe,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-and-filter',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css'],
})
export class SearchAndFilterComponent implements OnInit, AfterViewInit {
  recipes?: Recipe[];
  title: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to query params changes
    this.route.queryParams.subscribe((params) => {
      this.title = params['title'] || '';
      this.searchRecipes(this.title);
    });
  }

  ngAfterViewInit() {
    // Focus the search input
    console.log('ngAfterViewInit');
    console.log(this.searchInput);
    this.focusSearchInput();
  }

  searchRecipes(title: string = '') {
    this.recipes = undefined;

    this.recipeService.searchRecipes(title).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error(err);
        this.recipes = [];
      },
    });
  }

  focusSearchInput() {
    this.searchInput.nativeElement.focus();
  }
}
