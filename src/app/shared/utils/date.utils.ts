const doisDigitos = (n: number) => n.toString().padStart(2, '0');

/** Junta o Date do datepicker e o Date do timepicker em 'dd-MM-yyyy HH:mm:ss'. */
export function montarDataEvento(data: Date, hora: Date): string {
  const dia = doisDigitos(data.getDate());
  const mes = doisDigitos(data.getMonth() + 1);
  const ano = data.getFullYear();

  const h = doisDigitos(hora.getHours());
  const m = doisDigitos(hora.getMinutes());
  const s = doisDigitos(hora.getSeconds());

  return `${dia}-${mes}-${ano} ${h}:${m}:${s}`;
}

/** Lê 'dd-MM-yyyy HH:mm:ss' (formato do back-end) e devolve um Date. */
export function lerDataEvento(dataEvento: string): Date {
  const [data, horario] = dataEvento.split(' ');
  const [dia, mes, ano] = data.split('-').map(Number);
  const [hora, minuto] = horario.split(':').map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto);
}

/** Texto para exibir na lista: 'dd/MM/yyyy' e 'HH:mm'. */
export function exibirDataEvento(dataEvento: string) {
  const [data, horario] = dataEvento.split(' ');
  const [dia, mes, ano] = data.split('-');
  const [hora, minuto] = horario.split(':');

  return { dataString: `${dia}/${mes}/${ano}`, horarioString: `${hora}:${minuto}` };
}
