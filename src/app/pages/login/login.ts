import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { User } from '../../services/UserService';
import { Auth } from '../../services/AuthService';
import { Toast } from '../../services/ToastService';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  selector: 'app-login',
  styleUrl: '../../shared/styles/auth.scss',
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private userService = inject(User);
  private authService = inject(Auth);
  private router = inject(Router);
  private toast = inject(Toast);

  isLoading = false;
  readonly imgHero = 'assets/tarefas-lo.jpg';

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'], { replaceUrl: true });
    }
  }

  get emailErros(): string | null {
    const control = this.form.controls.email;
    if (control.hasError('required')) {
      return 'A informação do email é obrigatória';
    }
    if (control.hasError('email')) {
      return 'Digite um email válido';
    }
    return null;
  }

  get passwordControl(): FormControl<string> {
    return this.form.controls.senha;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.userService
      .login(this.form.getRawValue())
      .pipe(
        tap((token) => this.authService.saveToken(token)),
        switchMap(() => this.userService.getUserByEmail()),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) =>
          this.toast.error(
            err.status === 0 ? 'Servidor indisponível. Tente novamente.' : 'E-mail ou senha inválidos',
          ),
      });
  }
}
