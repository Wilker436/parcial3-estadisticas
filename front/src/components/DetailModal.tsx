import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getStatByCode } from '../services/statsService'
import type { UrlStatDetail } from '../types/stats'

const BASE_URL = import.meta.env.VITE_BASE_URL as string

interface DetailModalProps {
    code: string | null
    onClose: () => void
}

export default function DetailModal({ code, onClose }: DetailModalProps) {
    const [detail, setDetail] = useState<UrlStatDetail | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!code) return
        setLoading(true)
        setDetail(null)
        getStatByCode(code)
            .then(setDetail)
            .finally(() => setLoading(false))
    }, [code])

    if (!code) return null

    // Agrupar visitDates por fecha para la gráfica
    const chartData = detail
        ? Object.entries(
            detail.visitDates.reduce<Record<string, number>>((acc, date) => {
                const day = new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
                acc[day] = (acc[day] || 0) + 1
                return acc
            }, {})
        ).map(([fecha, visitas]) => ({ fecha, visitas }))
        : []

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-white">Detalle de URL</h2>
                        <p className="text-sm text-purple-400 font-mono mt-1">{code}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors text-xl leading-none cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {detail && !loading && (
                    <div className="space-y-5">

                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">URL Original</p>
                            <a
                                href={detail.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 break-all transition-colors"
                            >
                                {detail.originalUrl}
                            </a>

                            <a
                                href={`${BASE_URL}/${detail.shortCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 text-xs rounded-lg transition-all"
                            >
                                <span>🔗</span>
                                {BASE_URL}/{detail.shortCode}
                            </a>
                        </div>




                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-400">{detail.totalVisits}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Visitas</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-sm font-semibold text-white">
                                    {new Date(detail.createdAt).toLocaleDateString('es-CO', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Fecha de creación</p>
                            </div>
                        </div>


                        {chartData.length > 0 ? (
                            <div>
                                <p className="text-xs text-gray-500 mb-3">Visitas por día</p>
                                <ResponsiveContainer width="100%" height={140}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="fecha" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                                            labelStyle={{ color: '#a855f7' }}
                                        />
                                        <Area type="monotone" dataKey="visitas" stroke="#a855f7" strokeWidth={2} fill="url(#colorVisitas)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-500">Sin visitas registradas aún</p>
                            </div>
                        )}


                        {detail.visitDates.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Últimas visitas</p>
                                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                                    {[...detail.visitDates].reverse().slice(0, 5).map((date, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                            {new Date(date).toLocaleString('es-CO', {
                                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
                }
            </div >
        </div >
    )
}