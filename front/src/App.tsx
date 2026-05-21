import { useEffect, useState } from 'react'
import { BarChart2, Link2, TrendingUp, Eye } from 'lucide-react'
import { getAllStats } from './services/statsService'
import type { AllStatsResponse, UrlStat } from './types/stats'
import StatCard from './components/StatCard'
import UrlTable from './components/UrlTable'
import DetailModal from './components/DetailModal'



export default function App() {
  const [data, setData] = useState<AllStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = () => {
    setLoading(true)
    setError(null)
    getAllStats()
      .then(res => {
        setData(res)
        setLastUpdated(new Date())
      })
      .catch(() => setError('No se pudo conectar con la API de estadísticas.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const filtered = (data?.urls ?? []).filter(u =>
    u.shortCode.toLowerCase().includes(search.toLowerCase()) ||
    u.originalUrl.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const totalVisits = (data?.urls ?? []).reduce((acc, u) => acc + u.visits, 0)
  const mostVisited = (data?.urls ?? []).reduce<UrlStat | undefined>((a, b) => !a || b.visits > a.visits ? b : a, undefined)
  const activeUrls = (data?.urls ?? []).filter(u => u.visits > 0).length ?? 0

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <BarChart2 className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">URL Stats</h1>
            </div>
            <p className="text-sm text-gray-500 ml-1">
              {lastUpdated
                ? `Actualizado a las ${lastUpdated.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
                : 'Cargando datos...'}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all cursor-pointer"
          >
            <TrendingUp className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Skeleton o contenido */}
        {loading && !data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Total URLs"
                value={data?.total ?? 0}
                subtitle="registradas en el sistema"
                icon={<Link2 className="w-5 h-5 text-purple-400" />}
                color="bg-purple-500/20"
              />
              <StatCard
                title="Total Visitas"
                value={totalVisits}
                subtitle="entre todas las URLs"
                icon={<Eye className="w-5 h-5 text-blue-400" />}
                color="bg-blue-500/20"
              />
              <StatCard
                title="Más visitada"
                value={mostVisited?.visits ?? 0}
                subtitle={mostVisited?.shortCode ?? '-'}
                icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
                color="bg-emerald-500/20"
              />
            </div>

            {/* Buscador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-sm text-gray-400">
                Mostrando <span className="text-white font-semibold">{filtered.length}</span> de {data?.total ?? 0} URLs
                {' · '}
                <span className="text-emerald-400 font-semibold">{activeUrls}</span> activas
              </p>
              <input
                type="text"
                placeholder="Buscar por código o URL..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-full sm:w-72 transition-colors"
              />
            </div>

            {/* Tabla */}
            <UrlTable urls={filtered} onSelect={setSelectedCode} />
          </>
        )}
      </div>

      {/* Modal */}
      <DetailModal code={selectedCode} onClose={() => setSelectedCode(null)} />
    </div>
  )
}