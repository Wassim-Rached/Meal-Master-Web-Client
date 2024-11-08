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
import { Tag, TagsService } from '../../../shared-module/services/tags.service';

@Component({
  selector: 'app-search-and-filter',
  standalone: true,
  imports: [SharedModule, RecipeCardComponent],
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css'],
})
export class SearchAndFilterComponent implements OnInit, AfterViewInit {
  recipes?: Recipe[];
  searchFormGroup!: FormGroup;
  availableTags: Tag[] = [];
  isLoadingRecipes = false;
  isLoadingTags = false;
  // pagination
  currentPage = 0;
  totalPages = 0;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    this.initSearchForm();
    this.searchTags('');
    // Subscribe to query params changes
    this.route.queryParams.subscribe((params) => {
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
      const tags = params['tags'];
      if (tags) {
        if (Array.isArray(tags)) {
          tags.forEach((tag) => this.addTag(tag));
        } else {
          this.addTag(tags);
        }
      }
      if (!params['sort']) {
        this.router.navigate([], {
          queryParams: { sort: 'title,asc' },
        });
      } else {
        this.searchRecipes();
      }
    });
  }

  ngAfterViewInit() {
    this.focusSearchInput();
  }

  // search available tags
  searchTags(name: string) {
    this.isLoadingTags = true;
    this.tagsService.searchTags(name).subscribe({
      next: (tags) => {
        this.availableTags = tags;
        this.isLoadingTags = false;
      },
      error: (err) => {
        console.error(err);
        this.availableTags = [];
      },
    });
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
      tags: this.fb.array([]),
      page: [0],
      size: [4],
    });
  }

  get tagsFormArray(): FormArray {
    return this.searchFormGroup.get('tags') as FormArray;
  }

  // add a tag to the form
  addTag(tagName: string) {
    if (!tagName || tagName === '') return;
    if (this.tagsFormArray.value.includes(tagName)) return;
    this.tagsFormArray.push(this.fb.control(tagName));
  }

  // remove a tag from the form
  removeTag(index: number) {
    this.tagsFormArray.removeAt(index);
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
}

export interface FormValue {
  search: string;
  minCookingTime: number | null;
  maxCookingTime: number | null;
  minServingSize: number | null;
  maxServingSize: number | null;
  sort: string;
  tags: string[];
  page: number;
  size: number;
}
