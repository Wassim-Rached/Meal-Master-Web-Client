import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IngredientsService } from './services/ingredients.service';
import { MeasurmentsUnitsService } from './services/measurments-units.service';
import { RecipesService } from './services/recipes-service.service';
import { NotFoundComponent } from './components/not-found/not-found.component';

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
    provideHttpClient(),
    IngredientsService,
    MeasurmentsUnitsService,
    RecipesService,
  ],
})
export class SharedModule {}
