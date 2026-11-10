import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/AuthService';

@Component({
  imports: [MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  readonly imgHero = 'assets/imagem-hero.svg';

  readonly passos = [
    {
      numero: 1,
      titulo: 'Crie sua conta',
      texto: 'Cadastre-se com nome, e-mail e senha. É rápido.',
    },
    {
      numero: 2,
      titulo: 'Agende suas tarefas',
      texto: 'Escolha o dia e o horário de cada tarefa e descreva o que precisa ser feito.',
    },
    {
      numero: 3,
      titulo: 'Receba o aviso',
      texto: 'Enviamos um e-mail cerca de 1 hora antes do horário, para você não esquecer.',
    },
  ];

  readonly recursos = [
    {
      icone: 'edit_calendar',
      titulo: 'Agende com data e hora',
      texto: 'Escolha o dia no calendário e o horário em formato 24h, como você já usa no dia a dia.',
    },
    {
      icone: 'mark_email_read',
      titulo: 'Aviso por e-mail',
      texto: 'Receba um lembrete antes do horário de cada tarefa, sem precisar abrir o sistema.',
    },
    {
      icone: 'swap_vert',
      titulo: 'Sempre na ordem certa',
      texto:
        'As tarefas mais próximas ficam no topo, e as que já passaram descem sozinhas como concluídas.',
    },
    {
      icone: 'task_alt',
      titulo: 'Acompanhe o andamento',
      texto:
        'Veja quantas estão pendentes, notificadas ou concluídas, filtre com um clique e marque como concluída quando quiser.',
    },
    {
      icone: 'contacts',
      titulo: 'Seus dados em um só lugar',
      texto: 'Mantenha endereços e telefones no seu perfil e preencha o endereço pelo CEP.',
    },
    {
      icone: 'lock',
      titulo: 'Acesso protegido',
      texto: 'Entre com e-mail e senha. Suas tarefas ficam atrás de um login.',
    },
  ];

  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'], { replaceUrl: true });
    }
  }
}
