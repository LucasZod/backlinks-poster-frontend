import { BacklinksDto } from './Backlinks.dto'
import { CampaignDto } from './Campaign.dto'

export interface CustomerDto {
  id: number
  name: string
  cpfCnpj: string
  backlinks: BacklinksDto[]
  keyWords: string[]
  campaigns: CampaignDto[]
}
