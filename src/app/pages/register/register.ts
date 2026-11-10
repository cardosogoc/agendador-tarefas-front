import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { User } from '../../services/UserService';
import { Auth } from '../../services/AuthService';
import { Toast } from '../../services/ToastService';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class Register implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(User);
  private router = inject(Router);
  private authService = inject(Auth);
  private toast = inject(Toast);

  isLoading = false;

  form = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'], { replaceUrl: true });
    }
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.senha;
  }

  get fullNameErros(): string | null {
    const control = this.form.controls.nome;
    if (control.hasError('required')) {
      return 'O nome completo é um campo obrigatório';
    }
    if (control.hasError('minlength')) {
      return 'Cadastre um nome com pelo menos 3 letras';
    }
    return null;
  }

  get emailErros(): string | null {
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'O email é um campo obrigatório';
    }
    if (control.hasError('email')) {
      return 'Digite um email válido';
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.userService
      .register(this.form.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.toast.success('Cadastro realizado! Faça login para continuar.');
          this.router.navigate(['/login']);
        },
        error: (err) =>
          this.toast.error(
            err.status === 0
              ? 'Servidor indisponível. Tente novamente.'
              : 'Não foi possível concluir o cadastro',
          ),
      });
  }
}
