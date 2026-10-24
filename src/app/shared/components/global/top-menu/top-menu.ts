import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { RouterState } from '../../../../core/router/router-state';
import { Subscription } from 'rxjs';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
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
}
