import { Component } from '@angular/core';
import { RecomendationsComponent } from '../../recipes/components/recomendations/recomendations.component';
import { SharedModule } from '../../shared-module/shared-module.module';
import { faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faStar,
  faHeart,
  faCalendarAlt,
  faUtensils,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecomendationsComponent, SharedModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  get solidIcons() {
    return {
      faUsers,
      faStar,
      faHeart,
      faCalendarAlt,
      faUtensils,
      faClipboardList,
      faSearch,
    };
  }
}
