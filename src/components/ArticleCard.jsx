function relativeTime(isoStr) {
  if (!isoStr) return ''
  try {
    const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(isoStr).toLocaleDateString()
  } catch {
    return ''
  }
}

export default function ArticleCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-emerald-600 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-xs font-medium text-emerald-400 truncate">{article.source}</span>
        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
          {relativeTime(article.published_iso)}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-100 group-hover:text-emerald-300 leading-snug line-clamp-2">
        {article.title}
      </p>
      {article.summary && (
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{article.summary}</p>
      )}
    </a>
  )
}
