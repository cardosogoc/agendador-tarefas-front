import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { RouterState } from '../../../../core/router/router-state';
import { Subscription } from 'rxjs';
import { MatCardAvatar } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from '../../../../services/AuthService';
import { User } from '../../../../services/UserService';

@Component({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardAvatar,
    MatMenuModule,
  ],
  selector: 'app-top-menu',
  styleUrl: './top-menu.scss',
  templateUrl: './top-menu.html',
})

//TODO: Arrumar o F5, para continuar desabilitado o botao de cadastrar
export class TopMenu implements OnInit, OnDestroy {
  appLogo = 'assets/logo-agendador-javanauta.png';

  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterState);
  private authService = inject(Auth);
  private userService = inject(User);
  private route = inject(Router);

  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe((url) => {
      this.rotaAtual = url;
    });
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean {
    return this.rotaAtual === '/register';
  }

  estaNaRotaLogin(): boolean {
    return this.rotaAtual === '/login';
  }

  get estaLogado(): boolean {
    return this.authService.isLoggedIn();
  }

  pegarInicialUsuario(): string {
    const user = this.userService.getUser();

    if (user && user.nome) {
      return user.nome.charAt(0).toUpperCase();
    }

    return '?';
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/login']);
  }
}
