import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared-module/shared-module.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'meal-master-web-client';
}
