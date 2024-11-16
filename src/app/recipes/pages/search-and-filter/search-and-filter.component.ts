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
  RecipeSearchParams,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faClock,
  faFilter,
  faSearch,
  faSort,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-and-filter',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent, FontAwesomeModule],
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css'],
})
export class SearchAndFilterComponent implements OnInit, AfterViewInit {
  recipes?: Recipe[];
  searchFormGroup!: FormGroup;
  isLoadingRecipes = false;
  // pagination
  currentPage = 0;
  totalPages = 0;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initSearchForm();
    // Subscribe to query params changes
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.searchFormGroup.patchValue({
        search: params['search'],
        minCookingTime: params['minCookingTime'],
        maxCookingTime: params['maxCookingTime'],
        minServingSize: params['minServingSize'],
        maxServingSize: params['maxServingSize'],
        sort: params['sort'] || 'title,asc',
        page: params['page'],
        size: params['size'] || 4,
      });
      if (!params['sort']) {
        this.router.navigate([], {
          queryParams: { sort: 'title,asc', ...params },
        });
      } else {
        this.searchRecipes();
      }
    });
  }

  ngAfterViewInit() {
    this.focusSearchInput();
  }

  // init the search form
  initSearchForm() {
    this.searchFormGroup = this.fb.group({
      search: [''],
      minCookingTime: [null],
      maxCookingTime: [null],
      minServingSize: [null],
      maxServingSize: [null],
      sort: ['title,asc'],
      page: [0],
      size: [4],
    });
  }

  public onSubmitSearchForm() {
    const formValue = this.searchFormGroup?.value;
    // maybe update the form if needed here
    // set the query params from the form
    console.log(formValue);
    this.router
      .navigate([], {
        queryParams: formValue,
      })
      .then(() => {
        this.searchRecipes();
      });
  }

  // this method should not be called directly
  // only by the form submit
  private searchRecipes() {
    // if (this.isLoadingRecipes) return;
    this.recipes = undefined;
    const searchParams: RecipeSearchParams = this.route.snapshot
      .queryParams as RecipeSearchParams;

    this.isLoadingRecipes = true;
    this.recipeService.searchRecipes(searchParams).subscribe({
      next: (response) => {
        this.recipes = response.content;
        this.isLoadingRecipes = false;
        this.currentPage = response.pageable.pageNumber;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error(err);
        this.recipes = [];
        this.isLoadingRecipes = false;
      },
    });
  }

  focusSearchInput() {
    this.searchInput.nativeElement.focus();
  }

  onClearFilters() {
    this.searchFormGroup.reset();
    this.initSearchForm();
    this.onSubmitSearchForm();
  }

  get paginationArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  changePage(page: number) {
    this.searchFormGroup.patchValue({ page });
    this.onSubmitSearchForm();
  }

  get solidIcons() {
    return {
      faSearch,
      faFilter,
    };
  }
}

export interface FormValue {
  search: string;
  minCookingTime: number | null;
  maxCookingTime: number | null;
  minServingSize: number | null;
  maxServingSize: number | null;
  sort: string;
  page: number;
  size: number;
}
