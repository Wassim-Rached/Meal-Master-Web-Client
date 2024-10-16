import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}

  onSearch(input: HTMLInputElement) {
    const search = input.value;
    this.router.navigate(['/recipes/search'], {
      queryParams: { search },
    });

    // clear the input
    input.value = '';
  }
}
