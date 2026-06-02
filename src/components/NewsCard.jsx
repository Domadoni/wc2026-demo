// frontend/src/components/NewsCard.jsx
// Article card used in Squad tab (Team News section) and News page.
// Props: source {string}, title {string}, summary {string}, url {string}, publishedAt {string}

export default function NewsCard({ source, title, summary, url, publishedAt }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-[#f1f5f9] rounded-xl p-4 hover:border-[#93c5fd] hover:shadow-md transition-all cursor-pointer no-underline"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#94a3b8] mb-1">
        {source}{publishedAt ? ` · ${publishedAt}` : ''}
      </p>
      <h3
        className="text-[14px] font-bold text-[#0f172a] leading-snug mb-1.5"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h3>
      {summary && (
        <p className="text-[12px] text-[#64748b] leading-relaxed line-clamp-2">
          {summary}
        </p>
      )}
    </a>
  )
}
