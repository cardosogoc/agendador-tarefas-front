import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterState {
  private router = inject(Router);

  private rotaAtualSubject$ = new BehaviorSubject<string>(this.router.url);
  public readonly rotaAtual$ = this.rotaAtualSubject$.asObservable();

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((evento) => {
        this.rotaAtualSubject$.next(evento.urlAfterRedirects);
      });
  }
}
