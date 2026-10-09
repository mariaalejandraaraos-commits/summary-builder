import { CheckCircle2, ChevronRight } from 'lucide-react'

export type ReputationMetric = {
  id: string
  value: string
  label: string
  tone: 'green' | 'orange'
}

type ReputationCardProps = {
  title: string
  status: string
  metrics: ReputationMetric[]
  showTitle: boolean
  onNavigate: () => void
}

export function ReputationCard({ title, status, metrics, showTitle, onNavigate }: ReputationCardProps) {
  return (
    <article className="reputation-card" aria-label={title}>
      {showTitle && <header className="reputation-card__header"><h3>{title || 'Sin título'}</h3></header>}
      <div className="reputation-card__content">
        <section className="reputation-card__summary" aria-label={`Estado de reputación: ${status}`}>
          <div className="reputation-card__status"><strong>{status}</strong><CheckCircle2 aria-hidden="true" size={16} strokeWidth={2.5} /></div>
          <div className="reputation-card__scale" aria-label="Escala de reputación de cinco niveles"><span /><span /><span /><span /><span className="reputation-card__scale-active" /></div>
        </section>
        <div className="reputation-card__metrics">
          {metrics.map((metric) => <div className="reputation-card__metric" key={metric.id}><div><strong>{metric.value}</strong><span className={`reputation-card__dot reputation-card__dot--${metric.tone}`} aria-hidden="true" /></div><small>{metric.label}</small></div>)}
        </div>
      </div>
      <footer className="reputation-card__footer"><button type="button" onClick={onNavigate}><span>Ir a Reputación</span><ChevronRight aria-hidden="true" size={20} strokeWidth={2} /></button></footer>
    </article>
  )
}
