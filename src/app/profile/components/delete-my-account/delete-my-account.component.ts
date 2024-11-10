import { Component } from '@angular/core';
import { AccountsService } from '../../../shared-module/services/accounts.service';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-my-account',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './delete-my-account.component.html',
  styleUrl: './delete-my-account.component.css',
})
export class DeleteMyAccountComponent {
  isSubmitting = false;

  constructor(
    private accountsService: AccountsService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  deleteMyAccount(password: string) {
    this.accountsService.deleteMyAccount(password).subscribe({
      next: () => {
        this.toastService.success('Account deleted');
        this.router.navigate(['/']).then(() => {
          this.toastService.info(
            'You have been logged out and redirected to the home page'
          );
        });
      },
      error: (error) => {
        const errorMessage = error.error || 'Failed to delete account';
        this.toastService.error(errorMessage);
      },
    });
  }
}
