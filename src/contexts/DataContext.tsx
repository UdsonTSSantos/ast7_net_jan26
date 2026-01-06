import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Client,
  Software,
  Service,
  ClientSoftware,
  Occurrence,
  Expense,
  Company,
  User,
} from '@/lib/types'

interface DataContextType {
  clients: Client[]
  softwares: Software[]
  services: Service[]
  clientSoftwares: ClientSoftware[]
  occurrences: Occurrence[]
  expenses: Expense[]
  company: Company
  users: User[]
  addClient: (client: Client) => void
  addSoftware: (software: Software) => void
  addService: (service: Service) => void
  addClientSoftware: (cs: ClientSoftware) => void
  addOccurrence: (occ: Occurrence) => void
  updateOccurrence: (occ: Occurrence) => void
  addExpense: (exp: Expense) => void
  updateCompany: (company: Company) => void
  addUser: (user: User) => void
  deleteItem: (
    type: 'client' | 'software' | 'service' | 'occurrence' | 'expense' | 'user',
    id: string,
  ) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const initialClients: Client[] = [
  {
    id: '1',
    nome_empresa: 'Tech Corp',
    contato_empresa: 'João Silva',
    whatsapp: '11999999999',
    email: 'joao@techcorp.com',
  },
  {
    id: '2',
    nome_empresa: 'Mega Store',
    contato_empresa: 'Maria Souza',
    whatsapp: '11988888888',
    email: 'maria@megastore.com',
  },
]

const initialSoftwares: Software[] = [
  {
    id: '1',
    nome: 'AST7 ERP',
    descricao: 'Sistema completo de gestão',
    preco_unitario: 1500,
    preco_rede: 2500,
    preco_cloud: 150,
  },
  {
    id: '2',
    nome: 'AST7 PDV',
    descricao: 'Ponto de venda',
    preco_unitario: 800,
    preco_rede: 1200,
    preco_cloud: 80,
  },
]

const initialServices: Service[] = [
  {
    id: '1',
    nome: 'Formatação',
    descricao: 'Formatação e reinstalação',
    preco: 150,
  },
  {
    id: '2',
    nome: 'Instalação de Rede',
    descricao: 'Configuração de rede local',
    preco: 300,
  },
]

const initialClientSoftwares: ClientSoftware[] = [
  {
    id: '1',
    clientId: '1',
    softwareId: '1',
    tipo_licenca: 'rede',
    valor_pago: 2500,
    data_aquisicao: new Date().toISOString(),
  },
  {
    id: '2',
    clientId: '2',
    softwareId: '2',
    tipo_licenca: 'unitario',
    valor_pago: 800,
    data_aquisicao: new Date().toISOString(),
  },
]

const initialOccurrences: Occurrence[] = [
  {
    id: '1',
    clientId: '1',
    solicitante: 'João',
    telefone: '11999999999',
    descricao: 'Erro ao emitir nota',
    status: 'aberta',
    data_abertura: new Date().toISOString(),
    prazo_cliente: new Date().toISOString(),
  },
  {
    id: '2',
    clientId: '2',
    solicitante: 'Maria',
    telefone: '11988888888',
    descricao: 'Impressora não conecta',
    status: 'finalizada',
    data_abertura: new Date(Date.now() - 86400000).toISOString(),
    prazo_cliente: new Date().toISOString(),
  },
]

const initialExpenses: Expense[] = [
  {
    id: '1',
    fornecedor: 'AWS',
    descricao: 'Servidor Cloud',
    valor: 300,
    data_vencimento: new Date().toISOString(),
    data_pagamento: new Date().toISOString(),
    metodo_pagamento: 'nubank_pj',
  },
  {
    id: '2',
    fornecedor: 'Aluguel',
    descricao: 'Escritório',
    valor: 1500,
    data_vencimento: new Date(Date.now() + 86400000 * 5).toISOString(),
    data_pagamento: null,
    metodo_pagamento: 'outro',
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [softwares, setSoftwares] = useState<Software[]>(initialSoftwares)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [clientSoftwares, setClientSoftwares] = useState<ClientSoftware[]>(
    initialClientSoftwares,
  )
  const [occurrences, setOccurrences] =
    useState<Occurrence[]>(initialOccurrences)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [users, setUsers] = useState<User[]>([])
  const [company, setCompany] = useState<Company>({
    nome: 'AST7 Software',
    cnpj: '00.000.000/0001-00',
    logoUrl: 'https://img.usecurling.com/i?q=software&color=azure',
  })

  const addClient = (item: Client) => setClients([...clients, item])
  const addSoftware = (item: Software) => setSoftwares([...softwares, item])
  const addService = (item: Service) => setServices([...services, item])
  const addClientSoftware = (item: ClientSoftware) =>
    setClientSoftwares([...clientSoftwares, item])
  const addOccurrence = (item: Occurrence) =>
    setOccurrences([...occurrences, item])
  const updateOccurrence = (item: Occurrence) =>
    setOccurrences(occurrences.map((o) => (o.id === item.id ? item : o)))
  const addExpense = (item: Expense) => setExpenses([...expenses, item])
  const updateCompany = (item: Company) => setCompany(item)
  const addUser = (item: User) => setUsers([...users, item])

  const deleteItem = (type: string, id: string) => {
    switch (type) {
      case 'client':
        setClients(clients.filter((i) => i.id !== id))
        break
      case 'software':
        setSoftwares(softwares.filter((i) => i.id !== id))
        break
      case 'service':
        setServices(services.filter((i) => i.id !== id))
        break
      case 'occurrence':
        setOccurrences(occurrences.filter((i) => i.id !== id))
        break
      case 'expense':
        setExpenses(expenses.filter((i) => i.id !== id))
        break
      case 'user':
        setUsers(users.filter((i) => i.id !== id))
        break
    }
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        softwares,
        services,
        clientSoftwares,
        occurrences,
        expenses,
        company,
        users,
        addClient,
        addSoftware,
        addService,
        addClientSoftware,
        addOccurrence,
        updateOccurrence,
        addExpense,
        updateCompany,
        addUser,
        deleteItem,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
