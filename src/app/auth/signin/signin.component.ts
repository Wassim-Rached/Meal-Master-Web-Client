import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared-module/shared-module.module';
import { AuthService } from '../../shared-module/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent implements OnInit {
  formGroup!: FormGroup;
  isSubmitting = false;
  redirect: string = '';

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    const queryParams = this.router.parseUrl(this.router.url).queryParams;
    this.redirect = queryParams['redirect'] || '';
  }

  onSubmit() {
    this.isSubmitting = true;

    const username = this.formGroup.get('username')?.value;
    const password = this.formGroup.get('password')?.value;

    this.authService.signin({ username, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastrService.success('Signin successful');
        this.authService.refreshAccount();
        this.router.navigate([this.redirect || '/']).then(() => {
          this.toastrService.info('Redirected Back Successfully');
        });
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const message = err.error || 'An error occurred';
        this.toastrService.error(message);
      },
    });
  }
}
