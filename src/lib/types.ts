export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface Client {
  id: string
  nome_empresa: string
  contato_empresa: string
  whatsapp: string
  email: string
}

export interface Software {
  id: string
  nome: string
  descricao: string
  preco_unitario: number
  preco_rede: number
  preco_cloud: number
}

export interface Service {
  id: string
  nome: string
  descricao: string
  preco: number
}

export interface ClientSoftware {
  id: string
  clientId: string
  softwareId: string
  tipo_licenca: 'unitario' | 'rede' | 'cloud'
  valor_pago: number
  data_aquisicao: string
}

export interface Occurrence {
  id: string
  clientId: string
  solicitante: string
  telefone: string
  descricao: string
  status: 'aberta' | 'finalizada' | 'aguardando_retorno'
  data_abertura: string
  prazo_cliente: string
}

export interface Expense {
  id: string
  fornecedor: string
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento?: string | null
  metodo_pagamento: 'nubank_pf' | 'nubank_pj' | 'mercado_pago' | 'outro'
}

export interface Company {
  nome: string
  cnpj: string
  logoUrl?: string
}
