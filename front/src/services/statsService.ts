import axios from 'axios'
import type { AllStatsResponse, UrlStatDetail } from '../types/stats'

const API_BASE = import.meta.env.VITE_API_BASE as string

export const getAllStats = async (): Promise<AllStatsResponse> => {
  const { data } = await axios.get<AllStatsResponse>(`${API_BASE}/stats/`)
  console.log('Datos recibidos:', data)
  return data
}

export const getStatByCode = async (code: string): Promise<UrlStatDetail> => {
  const { data } = await axios.get<UrlStatDetail>(`${API_BASE}/stats/${code}`)
  console.log('Datos recibidos para el código ${code}:', data) 
  return data
}