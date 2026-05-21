import type { UrlStat } from '../types/stats'

interface UrlTableProps {
  urls: UrlStat[]
  onSelect: (code: string) => void
}

export default function UrlTable({ urls, onSelect }: UrlTableProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-left">
              <th className="px-6 py-4 font-medium">Código</th>
              <th className="px-6 py-4 font-medium">URL Original</th>
              <th className="px-6 py-4 font-medium">Visitas</th>
              <th className="px-6 py-4 font-medium">Creado</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, i) => (
              <tr
                key={url.shortCode}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-purple-400 font-semibold">{url.shortCode}</span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <span className="text-gray-300 truncate block" title={url.originalUrl}>
                    {url.originalUrl}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 font-semibold ${url.visits > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {url.visits}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(url.createdAt).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelect(url.shortCode)}
                    className="text-xs text-purple-400 hover:text-purple-300 border border-purple-400/30 hover:border-purple-300/50 px-3 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}