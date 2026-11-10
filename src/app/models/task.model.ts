export type StatusNotificacao = 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO';

export interface Task {
  id: string;
  nomeTarefa: string;
  descricao: string;
  dataCriacao: string;
  dataEvento: string;
  emailUsuario: string;
  dataAlteracao: string | null;
  statusNotificacaoEnum: StatusNotificacao;
}

export interface TaskPayload {
  nomeTarefa: string;
  descricao: string;
  dataEvento: string;
}

export type GrupoTarefa = 'PENDENTE' | 'NOTIFICADO' | 'CONCLUIDA' | 'CANCELADO';

export interface TaskView extends Task {
  concluida: boolean;
  podeReabrir: boolean;
  grupo: GrupoTarefa;
}
