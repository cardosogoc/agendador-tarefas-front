// MUDOU: removi o import `Service`, que não era usado, e adicionei `signal`
import { Injectable, signal } from '@angular/core';
import { UserResponse } from './user';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER = 'logged_user';

  private readonly logado = signal(!!localStorage.getItem(this.TOKEN_KEY));

  readonly estaLogado = this.logado.asReadonly();

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.logado.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: UserResponse): void {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getUser(): UserResponse | null {
    const user = localStorage.getItem(this.USER);
    if (!user) {
      return null;
    }
    return JSON.parse(user) as UserResponse;
  }

  isLoggedIn(): boolean {
    return this.logado();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.logado.set(false);

    localStorage.removeItem(this.USER);
  }
}
