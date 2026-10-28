import { Component, inject } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { BidiModule } from '@angular/cdk/bidi';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/AuthService';

@Component({
  imports: [MatAnchor, BidiModule, MatButtonModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  imgHero = 'assets/imagem-hero.svg';

  // constructor(
  //   private authService: Auth,
  //   private router: Router,
  // ) {}

  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }
}
