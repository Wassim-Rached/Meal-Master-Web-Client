import { Component } from '@angular/core';
import { RecomendationsComponent } from '../../recipes/components/recomendations/recomendations.component';
import { SharedModule } from '../../shared-module/shared-module.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecomendationsComponent, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
