import { Component, OnInit } from '@angular/core';
import {
  Recipe,
  RecipesService,
} from '../../../shared-module/services/recipes-service.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { FavoritesService } from '../../../shared-module/services/favorites.service';
import { ToastrService } from 'ngx-toastr';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { Account } from '../../../shared-module/services/accounts.service';
import { AuthService } from '../../../shared-module/services/auth-service.service';
// fa clock
import {
  faArrowRight,
  faClock,
  faListUl,
  faMortarPestle,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [SharedModule, ShareButtonsModule, ShareIconsModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe?: Recipe | null;
  isFavorite: boolean | undefined = undefined;
  folders?: Folder[];
  isDeleting = false;
  currentAccount: Account | null = null;
  isLoadingFavorite = false;

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private foldersService: FoldersService,
    private toastr: ToastrService,
    private authService: AuthService,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.refreshRecipe();
    this.authService.currentAccount$.subscribe({
      next: (account) => {
        console.log('loaded account', account);
        this.currentAccount = account;
      },
    });
  }

  updateMetaTags(recipe: Recipe) {
    this.meta.updateTag({ name: 'title', content: recipe.title });
    this.meta.updateTag({
      name: 'description',
      content: recipe.description || 'Enjoy ' + recipe.title,
    });
    this.meta.updateTag({ name: 'image', content: recipe.coverImgUrl || '' });
    this.meta.updateTag({ name: 'url', content: window.location.href });

    this.meta.updateTag({ name: 'og:title', content: recipe.title });
    this.meta.updateTag({
      name: 'og:description',
      content: recipe.description || 'Enjoy ' + recipe.title,
    });
    this.meta.updateTag({
      name: 'og:image',
      content: recipe.coverImgUrl || '',
    });
    this.meta.updateTag({ name: 'og:url', content: window.location.href });
  }

  refreshRecipe() {
    this.recipe = undefined;
    const id = this.route.snapshot.params['id'];
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.updateMetaTags(recipe);
        this.refreshIsFavorite(this.recipe);
        this.refreshFolders();
      },
      error: (error) => {
        console.error(error);
        this.recipe = null;
      },
    });
  }

  refreshFolders() {
    this.folders = undefined;
    this.foldersService.getMyFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        console.error(error);
        this.folders = undefined;
      },
    });
  }

  addToFavorites(recipe: Recipe) {
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

  removeFromFavorites(recipe: Recipe) {
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

  refreshIsFavorite(recipe: Recipe) {
    this.isFavorite = undefined;
    this.favoritesService.isFavorite(recipe.id).subscribe({
      next: (isFavorite) => {
        this.isFavorite = isFavorite;
      },
      error: (error) => {
        console.error(error);
        this.isFavorite = undefined;
      },
    });
  }

  isInFolder(folderId: string) {
    if (!this.recipe) return false;
    if (!this.folders) return false;

    const folder = this.folders.find((folder) => folder.id === folderId);
    if (!folder) return false;

    return folder.recipes.some((recipe) => recipe.id === this.recipe?.id);
  }

  toggleFolder(folderId: string) {
    if (!this.recipe) return;

    const isInFolder = this.isInFolder(folderId);

    if (isInFolder) {
      this.removeRecipeFromFolder(folderId);
    } else {
      this.addRecipeToFolder(folderId);
    }
  }

  private addRecipeToFolder(folderId: string) {
    if (!this.recipe) return;

    this.foldersService.addRecipeToFolder(folderId, this.recipe.id).subscribe({
      next: () => {
        this.toastr.success('Recipe added to folder!');
        if (!this.folders) return;
        this.folders = this.folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              recipes: [...folder.recipes, this.recipe!],
            };
          }
          return folder;
        });
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to add recipe to folder');
      },
    });
  }

  private removeRecipeFromFolder(folderId: string) {
    if (!this.recipe) return;

    this.foldersService
      .removeRecipeFromFolder(folderId, this.recipe.id)
      .subscribe({
        next: () => {
          this.toastr.success('Recipe removed from folder!');
          if (!this.folders) return;
          this.folders = this.folders.map((folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                recipes: folder.recipes.filter(
                  (recipe) => recipe.id !== this.recipe?.id
                ),
              };
            }
            return folder;
          });
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Failed to remove recipe from folder');
        },
      });
  }

  deleteRecipe() {
    if (!this.recipe) return;

    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    this.isDeleting = true;
    this.recipeService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.toastr.success('Recipe deleted!');
        this.toastr.info('Redirecting to previous page...');
        window.history.back();
      },
      error: (error) => {
        this.isDeleting = false;
        console.error(error);
        const errorMessage = error.error || 'Failed to delete recipe';
        this.toastr.error(errorMessage);
      },
    });
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareDescription() {
    if (!this.recipe) return '';
    return this.recipe.title;
  }

  get solidIcons() {
    return {
      faArrowRight,
      faClock,
      faListUl,
      faMortarPestle,
      faUtensils,
    };
  }

  get isOwner() {
    console.log({ recipe: this.recipe, currentAccount: this.currentAccount });
    if (!this.recipe) return false;
    if (!this.currentAccount) return false;

    return this.recipe.owner.id === this.currentAccount.id;
  }
}
