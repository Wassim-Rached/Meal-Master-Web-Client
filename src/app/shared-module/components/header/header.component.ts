import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../../services/accounts.service';
import { SharedModule } from '../../shared-module.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  account: Account | null = null;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  onSearch(input: HTMLInputElement) {
    const search = input.value;
    this.router.navigate(['/recipes/search'], {
      queryParams: { search },
    });

    // clear the input
    input.value = '';
  }

  ngOnInit(): void {
    this.authService.currentAccount$.subscribe((account) => {
      this.account = account;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']).then(() => {
      this.toastrService.info('Redirected to singin page');
    });
  }
}
