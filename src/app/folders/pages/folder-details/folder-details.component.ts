import { Component, OnInit } from '@angular/core';
import {
  Folder,
  FoldersService,
} from '../../../shared-module/services/folders.service';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../../../shared-module/components/not-found/not-found.component';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { RecipeCardComponent } from '../../../recipes/components/recipe-card/recipe-card.component';
import { Recipe } from '../../../shared-module/services/recipes-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-folder-details',
  standalone: true,
  imports: [SharedModule, NotFoundComponent, RecipeCardComponent],
  templateUrl: './folder-details.component.html',
  styleUrl: './folder-details.component.css',
})
export class FolderDetailsComponent implements OnInit {
  folder?: Folder;
  recipesList: Recipe[] = [];
  recipesBeingRemoved: Set<string> = new Set();

  constructor(
    private folderService: FoldersService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.refreshFolder();
  }

  refreshFolder() {
    const folderId = this.route.snapshot.params['id'];
    this.folderService.getFolderDetails(folderId).subscribe({
      next: (folder) => {
        this.folder = folder;
        this.recipesList = folder.recipes;
      },
      error: (error) => {
        console.error(error);
        this.folder = undefined;
      },
    });
  }
  searchRecipes(title: string) {
    const lowerCaseTitle = title.toLowerCase();
    this.recipesList =
      this.folder?.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(lowerCaseTitle)
      ) || [];
  }

  removeRecipe(recipe: Recipe) {
    if (!this.folder) return;
    this.recipesBeingRemoved.add(recipe.id);
    this.folderService
      .removeRecipeFromFolder(this.folder.id, recipe.id)
      .subscribe({
        next: (_) => {
          this.toastrService.success('Recipe removed from folder');
          this.recipesBeingRemoved.delete(recipe.id);
          this.refreshFolder();
        },
        error: (error) => {
          console.error(error);
          this.toastrService.error('Failed to remove recipe from folder');
          this.recipesBeingRemoved.delete(recipe.id);
        },
      });
  }

  isRecipeBeingRemoved(recipeId: string) {
    return this.recipesBeingRemoved.has(recipeId);
  }
}
