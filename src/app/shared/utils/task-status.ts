import { StatusNotificacao } from '../../models/task.model';

const STATUS: Record<StatusNotificacao, { texto: string; classe: string }> = {
  PENDENTE: { texto: 'Pendente', classe: 'status-pendente' },
  NOTIFICADO: { texto: 'Notificada', classe: 'status-notificado' },
  CANCELADO: { texto: 'Cancelada', classe: 'status-cancelado' },
};

export function statusExibicao(status?: StatusNotificacao, concluida = false) {
  if (concluida) {
    return { texto: 'Concluída', classe: 'status-concluida' };
  }
  return (status && STATUS[status]) ?? { texto: '—', classe: 'status-desconhecido' };
}
