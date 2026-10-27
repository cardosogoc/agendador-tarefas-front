import { ModalDialog } from './../../shared/components/modal-dialog/modal-dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';
import { DialogField } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
  ],
  selector: 'app-user-data',
  styleUrl: './user-data.scss',
  templateUrl: './user-data.html',
})
export class UserData {
  private formBuilder = inject(FormBuilder);
  private userService = inject(User);
  readonly dialog = inject(MatDialog);
  readonly authService = inject(Auth);

  user = this.userService.user;
  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }],
  });

  //TODO: add mais validations
  cadastrarEndereco() {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        button: {
          icon: 'search',
          callback: (cep: string) => this.buscarEnderecoPeloCep(cep, dialogRef),
        },
        validators: [Validators.required],
      },

      {
        name: 'rua',
        label: 'Rua',
        validators: [Validators.required],
      },

      {
        name: 'numero',
        type: 'number',
        label: 'Numero',
        validators: [Validators.required],
      },
      {
        name: 'complemento',
        label: 'Complemento',
      },
      {
        name: 'cidade',
        label: 'Cidade',
        validators: [Validators.required],
      },
      {
        name: 'estado',
        label: 'UF',
        validators: [Validators.required],
      },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => console.log('Endereço Cadastrado com Sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao Cadastrar o Endereço', result), //TODO: add toast
        });
      }
    });
  }

  cadastrarTelefone() {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    const formConfig: DialogField[] = [
      {
        name: 'ddd',
        label: 'DDD',
        validators: [Validators.required],
      },
      {
        name: 'numero',
        label: 'Número',
        validators: [Validators.required],
      },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Telefone:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.saveTelefone(result, token).subscribe({
          next: () => console.log('Telefone Cadastrado com Sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao Cadastrar o Telefone', result), //TODO: add toast
        });
      }
    });
  }

  buscarEnderecoPeloCep(cep: string, dialogRef: MatDialogRef<ModalDialog, any>) {
    this.userService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        dialogRef.componentInstance.form.patchValue({
          rua: response.logradouro,
          complemento: response.complemento,
          cidade: response.localidade,
          estado: response.uf,
        });
      },
      error: () => console.warn('CEP não encotrado'),
    });
  }

  editarEndereco(endereco: {
    id: number;
    rua: string;
    numero: number;
    complemento: string;
    cidade: string;
    estado: string;
    cep: string;
  }) {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        value: endereco.cep,
        button: {
          icon: 'search',
          callback: (cep: string) => this.buscarEnderecoPeloCep(cep, dialogRef),
        },
        validators: [Validators.required],
      },

      {
        name: 'rua',
        label: 'Rua',
        value: endereco.rua,
        validators: [Validators.required],
      },

      {
        name: 'numero',
        label: 'Nº',
        type: 'number',
        value: endereco.numero,
        validators: [Validators.required],
      },
      {
        name: 'complemento',
        label: 'Complemento',
        value: endereco.complemento,
      },
      {
        name: 'cidade',
        label: 'Cidade',
        value: endereco.cidade,
        validators: [Validators.required],
      },
      {
        name: 'estado',
        label: 'UF',
        value: endereco.estado,
        validators: [Validators.required],
      },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Telefone:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => console.log('Telefone Editado com Sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao Editar o Telefone', result), //TODO: add toast
        });
      }
    });
  }

  editarTelefone(telefone: { id: number; ddd: string; numero: string }) {
    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    const formConfig: DialogField[] = [
      {
        name: 'ddd',
        label: 'DDD',
        value: telefone.ddd,
        validators: [Validators.required],
      },
      {
        name: 'numero',
        label: 'Número',
        value: telefone.numero,
        validators: [Validators.required],
      },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Telefone:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateTelefone(telefone.id, result, token).subscribe({
          next: () => console.log('Telefone Editado com Sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao Editar o Telefone', result), //TODO: add toast
        });
      }
    });
  }
}
