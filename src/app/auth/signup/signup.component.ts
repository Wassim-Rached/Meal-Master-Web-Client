import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AccountsService,
  CreateAccountRequestBody,
} from '../../shared-module/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../shared-module/shared-module.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  formGroup!: FormGroup;
  isSubmitting = false;

  constructor(
    private accountService: AccountsService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formGroup.invalid || this.isSubmitting) return;

    const { username, password, confirmPassword } = this.formGroup.value;
    const errorMessage = this.validateForm({
      username,
      password,
      confirmPassword,
    });
    if (errorMessage) {
      this.toastrService.error(errorMessage);
      return;
    }

    const body: CreateAccountRequestBody = { username, password };

    this.isSubmitting = true;
    this.accountService.createAccount(body).subscribe({
      next: () => {
        this.toastrService.success('Account created successfully');
        this.isSubmitting = false;
        this.router.navigate(['/auth/signin']).then(() => {
          this.toastrService.info('Redirected to login page');
        });
      },
      error: (error) => {
        this.toastrService.error(error);
        this.isSubmitting = false;
      },
    });
  }

  validateForm({
    username,
    password,
    confirmPassword,
  }: {
    username: string;
    password: string;
    confirmPassword: string;
  }): string | null {
    if (username.length < 3) {
      return 'Username should be at least 3 characters long';
    }
    if (password !== confirmPassword) {
      return 'Password and Confirm Password should be equal';
    }
    return null;
  }
}
