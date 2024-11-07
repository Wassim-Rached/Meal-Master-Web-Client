import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Account, AccountsService } from './accounts.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export type SigninCredentials = {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = environment.backendUrl;

  private currentAccountSubject = new BehaviorSubject<Account | null>(null);
  public currentAccount$ = this.currentAccountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  refreshAccount(): void {
    if (this.isAuthenticated()) {
      this.accountsService.getMyAccount().subscribe({
        next: (account: Account) => {
          this.currentAccountSubject.next(account);
        },
        error: (error) => {
          console.error(error);
          this.toastrService.error('Failed to fetch current account');
          this.logout();
          this.router.navigate(['/auth/signin']);
        },
      });
    } else {
      this.currentAccountSubject.next(null);
    }
  }

  signin(creds: SigninCredentials): Observable<string> {
    return this.http
      .post<string>(`${this.BASE_URL}/api/auth/login`, creds, {
        responseType: 'text' as 'json',
      })
      .pipe(
        map((token) => {
          this.saveToken(token);
          this.refreshAccount();
          return token as string;
        }),
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentAccountSubject.next(null);
    this.toastrService.info('Logged out');
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // signin(creds: SigninCredentials): Observable<string> {
  //   return this.http.post<string>(`${this.BASE_URL}/api/auth/login`, creds, {
  //     responseType: 'text' as 'json',
  //   });
  // }
}
