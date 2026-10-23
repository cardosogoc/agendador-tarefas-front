import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from './shared/components/global/top-menu/top-menu';

@Component({
  imports: [RouterOutlet, TopMenu],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('agendador-tarefas');
}
