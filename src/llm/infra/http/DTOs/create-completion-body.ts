export interface AuthorDTO {
  id: string
  companyId: string
  teamId: string
}

export interface CreateCompletionDTO<T> {
  input: T
  referenceId: string
  author: AuthorDTO
  locale?: string
  suggestions?: boolean
}
