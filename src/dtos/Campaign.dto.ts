export interface CampaignDto {
  id: number
  customerId: number
  status: string
  progress: number
  paused: boolean
  errorLogs: null | string
  createdAt: string
  updatedAt: string
}
