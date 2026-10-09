import { useState } from 'react'
import { ChevronRight, MoreVertical } from 'lucide-react'
import positiveShape from '../../assets/slot-variants/feedbackPositiveShape.svg?raw'
import cautionShape from '../../assets/slot-variants/feedbackCautionShape.svg?raw'
import gaugeBase from '../../assets/my-page/my-page-low.svg?raw'
import gaugeProgress from '../../assets/my-page/my-page-progress.svg?raw'
import gaugePointer from '../../assets/my-page/my-page-pointer.svg?raw'
import sparkleShape from '../../assets/recommendation-card/sparkle.svg?raw'

const svgUrl = (source: string) => `data:image/svg+xml,${encodeURIComponent(source)}`

export type ReferenceState = 'Normal' | 'Cargando' | 'Sin datos' | 'Error' | 'No disponible'
export type FeedbackTone = 'positive' | 'caution' | 'negative'

export function FeedbackIcon({ tone, size = 16 }: { tone: FeedbackTone; size?: number }) {
  return <span className={`reference-feedback reference-feedback--${tone}`} style={{ width: size, height: size }} aria-label={tone === 'positive' ? 'Estado positivo' : tone === 'caution' ? 'Atención' : 'Estado negativo'}><img src={svgUrl(tone === 'positive' ? positiveShape : cautionShape)} alt="" /></span>
}

function CardContentState({ state, onRetry, errorTitle, errorDescription }: { state: ReferenceState; onRetry?: () => void; errorTitle?: string; errorDescription?: string }) {
  if (state === 'Cargando') return <div className="reference-card-state reference-card-state--loading" aria-label="Cargando datos"><span /><span /><span /></div>
  const copy = state === 'Sin datos' ? ['Aún no hay datos', 'Cuando haya información, aparecerá aquí.'] : state === 'Error' ? [errorTitle ?? 'Error al cargar este dato', errorDescription ?? 'No pudimos mostrar la información.'] : ['Contenido no disponible', 'Este componente no está habilitado para esta cuenta.']
  return <div className="reference-card-state"><strong>{copy[0]}</strong>{copy[1] && <span>{copy[1]}</span>}{state === 'Error' && <button type="button" onClick={onRetry}>Reintentar</button>}</div>
}

function ReferenceCard({ title, showTitle = true, state = 'Normal', footer, onNavigate, onRetry, errorTitle, errorDescription, children, className = '' }: { title: string; showTitle?: boolean; state?: ReferenceState; footer: string; onNavigate: () => void; onRetry?: () => void; errorTitle?: string; errorDescription?: string; children: React.ReactNode; className?: string }) {
  return <article className={`reference-card ${className}`} aria-label={title}>
    {showTitle && <header className="reference-card__header"><h3>{title || 'Sin título'}</h3></header>}
    <div className="reference-card__content">{state === 'Normal' ? children : <CardContentState state={state} onRetry={onRetry} errorTitle={errorTitle} errorDescription={errorDescription} />}</div>
    <footer className="reference-card__footer"><button type="button" onClick={onNavigate}><span>{footer}</span><ChevronRight size={20} strokeWidth={2} aria-hidden="true" /></button></footer>
  </article>
}

export type ShippingMetric = { id: string; value: string; label: string; tone: FeedbackTone }

export function ShippingPerformanceCard({ title, metrics, exposure, exposureDescription, exposureTone, showRecommendation = false, showTitle = true, state = 'Normal', onNavigate, onRecommendationNavigate, onHideRecommendation, onRetry }: { title: string; metrics: ShippingMetric[]; exposure: string; exposureDescription: string; exposureTone: FeedbackTone; showRecommendation?: boolean; showTitle?: boolean; state?: ReferenceState; onNavigate: () => void; onRecommendationNavigate?: () => void; onHideRecommendation?: () => void; onRetry?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <ReferenceCard title={title} showTitle={showTitle} state={state} footer="Ir a Métricas de envíos" onNavigate={onNavigate} onRetry={onRetry} className="reference-card--shipping">
    <div className={`shipping-performance__metrics ${metrics.length > 1 ? 'shipping-performance__metrics--split' : ''}`}>
      {metrics.map((metric) => <section className="shipping-performance__metric" key={metric.id}><div><strong>{metric.value}</strong><FeedbackIcon tone={metric.tone} /></div><span>{metric.label}</span></section>)}
    </div>
    <section className="shipping-performance__exposure"><div><strong>{exposure}</strong><i className={`reference-dot reference-dot--${exposureTone}`} aria-label="Estado de exposición" /></div><span>{exposureDescription}</span></section>
    {showRecommendation && <section className="shipping-performance__recommendation"><div><img src={svgUrl(sparkleShape)} alt="" /><strong>Agrega zonas y vendé<br />hasta 15 veces más</strong><button type="button" aria-label="Opciones de recomendación" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreVertical size={16} /></button></div>{menuOpen && <div className="shipping-performance__recommendation-menu"><button type="button" onClick={() => { setMenuOpen(false); onHideRecommendation?.() }}>Ocultar recomendación</button></div>}<p>Puedes crear productos de catálogo a partir de tus publicaciones.</p><button type="button" onClick={onRecommendationNavigate}>Ir a Modificar</button></section>}
  </ReferenceCard>
}

export type FullSpaceMetric = { id: string; percentage: string; label: string; units: string; tone: FeedbackTone }

export function FullSpacesCard({ metrics, showTitle = true, state = 'Normal', onNavigate, onRetry }: { metrics: FullSpaceMetric[]; showTitle?: boolean; state?: ReferenceState; onNavigate: () => void; onRetry?: () => void }) {
  return <ReferenceCard title="Uso de tus espacios en Full" showTitle={showTitle} state={state} footer="Ir a Métricas de Stock Full" onNavigate={onNavigate} onRetry={onRetry} className="reference-card--full">
    {metrics.map((metric) => <section className="full-space-metric" key={metric.id}>
      <div className="full-space-metric__number"><strong>{metric.percentage}</strong><FeedbackIcon tone={metric.tone} /></div>
      <span>{metric.label}</span>
      <div className="full-space-metric__track" role="meter" aria-label={metric.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.max(0, Number.parseFloat(metric.percentage) || 0))}><i className={`full-space-metric__fill full-space-metric__fill--${metric.tone}`} style={{ width: `${Math.min(100, Math.max(0, Number.parseFloat(metric.percentage) || 0))}%` }} /></div>
      <small>{metric.units}</small>
    </section>)}
  </ReferenceCard>
}

export function MyPageCard({ followers, followerStatus, followerDescription, newFollowers, buyers, showRecommendation, showTitle = true, state = 'Normal', onNavigate, onCreateCoupon, onHideRecommendation, onRetry }: { followers: string; followerStatus: string; followerDescription: string; newFollowers: string; buyers: string; showRecommendation: boolean; showTitle?: boolean; state?: ReferenceState; onNavigate: () => void; onCreateCoupon: () => void; onHideRecommendation: () => void; onRetry?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <ReferenceCard title="Mi página" showTitle={showTitle} state={state} footer="Ir a Mi página" onNavigate={onNavigate} onRetry={onRetry} className="reference-card--my-page">
    <div className="my-page__summary"><div className="my-page__gauge" aria-label={`Nivel de seguidores: ${followerStatus}`}>
      {followerStatus === 'Débil' ? <><img src={svgUrl(gaugeBase)} alt="" /><img src={svgUrl(gaugeProgress)} alt="" /><img src={svgUrl(gaugePointer)} alt="" /></> : <svg viewBox="0 0 80 41" aria-hidden="true"><path d="M2 40 A38 38 0 0 1 78 40" fill="none" stroke="#e5e5e5" strokeWidth="4" /><path d="M2 40 A38 38 0 0 1 78 40" fill="none" stroke={followerStatus === 'Fuerte' ? '#00a650' : '#ffb900'} strokeWidth="4" strokeDasharray={followerStatus === 'Fuerte' ? '119 120' : '66 120'} /></svg>}
      <span>{followerStatus}</span></div><div><strong>{followers}</strong><span>{followerDescription}</span></div></div>
    <section className="my-page__recent"><strong>En los últimos 30 días</strong><span><FeedbackIcon tone="caution" size={12} />{newFollowers}</span><span><FeedbackIcon tone="caution" size={12} />{buyers}</span></section>
    {showRecommendation && <section className="my-page__recommendation"><div className="my-page__recommendation-top"><img src={svgUrl(sparkleShape)} alt="" /><strong>Aumenta hasta 2x tu comunidad creando descuentos</strong><button type="button" aria-label="Opciones de recomendación" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreVertical size={16} /></button></div>{menuOpen && <div className="my-page__recommendation-menu"><button type="button" onClick={() => { setMenuOpen(false); onHideRecommendation() }}>Ocultar recomendación</button></div>}<p>Ofrece un cupón exclusivo y convierte visitas en seguidores.</p><button type="button" onClick={onCreateCoupon}>Crear cupón</button></section>}
  </ReferenceCard>
}

export type AdvertisingMetric = { id: string; value: string; label: string; delta: string; trend: 'up' | 'down' }

export function AdvertisingMetricsCard({ metrics, showTitle = true, state = 'Normal', onNavigate, onRetry }: { metrics: AdvertisingMetric[]; showTitle?: boolean; state?: ReferenceState; onNavigate: () => void; onRetry?: () => void }) {
  return <ReferenceCard title="Métricas de publicidad" showTitle={showTitle} state={state} footer="Crear campaña" onNavigate={onNavigate} onRetry={onRetry} errorTitle="No pudimos mostrar estos datos" errorDescription="" className="reference-card--ads">
    {metrics.map((metric) => <section className="advertising-metric" key={metric.id}><div><strong>{metric.value}</strong><span className={`advertising-metric__delta advertising-metric__delta--${metric.trend}`}><i aria-hidden="true">{metric.trend === 'up' ? '▲' : '▼'}</i>{metric.delta}</span></div><small>{metric.label}</small></section>)}
  </ReferenceCard>
}

export type ControlPanelVisibility = { reputation: boolean; logistics: boolean; sales: boolean; money: boolean }

const panelShipping = [
  { name: 'Envíos con colecta', description: 'Exposición excelente', tone: 'positive' as const },
  { name: 'Envíos Flex', description: 'Exposición muy mala', tone: 'negative' as const },
  { name: 'Envíos Turbo', description: 'Distancia ajustable', tone: 'positive' as const },
  { name: 'Envíos ME1', description: 'A mejorar', tone: 'caution' as const },
  { name: 'Envíos Full', description: 'Espacio disponible', tone: 'positive' as const },
]

export function ControlPanelCard({ visible, mobile = false, state = 'Normal', onNavigate, onRetry }: { visible: ControlPanelVisibility; mobile?: boolean; state?: ReferenceState; onNavigate: (label: string) => void; onRetry?: () => void }) {
  if (state !== 'Normal') return <div className="control-panel-preview control-panel-preview--state"><CardContentState state={state} onRetry={onRetry} /></div>
  return <div className={`control-panel-preview ${mobile ? 'control-panel-preview--mobile' : ''}`} aria-label="Panel de control">
    {visible.reputation && <button className="control-panel-preview__segment control-panel-preview__reputation" type="button" onClick={() => onNavigate('Reputación')}><small>Tu reputación</small><strong>MercadoLíder Platinum <FeedbackIcon tone="positive" size={12} /></strong><span>Así te ven tus compradores</span></button>}
    {visible.logistics && <div className="control-panel-preview__segment control-panel-preview__logistics"><small>Desempeño de tus logísticas esta semana</small><div>{panelShipping.map((item) => <button key={item.name} type="button" onClick={() => onNavigate(item.name)}><strong>{item.name} <FeedbackIcon tone={item.tone} size={12} /></strong><span>{item.description}</span></button>)}</div></div>}
    {visible.sales && <button className="control-panel-preview__segment control-panel-preview__sales" type="button" onClick={() => onNavigate('Métricas de negocio')}><small>Ventas brutas</small><strong>$ 500.000 <span className="control-panel-preview__delta">▲ 20%</span></strong><span>Últimos 7 días</span></button>}
    {visible.money && <button className="control-panel-preview__segment control-panel-preview__money" type="button" onClick={() => onNavigate('Mercado Pago')}><small>Tu dinero disponible</small><strong>$ 200.200.000</strong><span>Adelantar $9.999.999</span></button>}
  </div>
}
