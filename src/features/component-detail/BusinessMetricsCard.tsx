import { ChevronRight } from 'lucide-react'
import deltaUpSvg from '../../assets/metrics-business/delta-up.svg?raw'
import chartGridSvg from '../../assets/metrics-business/chart-grid.svg?raw'
import chartAreaSvg from '../../assets/metrics-business/chart-area-fill.svg?raw'

const svgDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

const deltaUpImage = svgDataUri(deltaUpSvg)
const chartGridImage = svgDataUri(chartGridSvg)
const chartAreaImage = svgDataUri(chartAreaSvg)

type BusinessMetricsCardProps = {
  title: string
  amount: string
  delta: string
  description: string
  upperLimit: string
  lowerLimit: string
  showTitle: boolean
  onNavigate: () => void
}

export function BusinessMetricsCard({
  title,
  amount,
  delta,
  description,
  upperLimit,
  lowerLimit,
  showTitle,
  onNavigate,
}: BusinessMetricsCardProps) {
  return (
    <article className="business-metrics-card" aria-label={title}>
      {showTitle && <header className="business-metrics-card__header"><h3>{title || 'Sin título'}</h3></header>}
      <div className="business-metrics-card__content">
        <section className="business-metrics-card__summary">
          <div className="business-metrics-card__amount-row">
            <strong>{amount || '$ 0'}</strong>
            <span className="business-metrics-card__delta"><img src={deltaUpImage} alt="" />{delta || '0%'}</span>
          </div>
          <p>{description || 'Ventas brutas en los últimos 7 días'}</p>
        </section>
        <section className="business-metrics-card__chart" aria-label="Evolución de ventas entre el 22 y el 29 de septiembre">
          <div className="business-metrics-card__axis"><span>{upperLimit || '$ 555 mil'}</span><span>{lowerLimit || '$ 500 mil'}</span></div>
          <div className="business-metrics-card__plot">
            <div className="business-metrics-card__plot-area">
              <img className="business-metrics-card__grid" src={chartGridImage} alt="" />
              <img className="business-metrics-card__area" src={chartAreaImage} alt="" />
            </div>
            <div className="business-metrics-card__dates"><span>22 sep.</span><span>29 sep.</span></div>
          </div>
        </section>
      </div>
      <footer className="business-metrics-card__footer"><button type="button" onClick={onNavigate}><span>Ir a Métricas de negocio</span><ChevronRight aria-hidden="true" size={20} strokeWidth={2} /></button></footer>
    </article>
  )
}
