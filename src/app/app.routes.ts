import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared-module/components/not-found/not-found.component';
import { RequireUnAuthGuard } from './guards/UnAuthGuard';
import { RequireAuthGuard } from './guards/AuthGuard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'favorites',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./favorites/favorites.module').then((m) => m.FavoritesModule),
  },
  {
    path: 'folders',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./folders/folders.module').then((m) => m.FoldersModule),
  },
  {
    path: 'profile',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'auth',
    canActivate: [RequireUnAuthGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
