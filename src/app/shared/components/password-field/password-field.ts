import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  selector: 'input-password-field',
  styleUrl: './password-field.scss',
  templateUrl: './password-field.html',
})
export class PasswordField {
  readonly hide = signal(true);

  @Input({ required: true }) control!: FormControl;
  @Input() placeholder = 'Digite a sua senha';

  get passwordErros(): string | null {
    if (this.control.hasError('required')) {
      return 'Senha é um campo obrigatório';
    }

    const minlength = this.control.getError('minlength');
    if (minlength) {
      return `Senha deve conter no mínimo ${minlength.requiredLength} dígitos`;
    }

    return null;
  }

  clickEvent(event: MouseEvent): void {
    this.hide.update((valor) => !valor);
    event.stopPropagation();
  }
}
