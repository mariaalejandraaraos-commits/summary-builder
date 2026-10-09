import { ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react'

export type NewsItem = {
  id: string
  text: string
}

type NewsCardProps = {
  title: string
  showTitle: boolean
  showFeatured: boolean
  items: NewsItem[]
  onNavigate: (label: string) => void
}

export function NewsCard({
  title,
  showTitle,
  showFeatured,
  items,
  onNavigate,
}: NewsCardProps) {
  return (
    <article className="news-card-preview" aria-label={title}>
      {showTitle && <header className="news-card-preview__header"><h3>{title || 'Sin título'}</h3></header>}
      <div className="news-card-preview__content">
        {showFeatured && (
          <section className="news-card-preview__featured" aria-label="Novedad destacada">
            <div className="news-card-preview__featured-topline">
              <span>NOVEDAD</span>
            </div>
            <div className="news-card-preview__illustration" aria-hidden="true">
              <div className="news-card-preview__illustration-photo"><ImageIcon size={31} strokeWidth={1.6} /><i /></div>
              <div className="news-card-preview__illustration-spark"><Sparkles size={24} strokeWidth={1.7} /></div>
              <span className="news-card-preview__illustration-chip">Editor de fotos</span>
            </div>
            <div className="news-card-preview__featured-copy">
              <strong>Explora las herramientas de nuestro editor y transforma imágenes.</strong>
              <p>Usaremos inteligencia artificial para transformar tus imágenes y aumentar las ventas de forma automática, garantizando resultados efectivos.</p>
              <button type="button" onClick={() => onNavigate('el editor de imágenes')}>Conocer más</button>
            </div>
          </section>
        )}
        <div className="news-card-preview__items">
          {items.map((item) => (
            <button type="button" className="news-card-preview__item" key={item.id} onClick={() => onNavigate(item.text)}>
              <span>{item.text}</span>
              <ChevronRight aria-hidden="true" size={20} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
      <footer className="news-card-preview__footer"><button type="button" onClick={() => onNavigate('Novedades')}><span>Ir a Novedades</span><ChevronRight aria-hidden="true" size={20} strokeWidth={2} /></button></footer>
    </article>
  )
}
