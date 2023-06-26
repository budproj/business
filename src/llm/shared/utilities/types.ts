export type ModelName = typeof MODEL_NAMES[number]

export const MODEL_NAMES = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-16k-0301',
  'gpt-3.5-turbo-16k-0613',
]

export interface SummarizeKeyResultInput {
  objective: Objective
  cycle: Cycle
  title: string
  description: string
  goal: number
  format: Format
  owner: Owner
  comments: Comment[]
  checklist: Task[]
  checkIns: CheckIn[]
}

export interface Objective {
  title: string
}

export interface Cycle {
  cadence: string
  dateStart: string
  dateEnd: string
}

export enum Format {
  NUMBER = 'NUMBER',
  PERCENTAGE = 'PERCENTAGE',
  COIN_BRL = 'COIN_BRL',
  COIN_USD = 'COIN_USD',
  COIN_EUR = 'COIN_EUR',
  COIN_GBP = 'COIN_GBP',
}

export interface Owner {
  name: string
}

export interface Comment {
  text: string
  author: string
  createdAt: string
}

export interface Task {
  description: string
  owner: string
  done: boolean
}

export interface CheckIn {
  comment: string
  author: string
  createdAt: string
  value: number
}

export interface Author {
  id: string
  companyId: string
  teamId: string
}
