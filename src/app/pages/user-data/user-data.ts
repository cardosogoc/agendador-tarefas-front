import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, filter, switchMap } from 'rxjs';
import { Endereco, Telefone } from '../../models/user.models';
import { Auth } from '../../services/AuthService';
import { Confirm } from '../../services/ConfirmService';
import { Toast } from '../../services/ToastService';
import { User } from '../../services/UserService';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';

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
  private confirm = inject(Confirm);
  private toast = inject(Toast);
  readonly dialog = inject(MatDialog);
  readonly authService = inject(Auth);

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
  });

  constructor() {
    effect(() => {
      const user = this.user();
      this.form.patchValue({ nome: user?.nome ?? '', email: user?.email ?? '' });
    });
  }

  // ---------- Endereço ----------

  cadastrarEndereco(): void {
    this.abrirModal('Adicionar Endereço:', this.camposEndereco())
      .pipe(switchMap((dados) => this.userService.saveEndereco(dados)))
      .subscribe({
        next: () => this.toast.success('Endereço cadastrado com sucesso'),
        error: () => this.toast.error('Erro ao cadastrar o Endereço'),
      });
  }

  editarEndereco(endereco: Endereco): void {
    this.abrirModal('Editar Endereço:', this.camposEndereco(endereco))
      .pipe(switchMap((dados) => this.userService.updateEndereco(endereco.id, dados)))
      .subscribe({
        next: () => this.toast.success('Endereço editado com sucesso'),
        error: () => this.toast.error('Erro ao editar o Endereço'),
      });
  }

  deletarEndereco(endereco: Endereco): void {
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

  // ---------- Telefone ----------

  cadastrarTelefone(): void {
    this.abrirModal('Adicionar Telefone:', this.camposTelefone())
      .pipe(switchMap((dados) => this.userService.saveTelefone(dados)))
      .subscribe({
        next: () => this.toast.success('Telefone cadastrado com sucesso'),
        error: () => this.toast.error('Erro ao cadastrar o Telefone'),
      });
  }

  editarTelefone(telefone: Telefone): void {
    this.abrirModal('Editar Telefone:', this.camposTelefone(telefone))
      .pipe(switchMap((dados) => this.userService.updateTelefone(telefone.id, dados)))
      .subscribe({
        next: () => this.toast.success('Telefone editado com sucesso'),
        error: () => this.toast.error('Erro ao editar o Telefone'),
      });
  }

  deletarTelefone(telefone: Telefone): void {
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

  // ---------- Apoio ----------

  /** Abre o modal e só emite se o usuário confirmou (não emite ao cancelar). */
  private abrirModal(title: string, formConfig: DialogField[]): Observable<any> {
    return this.dialog
      .open(ModalDialog, { data: { title, formConfig } })
      .afterClosed()
      .pipe(filter(Boolean));
  }

  //TODO: add mais validations
  private camposEndereco(endereco?: Endereco): DialogField[] {
    return [
      {
        name: 'cep',
        label: 'CEP',
        value: endereco?.cep,
        button: {
          icon: 'search',
          callback: (cep, dialogRef) => this.buscarEnderecoPeloCep(cep, dialogRef),
        },
        validators: [Validators.required],
      },
      { name: 'rua', label: 'Rua', value: endereco?.rua, validators: [Validators.required] },
      {
        name: 'numero',
        label: 'Nº',
        type: 'number',
        value: endereco?.numero,
        validators: [Validators.required],
      },
      { name: 'complemento', label: 'Complemento', value: endereco?.complemento },
      { name: 'cidade', label: 'Cidade', value: endereco?.cidade, validators: [Validators.required] },
      { name: 'estado', label: 'UF', value: endereco?.estado, validators: [Validators.required] },
    ];
  }

  private camposTelefone(telefone?: Telefone): DialogField[] {
    return [
      { name: 'ddd', label: 'DDD', value: telefone?.ddd, validators: [Validators.required] },
      {
        name: 'numero',
        label: 'Número',
        value: telefone?.numero,
        validators: [Validators.required],
      },
    ];
  }

  private buscarEnderecoPeloCep(cep: string, dialogRef: MatDialogRef<ModalDialog>): void {
    const cepLimpo = (cep ?? '').replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      this.toast.error('Digite um CEP com 8 números');
      return;
    }

    this.userService.getEnderecoByCep(cepLimpo).subscribe({
      next: (response) => {
        if (response.erro) {
          this.toast.error('CEP não encontrado');
          return;
        }
        dialogRef.componentInstance.form.patchValue({
          rua: response.logradouro,
          complemento: response.complemento,
          cidade: response.localidade,
          estado: response.uf,
        });
      },
      error: () => this.toast.error('Erro ao buscar o CEP'),
    });
  }
}
