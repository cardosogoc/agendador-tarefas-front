import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  selector: 'input-password-field',
  styleUrl: './password-field.scss',
  templateUrl: './password-field.html',
})
export class PasswordField {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
