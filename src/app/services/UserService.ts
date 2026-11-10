import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { Endereco, Telefone } from '../models/user.models';
import { Auth } from './AuthService';

export type EnderecoPayload = Omit<Endereco, 'id'>;
export type TelefonePayload = Omit<Telefone, 'id'>;

export interface UserRegisterPayload {
  nome: string;
  email: string;
  senha: string;
  enderecos?: EnderecoPayload[];
  telefones?: TelefonePayload[];
}

export interface UserLoginPayload {
  email: string;
  senha: string;
}

export interface UserResponse {
  nome: string;
  email: string;
  enderecos: Endereco[] | null;
  telefones: Telefone[] | null;
}

export interface ViaCepResponse {
  logradouro: string;
  complemento: string;
  localidade: string;
  uf: string;
  erro?: boolean;
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

    // ao deslogar, limpa o usuário que está em memória
    effect(() => {
      if (!this.authService.estaLogado()) {
        this.setUser(null);
      }
    });
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

  /** Busca o usuário logado e guarda no estado e no localStorage. */
  getUserByEmail(): Observable<UserResponse> {
    const token = this.authService.getToken();
    const email = token ? this.getEmailFromToken(token) : null;

    if (!email) {
      return throwError(() => new Error('Token inválido'));
    }

    return this.http
      .get<UserResponse>(`${this.apiUrl}/usuario?email=${encodeURIComponent(email)}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((user) => {
          this.setUser(user);
          this.authService.saveUser(user);
        }),
      );
  }

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.sub || null;
    } catch {
      return null;
    }
  }

  getEnderecoByCep(cep: string): Observable<ViaCepResponse> {
    return this.http.get<ViaCepResponse>(`${this.apiUrl}/usuario/endereco/${cep}`);
  }

  // ---------- Endereço ----------

  saveEndereco(body: EnderecoPayload): Observable<UserResponse> {
    return this.http
      .post<unknown>(`${this.apiUrl}/usuario/endereco`, body, { headers: this.getHeaders() })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  updateEndereco(id: number, body: EnderecoPayload): Observable<UserResponse> {
    return this.http
      .put<unknown>(`${this.apiUrl}/usuario/endereco?id=${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  deleteEndereco(id: number): Observable<UserResponse> {
    return this.http
      .delete<void>(`${this.apiUrl}/usuario/endereco/${id}`, { headers: this.getHeaders() })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  // ---------- Telefone ----------

  saveTelefone(body: TelefonePayload): Observable<UserResponse> {
    return this.http
      .post<unknown>(`${this.apiUrl}/usuario/telefone`, body, { headers: this.getHeaders() })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  updateTelefone(id: number, body: TelefonePayload): Observable<UserResponse> {
    return this.http
      .put<unknown>(`${this.apiUrl}/usuario/telefone?id=${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  deleteTelefone(id: number): Observable<UserResponse> {
    return this.http
      .delete<void>(`${this.apiUrl}/usuario/telefone/${id}`, { headers: this.getHeaders() })
      .pipe(switchMap(() => this.getUserByEmail()));
  }

  // ---------- Estado ----------

  getUser(): UserResponse | null {
    return this.user();
  }

  setUser(data: UserResponse | null): void {
    this._user.set(data);
  }
}
