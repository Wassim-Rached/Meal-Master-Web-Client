import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared-module/components/not-found/not-found.component';
import { RequireUnAuthGuard } from './guards/UnAuthGuard';
import { RequireAuthGuard } from './guards/AuthGuard';
import { DevTeamComponent } from './pages/dev-team/dev-team.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dev-team',
    loadComponent: () =>
      import('./pages/dev-team/dev-team.component').then(
        (m) => m.DevTeamComponent
      ),
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
    path: 'schedules',
    canActivate: [RequireAuthGuard],
    loadChildren: () =>
      import('./schedules/schedules.module').then((m) => m.SchedulesModule),
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
