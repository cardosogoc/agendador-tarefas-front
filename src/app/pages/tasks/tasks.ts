import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksService } from '../../services/TasksService';
import { Toast } from '../../services/ToastService';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Confirm } from '../../services/ConfirmService';
import { filter, switchMap } from 'rxjs';

@Component({
  imports: [MatCardModule, MatButtonModule, MatExpansionModule, MatIconModule],
  selector: 'app-tasks',
  styleUrl: './tasks.scss',
  templateUrl: './tasks.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  readonly dialog = inject(MatDialog);
  private taskService = inject(TasksService);
  private toast = inject(Toast);
  private confirm = inject(Confirm);
  readonly panelOpenState = signal(false);

  tasks = this.taskService.tasks;
  hasTasks = () => (this.tasks() ?? []).length > 0;

  normalizarDataEvento(dataEvento: string) {
    const [data, horario] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-').map(Number);
    const [hora, minuto] = horario.split(':').map(Number);

    const dataFormatada = new Date(ano, mes - 1, dia, hora, minuto);
    const horarioFormatado = new Date(ano, mes - 1, dia, hora, minuto);

    return { dataFormatada, horarioFormatado };
  }

  cadastrarTarefa() {
    const formConfig: DialogField[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa' },
      { name: 'data', label: 'Data do Tarefa', type: 'date' },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time' },
      { name: 'descricao', label: 'Descreva a Tarefa' },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, '0');

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinutes());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;

        const payload = {
          ...resto,
          dataEvento,
        };

        this.taskService.createTask(payload).subscribe({
          next: () => this.toast.success('Tarefa cadastrada com sucesso'),
          error: () => this.toast.error('Erro ao cadastrar a Tarefa'),
        });

        console.log('Tarefa cadastrada', payload);
      }
    });
  }

  editarTarefa(tarefa: any) {
    const { dataFormatada, horarioFormatado } = this.normalizarDataEvento(tarefa.dataEvento);

    const formConfig: DialogField[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa', value: tarefa.nomeTarefa },
      { name: 'data', label: 'Data do Tarefa', type: 'date', value: dataFormatada },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time', value: horarioFormatado },
      { name: 'descricao', label: 'Descreva a Tarefa', value: tarefa.descricao },
    ];

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa:', formConfig },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, '0');

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinutes());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;

        const payload = {
          ...resto,
          dataEvento,
        };

        this.taskService.editTask(tarefa.id, payload).subscribe({
          next: () => this.toast.success('Tarefa editada com sucesso'),
          error: () => this.toast.error('Erro ao editar a Tarefa'),
        });

        console.log('Tarefa cadastrada', payload);
      }
    });
  }

  deletarTarefa(tarefa: { id: string; nomeTarefa: string }): void {
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
}
