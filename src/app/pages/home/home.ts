import { Component } from '@angular/core';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { BidiModule } from '@angular/cdk/bidi';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatAnchor, BidiModule, MatButtonModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  imgHero = 'assets/imagem-hero.svg';
}
