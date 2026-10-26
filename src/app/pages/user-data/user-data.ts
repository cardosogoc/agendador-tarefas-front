import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'app-user-data',
  styleUrl: './user-data.scss',
  templateUrl: './user-data.html',
})
export class UserData {
  private formBuilder = inject(FormBuilder);
  private usaerService = inject(User);

  user = this.usaerService.getUser();
  form = this.formBuilder.group({
    nome: [{ value: this.user?.nome || '', disabled: true }],
    email: [{ value: this.user?.email || '', disabled: true }],
  });
}
