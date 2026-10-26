import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { User } from '../../services/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  form: FormGroup;

  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: User,
    private router: Router,
    private authService: Auth,
  ) {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  get fullNameErros(): string | null {
    const control = this.form.get('nome');
    if (control?.hasError('required')) {
      return 'O nome completo é um campo obrigatório';
    }
    if (control?.hasError('minlength')) {
      return 'Cadastre um nome com pelo menos 3 letras';
    }
    return null;
  }

  get emailErros(): string | null {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'O email é um campo obrigatório';
    }
    if (control?.hasError('email')) {
      return 'Digite um email válido';
    }
    return null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched;
      return;
    }

    const formData = this.form.value;

    this.isLoading = true;

    this.userService
      .register(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Erro no cadastro', error);
        },
      });
  }
}
