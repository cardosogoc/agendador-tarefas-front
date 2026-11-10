import { API_URL } from './../../core/api';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Observable, filter, map, switchMap } from 'rxjs';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksService } from '../../services/TasksService';
import { Toast } from '../../services/ToastService';
import { Confirm } from '../../services/ConfirmService';
import { Task, TaskPayload } from '../../models/task.model';
import { exibirDataEvento, lerDataEvento, montarDataEvento } from '../../shared/utils/date.utils';
import { statusExibicao } from '../../shared/utils/task-status';
import { Validators } from '@angular/forms';


@Component({
  imports: [MatCardModule, MatButtonModule, MatExpansionModule, MatIconModule],
  selector: 'app-tasks',
  styleUrl: './tasks.scss',
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  private dialog = inject(MatDialog);
  private taskService = inject(TasksService);
  private toast = inject(Toast);
  private confirm = inject(Confirm);

  readonly panelOpenState = signal(false);
  readonly tasks = this.taskService.tasks;

  // o template continua chamando os mesmos nomes
  readonly dataEventoExibicao = exibirDataEvento;
  readonly statusExibicao = statusExibicao;

  hasTasks = () => (this.tasks() ?? []).length > 0;

  cadastrarTarefa(): void {
    this.abrirFormulario('Adicionar Tarefa:')
      .pipe(switchMap((payload) => this.taskService.createTask(payload)))
      .subscribe({
        next: () => this.toast.success('Tarefa cadastrada com sucesso'),
        error: () => this.toast.error('Erro ao cadastrar a Tarefa'),
      });
  }

  editarTarefa(tarefa: Task): void {
    this.abrirFormulario('Editar Tarefa:', tarefa)
      .pipe(switchMap((payload) => this.taskService.editTask(tarefa.id, payload)))
      .subscribe({
        next: () => this.toast.success('Tarefa editada com sucesso'),
        error: () => this.toast.error('Erro ao editar a Tarefa'),
      });
  }

  deletarTarefa(tarefa: Task): void {
    this.confirm
      .ask({
        title: 'Excluir tarefa',
        message: 'Deseja excluir a tarefa',
        highlight: tarefa.nomeTarefa,
        confirmLabel: 'Excluir',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.taskService.deleteTask(tarefa.id)),
      )
      .subscribe({
        next: () => this.toast.success('Tarefa excluída com sucesso'),
        error: () => this.toast.error('Erro ao excluir a tarefa'),
      });
  }

  /** Abre o modal (vazio ou preenchido) e devolve o payload pronto para a API. */
  private abrirFormulario(titulo: string, tarefa?: Task): Observable<TaskPayload> {
    const dataInicial = tarefa ? lerDataEvento(tarefa.dataEvento) : undefined;
    const hoje = new Date();

    const formConfig: DialogField[] = [
      {
        name: 'nomeTarefa',
        label: 'Nome da Tarefa',
        value: tarefa?.nomeTarefa,
        validators: [Validators.required],
      },
      {
        name: 'data',
        label: 'Data da Tarefa',
        type: 'date',
        value: dataInicial,
        minDate: dataInicial && dataInicial < hoje ? dataInicial : hoje,
        validators: [Validators.required],
      },
      {
        name: 'tempo',
        label: 'Hora da Tarefa',
        type: 'time',
        value: dataInicial ?? new Date(2000, 0, 1, 9, 0),
        validators: [Validators.required],
      },
      { name: 'descricao', label: 'Descreva a Tarefa', value: tarefa?.descricao },
    ];

    return this.dialog
      .open(ModalDialog, { data: { title: titulo, formConfig } })
      .afterClosed()
      .pipe(
        filter(Boolean),
        map(({ data, tempo, ...resto }) => ({
          ...resto,
          dataEvento: montarDataEvento(data, tempo),
        })),
      );
  }
}
