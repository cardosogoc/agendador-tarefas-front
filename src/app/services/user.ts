import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

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
    | [
        {
          rua: string;
          numero: number;
          complemento: string;
          cidade: string;
          estado: string;
          cep: string;
        },
      ]
    | null;
  telefones:
    | [
        {
          numero: string;
          ddd: string;
        },
      ]
    | null;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = 'http://localhost:8083';
  private jwtHelper = new JwtHelperService();
  user = signal<UserResponse | null>(null);

  constructor(
    private http: HttpClient,
    private authService: Auth,
  ) {
    const usuarioSalvo = this.authService.getUser();
    if (usuarioSalvo) {
      this.user.set(usuarioSalvo);
    }
  }

  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body);
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, {
      responseType: 'text' as 'json',
    });
  }

  getUserByEmail(token: string): Observable<UserResponse> {
    const email = this.getEmailFromToken(token);

    if (!email) {
      throw new Error('Token inválido');
    }

    const headers = new HttpHeaders({ Authorization: `${token}` });

    return this.http
      .get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers })
      .pipe(tap((user) => this.user.set(user)));
  }

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);

      return decoded?.sub || null;
    } catch (error) {
      return null;
    }
  }

  getUser(): UserResponse | null {
    return this.user();
  }
}
