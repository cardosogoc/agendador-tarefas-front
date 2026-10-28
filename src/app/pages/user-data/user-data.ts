import { ModalDialog } from './../../shared/components/modal-dialog/modal-dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/UserService';
import { DialogField } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/AuthService';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Confirm } from '../../services/ConfirmService';
import { filter, switchMap } from 'rxjs';
import { Toast } from '../../services/ToastService';

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
  private confirm = inject(Confirm);
  private toast = inject(Toast);

  user = this.userService.user;
  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }],
  });

  //TODO: add mais validations
  cadastrarEndereco() {
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
        this.userService.saveEndereco(result).subscribe({
          next: () => this.toast.success('Endereço cadastrado com sucesso'),
          error: () => this.toast.error('Erro ao cadastrar o Endereço'),
        });
      }
    });
  }

  cadastrarTelefone() {
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
        this.userService.saveTelefone(result).subscribe({
          next: () => this.toast.success('Telefone cadastrado com sucesso'),
          error: () => this.toast.error('Erro ao cadastrar o Telefone'),
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
        this.userService.updateEndereco(endereco.id, result).subscribe({
          next: () => this.toast.success('Endereço editado com sucesso'),
          error: () => this.toast.error('Erro ao editar o Endereço'),
        });
      }
    });
  }

  editarTelefone(telefone: { id: number; ddd: string; numero: string }) {
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
        this.userService.updateTelefone(telefone.id, result).subscribe({
          next: () => this.toast.success('Telefone Editado com Sucesso'),
          error: () => this.toast.error('Erro ao Editar o Telefone'),
        });
      }
    });
  }

  deletarEndereco(endereco: {
    id: number;
    rua: string;
    numero: number;
    complemento: string;
    cidade: string;
    estado: string;
    cep: string;
  }) {
    this.confirm
      .ask({
        title: 'Excluir Endereço',
        message: 'Deseja excluir o endereço',
        highlight: `${endereco.rua}, ${endereco.cidade}, ${endereco.estado}`,
        confirmLabel: 'Excluir',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.userService.deleteEndereco(endereco.id)),
      )
      .subscribe({
        next: () => this.toast.success('Endereço excluído com sucesso'),
        error: () => this.toast.error('Erro ao excluir o Endereço'),
      });
  }

  deletarTelefone(telefone: { id: number; ddd: string; numero: string }) {
    this.confirm
      .ask({
        title: 'Excluir telefone',
        message: 'Deseja excluir o telefone',
        highlight: `(${telefone.ddd}) ${telefone.numero}`,
        confirmLabel: 'Excluir',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.userService.deleteTelefone(telefone.id)),
      )
      .subscribe({
        next: () => this.toast.success('Telefone excluído com sucesso'),
        error: () => this.toast.error('Erro ao excluir o telefone'),
      });
  }
}
