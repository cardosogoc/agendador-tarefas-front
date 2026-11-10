import { Injectable, signal } from '@angular/core';
import { UserResponse } from './UserService';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER = 'logged_user';

  private readonly logado = signal(!!localStorage.getItem(this.TOKEN_KEY));

  readonly estaLogado = this.logado.asReadonly();

  constructor() {
    // token vencido guardado de uma sessão anterior: limpa antes de qualquer guard rodar
    const token = this.getToken();
    if (token && this.tokenExpirado(token)) {
      this.logout();
    }
  }

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
    try {
      return JSON.parse(user) as UserResponse;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return this.logado() && !!token && !this.tokenExpirado(token);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER);
    this.logado.set(false);
  }

  private tokenExpirado(token: string): boolean {
    try {
      const payload = token.replace(/^Bearer\s+/i, '').split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const { exp } = JSON.parse(json);
      return typeof exp === 'number' && exp * 1000 <= Date.now();
    } catch {
      return false;
    }
  }
}
