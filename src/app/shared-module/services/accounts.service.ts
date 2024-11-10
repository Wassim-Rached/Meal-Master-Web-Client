import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  username: string;
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
    return this.http.get<Account>(`${this.BASE_URL}/api/accounts/my`);
  }

  deleteMyAccount(password: string): Observable<string> {
    return this.http.delete(
      `${this.BASE_URL}/api/accounts/my?password=${password}`,
      {
        responseType: 'text',
      }
    );
  }
}
