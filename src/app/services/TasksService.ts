import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, interval, tap } from 'rxjs';
import { Auth } from './AuthService';
import { Task, TaskPayload } from '../models/task.model';
import { API_URL } from '../core/api';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiUrl = API_URL;
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private _tasks = signal<Task[] | null>(null);
  readonly tasks = this._tasks.asReadonly();

  constructor() {
    // carrega ao logar e limpa ao deslogar
    effect(() => {
      if (this.authService.estaLogado()) {
        this.loadTasks();
      } else {
        this._tasks.set(null);
      }
    });

    interval(30000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.authService.isLoggedIn()) this.loadTasks(true);
      });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `${token}` });
  }

  loadTasks(silencioso = false): void {
    this.http.get<Task[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() }).subscribe({
      next: (tasks) => this._tasks.set(tasks),
      error: () => {
        if (!silencioso) this._tasks.set([]);
      },
    });
  }

  createTask(body: TaskPayload): Observable<Task> {
    return this.http
      .post<Task>(`${this.apiUrl}/tarefas`, body, { headers: this.getHeaders() })
      .pipe(tap(() => this.loadTasks()));
  }

  editTask(id: string, body: TaskPayload): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/tarefas?id=${id}`, body, { headers: this.getHeaders() })
      .pipe(tap(() => this.loadTasks()));
  }

  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/tarefas?id=${id}`, { headers: this.getHeaders() })
      .pipe(tap(() => this.loadTasks()));
  }
}
