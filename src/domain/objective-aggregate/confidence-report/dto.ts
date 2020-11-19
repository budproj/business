export class ConfidenceReportDTO {
  id: number
  valuePrevious: number
  valueNew: number
  comment?: string | null
  createdAt: Date
}
