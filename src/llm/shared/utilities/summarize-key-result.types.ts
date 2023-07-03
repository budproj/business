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
