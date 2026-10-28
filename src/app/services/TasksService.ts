import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, inject, signal } from '@angular/core';
import { Auth } from './AuthService';
import { Observable, switchMap, tap } from 'rxjs';

interface TasksResponse {
  id: string;
  nomeTarefa: string;
  descricao: string;
  dataCriacao: string;
  dataEvento: string;
  emailUsuario: string;
  dataAlteracao: string;
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO';
}

interface TasksPayload {
  nomeTarefa: string;
  descricao: string;
  dataCriacao: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiUrl = 'http://localhost:8083'; //TODO: Inserir em um .env
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private _tasks = signal<TasksResponse[] | null>(null);
  readonly tasks = this._tasks.asReadonly();

  constructor() {
    this.loadTasks();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `${token}` });
  }

  loadTasks(): void {
    this.http
      .get<TasksResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() })
      .subscribe({
        next: (tasks) => this._tasks.set(tasks),
        error: () => this._tasks.set([]),
      });
  }

  createTask(body: TasksPayload): Observable<TasksResponse> {
    return this.http
      .post<TasksResponse>(`${this.apiUrl}/tarefas`, body, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.loadTasks()));
  }

  editTask(id: string, body: TasksPayload): Observable<TasksResponse> {
    return this.http
      .put<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.loadTasks()));
  }

  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/tarefas?id=${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.loadTasks()));
  }
}
