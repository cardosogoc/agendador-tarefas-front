export interface Endereco {
  id: number;
  rua: string;
  numero: number;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Telefone {
  id: number;
  ddd: string;
  numero: string;
}
