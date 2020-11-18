export interface IConfidenceReport {
  id: number
  valuePrevious: number
  valueNew: number
  comment?: string | null
  createdAt: Date
}
