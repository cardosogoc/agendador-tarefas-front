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

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
  ],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get fullNameErros(): string | null {
    const control = this.form.get('fullName');
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
    console.log('Enviou o formulário', this.form.value);
  }
}
