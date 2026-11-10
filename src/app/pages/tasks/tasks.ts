import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, filter, map, switchMap, tap, timer } from 'rxjs';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksService } from '../../services/TasksService';
import { Toast } from '../../services/ToastService';
import { Confirm } from '../../services/ConfirmService';
import { GrupoTarefa, Task, TaskPayload, TaskView } from '../../models/task.model';
import { exibirDataEvento, lerDataEvento, montarDataEvento } from '../../shared/utils/date.utils';
import { statusExibicao } from '../../shared/utils/task-status';

@Component({
  imports: [MatCardModule, MatButtonModule, MatExpansionModule, MatIconModule, MatTooltipModule],
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

  /** Cards de resumo. Para tirar um card, apague a linha dele. */
  readonly resumo: { grupo: GrupoTarefa; rotulo: string; icone: string }[] = [
    { grupo: 'PENDENTE', rotulo: 'Pendentes', icone: 'hourglass_empty' },
    { grupo: 'NOTIFICADO', rotulo: 'Notificadas', icone: 'mark_email_read' },
    { grupo: 'CONCLUIDA', rotulo: 'Concluídas', icone: 'task_alt' },
    { grupo: 'CANCELADO', rotulo: 'Canceladas', icone: 'cancel' },
  ];

  /** Filtro ativo; null mostra todas. */
  readonly filtro = signal<GrupoTarefa | null>(null);

  /** Relógio da tela: a cada 30s a lista é reavaliada e tarefas vencidas descem. */
  private agora = toSignal(
    timer(0, 30_000).pipe(map(() => Date.now())),
    { initialValue: Date.now() },
  );

  /** Pendentes da mais próxima para a mais distante; concluídas no fim, a mais recente primeiro. */
  readonly tarefasOrdenadas = computed<TaskView[]>(() => {
    const agora = this.agora();
    const marcadas = this.taskService.concluidas();

    return (this.tasks() ?? [])
      .map((task) => {
        const data = lerDataEvento(task.dataEvento).getTime();
        const vencida = data <= agora;
        const manual = marcadas.has(task.id);
        const cancelada = task.statusNotificacaoEnum === 'CANCELADO';
        const concluida = cancelada || vencida || manual;

        const grupo: GrupoTarefa = cancelada
          ? 'CANCELADO'
          : concluida
            ? 'CONCLUIDA'
            : task.statusNotificacaoEnum === 'NOTIFICADO'
              ? 'NOTIFICADO'
              : 'PENDENTE';

        return {
          data,
          view: { ...task, concluida, podeReabrir: manual && !vencida && !cancelada, grupo },
        };
      })
      .sort(
        (a, b) =>
          Number(a.view.concluida) - Number(b.view.concluida) ||
          (a.view.concluida ? b.data - a.data : a.data - b.data),
      )
      .map((item) => item.view);
  });

  /** Quantas tarefas há em cada grupo (sempre sobre a lista inteira, sem filtro). */
  readonly contagem = computed(() => {
    const total: Record<GrupoTarefa, number> = {
      PENDENTE: 0,
      NOTIFICADO: 0,
      CONCLUIDA: 0,
      CANCELADO: 0,
    };
    this.tarefasOrdenadas().forEach((task) => total[task.grupo]++);
    return total;
  });

  /** A lista que aparece na tela: ordenada e já filtrada. */
  readonly tarefasVisiveis = computed(() => {
    const grupo = this.filtro();
    const todas = this.tarefasOrdenadas();
    return grupo ? todas.filter((task) => task.grupo === grupo) : todas;
  });

  hasTasks = () => (this.tasks() ?? []).length > 0;

  alternarFiltro(grupo: GrupoTarefa): void {
    this.filtro.update((atual) => (atual === grupo ? null : grupo));
  }

  limparFiltro(): void {
    this.filtro.set(null);
  }

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
      .pipe(
        switchMap((payload) =>
          this.taskService.editTask(tarefa.id, payload).pipe(
            tap(() => {
              // mudou dia ou horário: a marcação manual sai e a tarefa volta a valer pela data
              if (payload.dataEvento.slice(0, 16) !== tarefa.dataEvento.slice(0, 16)) {
                this.taskService.reabrir(tarefa.id);
              }
            }),
          ),
        ),
      )
      .subscribe({
        next: () => this.toast.success('Tarefa editada com sucesso'),
        error: () => this.toast.error('Erro ao editar a Tarefa'),
      });
  }

  alternarConcluida(tarefa: TaskView): void {
    if (tarefa.podeReabrir) {
      this.taskService.reabrir(tarefa.id);
      this.toast.success('Tarefa reaberta');
    } else {
      this.taskService.concluir(tarefa.id);
      this.toast.success('Tarefa marcada como concluída');
    }
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
