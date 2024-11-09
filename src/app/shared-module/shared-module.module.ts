import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IngredientsService } from './services/ingredients.service';
import { MeasurmentsUnitsService } from './services/measurments-units.service';
import { RecipesService } from './services/recipes-service.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthService } from './services/auth-service.service';
import { AccountsService } from './services/accounts.service';
import { FavoritesService } from './services/favorites.service';
import { FoldersService } from './services/folders.service';
import { RequireAuthGuard } from '../guards/AuthGuard';
import { RequireUnAuthGuard } from '../guards/UnAuthGuard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  exports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    NotFoundComponent,
  ],
  providers: [
    IngredientsService,
    MeasurmentsUnitsService,
    RecipesService,
    AuthService,
    AccountsService,
    FavoritesService,
    FoldersService,
    RequireAuthGuard,
    RequireUnAuthGuard,
  ],
})
export class SharedModule {}
