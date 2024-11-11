import { Component, Input, OnInit } from '@angular/core';
import {
  Account,
  AccountsService,
} from '../../../shared-module/services/accounts.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-update-my-account',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './update-my-account.component.html',
  styleUrl: './update-my-account.component.css',
})
export class UpdateMyAccountComponent implements OnInit {
  @Input({ required: true }) account!: Account;
  isSubmitting = false;
  formGroup!: FormGroup;

  constructor(
    private accountsService: AccountsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      avatarUrl: new FormControl(this.account.avatarUrl),
    });
  }

  updateMyAccount() {
    this.isSubmitting = true;

    this.accountsService
      .updateMyAccount({
        avatarUrl: this.formGroup.value.avatarUrl,
      })
      .subscribe({
        next: (_) => {
          this.isSubmitting = false;
          this.toastrService.success('Account updated successfully');
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error(error);
          const errorMessage = error.error || 'Failed to update account';
          this.toastrService.error(errorMessage);
        },
      });
  }

  get solidIcons() {
    return {
      faSave,
    };
  }
}
