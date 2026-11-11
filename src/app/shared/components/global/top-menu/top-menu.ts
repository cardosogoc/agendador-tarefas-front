import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardAvatar } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterState } from '../../../../core/router/router-state';
import { Auth } from '../../../../services/AuthService';
import { User } from '../../../../services/UserService';

@Component({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
  ],
  selector: 'app-top-menu',
  styleUrl: './top-menu.scss',
  templateUrl: './top-menu.html',
})
export class TopMenu {
  readonly appLogo = 'assets/logo-agendador-javanauta.png';

  private routerState = inject(RouterState);
  private authService = inject(Auth);
  private userService = inject(User);
  private router = inject(Router);

  private rotaAtual = toSignal(this.routerState.rotaAtual$, { requireSync: true });

  /** Caminho atual, sem query params nem fragmento. */
  private caminhoAtual(): string {
    return this.rotaAtual().split(/[?#]/)[0];
  }

  estaNaRotaRegister(): boolean {
    return this.caminhoAtual() === '/register';
  }

  estaNaRotaLogin(): boolean {
    return this.caminhoAtual() === '/login';
  }

  get estaLogado(): boolean {
    return this.authService.isLoggedIn();
  }

  pegarInicialUsuario(): string {
    const nome = this.userService.user()?.nome;
    return nome ? nome.charAt(0).toUpperCase() : '?';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
