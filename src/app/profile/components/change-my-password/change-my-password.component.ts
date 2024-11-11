import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared-module.module';
import { AccountsService } from '../../../shared-module/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// icon for change password solid
import { faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-change-my-password',
  standalone: true,
  imports: [SharedModule, FontAwesomeModule],
  templateUrl: './change-my-password.component.html',
  styleUrl: './change-my-password.component.css',
})
export class ChangeMyPasswordComponent implements OnInit {
  formGroup!: FormGroup;
  isSubmitting = false;

  constructor(
    private accountsService: AccountsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup(
      {
        currentPassword: new FormControl(''),
        newPassword: new FormControl(''),
        confirmNewPassword: new FormControl(''),
      },
      { validators: this.passwordMatchValidator as ValidatorFn }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  changeMyPassword() {
    this.isSubmitting = true;

    const oldPassword = this.formGroup.get('currentPassword')?.value;
    const newPassword = this.formGroup.get('newPassword')?.value;

    this.accountsService
      .changePassword({ oldPassword, newPassword })
      .subscribe({
        next: (_) => {
          this.isSubmitting = false;
          this.toastrService.success('Password changed successfully');
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error(error);
          const errorMessage = error.error || 'Failed to change password';
          this.toastrService.error(errorMessage);
        },
      });
  }

  get solidIcons() {
    return {
      faKey,
    };
  }
}
