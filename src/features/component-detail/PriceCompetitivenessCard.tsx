import { CircleAlert } from 'lucide-react'
import chevronUp from '../../assets/price-competitiveness/chevron-up.svg'
import gaugeBase from '../../assets/price-competitiveness/gauge-base.svg'
import gaugePoor from '../../assets/price-competitiveness/gauge-poor.svg'

export type PriceCompetitivenessProduct = { id: string; name: string; imageUrl?: string }
export type PriceCompetitivenessState = 'Normal' | 'Cargando' | 'Sin datos' | 'Error' | 'No disponible'

type Props = {
  title?: string
  diagnosis?: string
  affectedCount?: string
  affectedLabel?: string
  benefits?: string[]
  products?: PriceCompetitivenessProduct[]
  showTitle?: boolean
  isNew?: boolean
  state?: PriceCompetitivenessState
  onNavigate: () => void
  onOpenProducts?: () => void
  onRetry?: () => void
}

function CardState({ state, onRetry }: Pick<Props, 'state' | 'onRetry'>) {
  if (state === 'Cargando') return <div className="price-competitiveness-card__state price-competitiveness-card__state--loading" aria-label="Cargando datos"><i /><i /><i /></div>
  const copy = state === 'Sin datos' ? ['Aún no hay datos', 'Cuando haya información, aparecerá aquí.'] : state === 'Error' ? ['No pudimos mostrar estos datos', 'Inténtalo nuevamente.'] : ['Contenido no disponible', 'Este componente no está habilitado para esta cuenta.']
  return <div className="price-competitiveness-card__state"><strong>{copy[0]}</strong><span>{copy[1]}</span>{state === 'Error' && <button type="button" onClick={onRetry}>Reintentar</button>}</div>
}

export function PriceCompetitivenessCard({ title = 'Competitividad de precios', diagnosis = 'Mala', affectedCount = '16 publicaciones', affectedLabel = 'con precio no competitivo', benefits = [], products = [], showTitle = true, isNew = false, state = 'Normal', onNavigate, onOpenProducts, onRetry }: Props) {
  const visibleProducts = products.slice(0, 3)
  const remainingProducts = products.length - visibleProducts.length
  const productAction = onOpenProducts ?? onNavigate

  return <article className="price-competitiveness-card" aria-label={title}>
    {showTitle && <header className="price-competitiveness-card__header"><h3>{title}</h3>{isNew && <span>Nuevo</span>}</header>}
    <div className="price-competitiveness-card__content">
      {state !== 'Normal' ? <CardState state={state} onRetry={onRetry} /> : <>
        <section className="price-competitiveness-card__summary">
          <div className="price-competitiveness-card__gauge" aria-label={`Competitividad de precios: ${diagnosis}`}><img src={gaugeBase} alt="" /><img className="price-competitiveness-card__gauge-progress" src={gaugePoor} alt="" /><strong>{diagnosis}</strong></div>
          <div className="price-competitiveness-card__metric"><div><strong>{affectedCount}</strong><CircleAlert size={12} aria-hidden="true" /></div><span>{affectedLabel}</span></div>
        </section>
        {benefits.length > 0 && <section className="price-competitiveness-card__benefits"><strong>No estás accediendo a estos beneficios</strong><ul>{benefits.map((benefit) => <li key={benefit}><CircleAlert size={12} aria-hidden="true" /><span>{benefit}</span></li>)}</ul></section>}
        {visibleProducts.length > 0 && <section className="price-competitiveness-card__products"><strong>Comienza por las publicaciones no competitivas con más ventas:</strong><button type="button" onClick={productAction} aria-label="Ver publicaciones con precio no competitivo">{visibleProducts.map((product) => <span className="price-competitiveness-card__product" key={product.id}>{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <i aria-hidden="true">{product.name.slice(0, 1)}</i>}<span>{product.name}</span></span>)}{remainingProducts > 0 && <span className="price-competitiveness-card__more">y {remainingProducts} publicación{remainingProducts === 1 ? '' : 'es'} más</span>}</button></section>}
      </>}
    </div>
    <footer className="price-competitiveness-card__footer"><button type="button" onClick={onNavigate}><span>Ir a Publicaciones</span><img src={chevronUp} alt="" /></button></footer>
  </article>
}
