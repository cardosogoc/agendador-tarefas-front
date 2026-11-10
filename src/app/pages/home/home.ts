import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/AuthService';

@Component({
  imports: [MatButtonModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  readonly imgHero = 'assets/imagem-hero.svg';

  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'], { replaceUrl: true });
    }
  }
}
