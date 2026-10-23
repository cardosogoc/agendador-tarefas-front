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
      password: ['' /*Validators.required*/],
    });
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched;
      return;
    }
    console.log('Enviou o formulário', this.form.value);
  }
}
