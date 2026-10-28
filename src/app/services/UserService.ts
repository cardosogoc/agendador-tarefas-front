import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './AuthService';

interface UserRegisterPayload {
  nome: string;
  email: string;
  senha: string;
  enderecos?: [
    {
      rua: string;
      numero: number;
      complemento: string;
      cidade: string;
      estado: string;
      cep: string;
    },
  ];
  telefones?: [
    {
      numero: string;
      ddd: string;
    },
  ];
}

export interface UserLoginPayload {
  email: string;
  senha: string;
}

export interface UserResponse {
  nome: string;
  email: string;
  enderecos:
    | {
        id: number;
        rua: string;
        numero: number;
        complemento: string;
        cidade: string;
        estado: string;
        cep: string;
      }[]
    | null;
  telefones:
    | {
        id: number;
        numero: string;
        ddd: string;
      }[]
    | null;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'http://localhost:8083'; // TODO: Inserir em um .env
  private http = inject(HttpClient);
  private authService = inject(Auth);
  private jwtHelper = new JwtHelperService();

  private _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  constructor() {
    const usuarioSalvo = this.authService.getUser();

    if (usuarioSalvo) {
      this.setUser(usuarioSalvo);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `${token}` });
  }

  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body);
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post(`${this.apiUrl}/usuario/login`, body, {
      responseType: 'text',
    });
  }

  getUserByEmail(): Observable<UserResponse> {
    const token = this.authService.getToken();
    const email = token ? this.getEmailFromToken(token) : null;

    if (!email) {
      throw new Error('Token inválido');
    }

    return this.http
      .get<UserResponse>(`${this.apiUrl}/usuario?email=${encodeURIComponent(email)}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap((user) => this.setUser(user)));
  }

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.sub || null;
    } catch {
      return null;
    }
  }

  saveEndereco(body: {
    id: number;
    rua: string;
    numero: number;
    complemento: string;
    cidade: string;
    estado: string;
    cep: string;
  }): Observable<any> {
    return this.http
      .post<UserResponse>(`${this.apiUrl}/usuario/endereco`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  getEnderecoByCep(cep: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/endereco/${cep}`);
  }

  saveTelefone(body: { numero: string; ddd: string }): Observable<any> {
    return this.http
      .post<UserResponse>(`${this.apiUrl}/usuario/telefone`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  updateEndereco(
    id: number,
    body: {
      rua: string;
      numero: number;
      complemento: string;
      cidade: string;
      estado: string;
      cep: string;
    },
  ): Observable<any> {
    return this.http
      .put<UserResponse>(`${this.apiUrl}/usuario/endereco?id=${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  updateTelefone(id: number, body: { numero: string; ddd: string }): Observable<any> {
    return this.http
      .put<UserResponse>(`${this.apiUrl}/usuario/telefone?id=${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  getUser(): UserResponse | null {
    return this.user();
  }

  setUser(data: UserResponse | null): void {
    this._user.set(data);
  }

  deleteEndereco(id: number): Observable<UserResponse> {
    return this.http
      .delete<void>(`${this.apiUrl}/usuario/endereco/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  deleteTelefone(id: number): Observable<UserResponse> {
    return this.http
      .delete<void>(`${this.apiUrl}/usuario/telefone/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() => this.getUserByEmail()),
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }
}
