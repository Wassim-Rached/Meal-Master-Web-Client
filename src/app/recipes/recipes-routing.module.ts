import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRecipeComponent } from './pages/create-recipe/create-recipe.component';
import { SearchAndFilterComponent } from './pages/search-and-filter/search-and-filter.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { RequireAuthGuard } from '../guards/AuthGuard';
import { UpdateRecipeComponent } from './pages/update-recipe/update-recipe.component';

const routes: Routes = [
  {
    path: 'create',
    canActivate: [RequireAuthGuard],
    component: CreateRecipeComponent,
  },
  {
    path: 'update/:id',
    canActivate: [RequireAuthGuard],
    component: UpdateRecipeComponent,
  },
  {
    path: 'search',
    component: SearchAndFilterComponent,
  },
  {
    path: ':id',
    component: RecipeDetailsComponent,
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
