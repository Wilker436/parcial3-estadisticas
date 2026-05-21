export interface UrlStat {
  shortCode: string
  originalUrl: string
  visits: number
  createdAt: string
}

export interface AllStatsResponse {
  total: number
  urls: UrlStat[]
}

export interface UrlStatDetail {
  shortCode: string
  originalUrl: string
  createdAt: string
  visits: number
  totalVisits: number
  visitDates: string[]
}