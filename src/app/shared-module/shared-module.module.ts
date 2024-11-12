import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
// Removed unused imports
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
import { CalendarUtils, DateAdapter, CalendarModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SchedulesService } from './services/schedules.service';
import { MessagesService } from './services/messages.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    NotFoundComponent,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
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
    SchedulesService,
    MessagesService,
    RequireAuthGuard,
    RequireUnAuthGuard,
    CalendarUtils,
  ],
})
export class SharedModule {}
