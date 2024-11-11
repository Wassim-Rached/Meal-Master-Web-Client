import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Account {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface CreateAccountRequestBody {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  BASE_URL = environment.backendUrl;

  constructor(private http: HttpClient) {}

  createAccount(body: CreateAccountRequestBody): Observable<string> {
    return this.http.post(`${this.BASE_URL}/api/accounts`, body, {
      responseType: 'text',
    });
  }

  getMyAccount() {
    return this.http.get<Account>(`${this.BASE_URL}/api/accounts/my`).pipe(
      map((account) => {
        if (!account.avatarUrl) {
          account.avatarUrl =
            'https://cdn-icons-png.flaticon.com/512/306/306003.png';
        }
        return account;
      })
    );
  }

  deleteMyAccount(password: string): Observable<string> {
    return this.http.delete(
      `${this.BASE_URL}/api/accounts/my?password=${password}`,
      {
        responseType: 'text',
      }
    );
  }

  updateMyAccount(body: { avatarUrl: string }): Observable<string> {
    return this.http.put(`${this.BASE_URL}/api/accounts/my`, body, {
      responseType: 'text',
    });
  }

  changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }): Observable<string> {
    return this.http.put(
      `${this.BASE_URL}/api/accounts/my/password?oldPassword=${oldPassword}&newPassword=${newPassword}`,
      {},
      {
        responseType: 'text',
      }
    );
  }
}
