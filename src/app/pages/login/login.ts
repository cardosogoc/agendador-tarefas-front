import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User, UserLoginPayload } from '../../services/user';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  isLoading = false;

  form: FormGroup<{ email: FormControl<string>; senha: FormControl<string> }>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: User,
    private authService: Auth,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      senha: this.formBuilder.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    });
  }

  get emailErros(): string | null {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'A informação do email é obrigatória';
    }
    if (control?.hasError('email')) {
      return 'Digite um email válido';
    }
    return null;
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched;
      return;
    }

    const formData = this.form.value as UserLoginPayload;

    this.isLoading = true;

    this.userService
      .login(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log('Erro ao logar', error);
        },
      });
  }
}
