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

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe?: Recipe | null;
  isFavorite: boolean | undefined = undefined;
  folders: Folder[] = [];

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private foldersService: FoldersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.refreshRecipe();
  }

  refreshRecipe() {
    this.recipe = undefined;
    const id = this.route.snapshot.params['id'];
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
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
    this.folders = [];
    this.foldersService.getMyFolders().subscribe({
      next: (folders) => {
        this.folders = folders;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addToFavorites(recipe: Recipe) {
    this.favoritesService.addRecipeToFavorites(recipe.id).subscribe({
      next: () => {
        this.toastr.success('Recipe added to favorites!');
        this.isFavorite = true;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to add recipe to favorites');
      },
    });
  }

  removeFromFavorites(recipe: Recipe) {
    this.favoritesService.removeRecipeFromFavorites(recipe.id).subscribe({
      next: () => {
        this.toastr.success('Recipe removed from favorites!');
        this.isFavorite = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Failed to remove recipe from favorites');
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
        this.isFavorite = false;
      },
    });
  }

  isInFolder(folderId: string) {
    if (!this.recipe) return false;

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
}
