import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { TasksCard, type PublicationTaskGroup } from '../component-detail/PublicationTasksCard'
import { ReputationCard } from '../component-detail/ReputationCard'
import { NewsCard } from '../component-detail/NewsCard'
import { BusinessMetricsCard } from '../component-detail/BusinessMetricsCard'
import { MoneyCard } from '../component-detail/MoneyCard'
import { BillingCard } from '../component-detail/BillingCard'
import { CreditScoringCard } from '../component-detail/CreditScoringCard'
import { AdvertisingMetricsCard, ControlPanelCard, FullSpacesCard, MyPageCard, ShippingPerformanceCard } from '../component-detail/RemainingCards'
import { templateColumns, type TemplatePlacement } from './summary-template-layout'
import './summary-template.css'

type TemplateCardId = (typeof templateColumns)[number][number]['id']

type SummaryTemplatePreviewProps = {
  candidate?: ReactNode
  placement?: TemplatePlacement
  compact?: boolean
  highlightedCardId?: TemplateCardId
  fitToWidth?: boolean
  referenceCards?: Partial<Record<TemplateCardId, ReactNode>>
}

const noop = () => undefined
const publicationGroups: PublicationTaskGroup[] = [
  { id: 'questions', title: 'Preguntas', value: '15', description: 'Por responder', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'publications', title: 'Publicaciones', value: '+999', description: 'Por mejorar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'products-full', title: 'Productos Full', value: '4', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'prices', title: 'Precios', value: '4', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'advertising', title: 'Publicidad', value: '20', description: 'Sugerencias', hasNavigation: true, tasks: [] },
]
const salesGroups: PublicationTaskGroup[] = [
  { id: 'shipping-today', title: 'Envíos de hoy', value: '15', description: 'Por despachar', hasNavigation: true, tasks: [] },
  { id: 'post-sales', title: 'Posventa', value: '4', description: 'Por atender', hasNavigation: true, tasks: [] },
]

function ReferenceTemplateCard({ id }: { id: TemplateCardId }) {
  switch (id) {
    case 'publication-tasks': return <TasksCard title="Pendientes en tus publicaciones" groups={publicationGroups} showTitle compact={false} onNavigate={noop} onRetry={noop} />
    case 'sales-tasks': return <TasksCard title="Pendientes en tus ventas" groups={salesGroups} showTitle compact={false} onNavigate={noop} onRetry={noop} />
    case 'full': return <FullSpacesCard metrics={[{ id: 'small', percentage: '150%', label: 'Pequeños y medianos', units: '1980 u. de 2000 u.', tone: 'negative' }, { id: 'large', percentage: '150%', label: 'Grandes y extragrandes', units: '1980 u. de 2000 u.', tone: 'negative' }]} onNavigate={noop} />
    case 'shipping-flex': return <ShippingPerformanceCard title="Envíos Flex" metrics={[{ id: 'current', value: '94%', label: 'Semana actual', tone: 'caution' }]} exposure="Regular, sin destaque" exposureDescription="Exposición prevista la próxima semana" exposureTone="caution" onNavigate={noop} />
    case 'shipping-collect': return <ShippingPerformanceCard title="Envíos con colecta" metrics={[{ id: 'current', value: '97%', label: 'Semana actual', tone: 'positive' }, { id: 'recent', value: '97%', label: 'Últimas 4 semanas', tone: 'positive' }]} exposure="Excelente, con destaque" exposureDescription="Exposición prevista la próxima semana" exposureTone="positive" onNavigate={noop} />
    case 'shipping-turbo': return <article className="template-context__simple-card"><header>Envíos Turbo</header><div><strong>97% <span className="template-context__positive">●</span></strong><small>Último día de entregas</small></div><footer>Ir a Métricas de envíos <span aria-hidden="true">›</span></footer></article>
    case 'billing': return <BillingCard title="Facturación" balance="$ 15.000" balanceLabel="Saldo del periodo" pendingPeriod="Tienes 1 período cerrado por pagar" dueDate="Vence el 23 jun 2021." showTitle onNavigate={noop} />
    case 'my-page': return <MyPageCard followers="10 seguidores" followerStatus="Débil" followerDescription="No tienes suficientes seguidores" newFollowers="2 seguidores nuevos" buyers="0 seguidores te compraron" showRecommendation onNavigate={noop} onCreateCoupon={noop} onHideRecommendation={noop} />
    case 'reputation': return <ReputationCard title="Reputación" status="Verde" metrics={[{ id: 'claims', value: '0,9%', label: 'Reclamos', tone: 'orange' }, { id: 'cancelled', value: '0%', label: 'Canceladas por ti', tone: 'green' }, { id: 'mediations', value: '0%', label: 'Mediaciones', tone: 'green' }, { id: 'delayed', value: '2%', label: 'Demoradas', tone: 'green' }]} showTitle onNavigate={noop} />
    case 'business-metrics': return <BusinessMetricsCard title="Métricas de negocio" amount="$ 500.000" delta="20%" description="Ventas brutas en los últimos 7 días" upperLimit="$ 555 mil" lowerLimit="$ 500 mil" showTitle onNavigate={noop} />
    case 'money': return <MoneyCard title="Tu dinero disponible" availableAmount="$ 200.200.000" availableLabel="Disponible" transferLabel="Transferir dinero" accountAmount="$ 100.200.000" accountLabel="En cuenta" showTitle onTransfer={noop} onNavigate={noop} />
    case 'recommendations': return <article className="template-context__simple-card template-context__recommendations"><header>Recomendaciones</header><div><strong>✦ Agrega zonas y vendé hasta 15 veces más</strong><p>Puedes crear productos de catálogo a partir de tus publicaciones.</p><span>Ir a Modificar</span></div></article>
    case 'news': return <NewsCard title="Novedades" showTitle showFeatured items={[{ id: 'ads', text: 'Te regalamos $ 100.000 para promocionar tu página con Display Ads' }, { id: 'flex', text: 'Redujimos tu máximo de Envíos Flex para ayudarte a entregar a tiempo.' }]} onNavigate={noop} />
    case 'credits-scoring': return <CreditScoringCard title="Créditos para tu negocio" score="399" description="Mantener un buen score te ayuda a tener crédito." infoLink="Revisar mi score" recommendation="¡Invierte en tu negocio! Pide hasta $10.000.000 y devuélvelo en 12 cuotas" recommendationAction="Ir a Modificar" footer="Ir a Créditos" onInfoLink={noop} onRecommendationAction={noop} onHideRecommendation={noop} onNavigate={noop} />
    case 'advertising-metrics': return <AdvertisingMetricsCard metrics={[{ id: 'sales', value: '784', label: 'Ventas por publicidad', delta: '23%', trend: 'up' }, { id: 'clicks', value: '1.346', label: 'Clics recibidos', delta: '17%', trend: 'down' }]} onNavigate={noop} />
    default: return null
  }
}

export function SummaryTemplatePreview({ candidate, placement, compact = false, highlightedCardId, fitToWidth = false, referenceCards }: SummaryTemplatePreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!fitToWidth || !viewport) return
    const resize = () => setScale(Math.min(1, viewport.clientWidth / 1280))
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [fitToWidth])

  useEffect(() => {
    if (compact || fitToWidth || !placement) return
    const viewport = viewportRef.current
    const card = viewport?.querySelector<HTMLElement>('[data-template-candidate]')
    if (!viewport || !card) return
    const viewportBounds = viewport.getBoundingClientRect()
    const cardBounds = card.getBoundingClientRect()
    viewport.scrollLeft += cardBounds.left + cardBounds.width / 2 - viewportBounds.left - viewportBounds.width / 2
  }, [compact, fitToWidth, placement])
  const candidateCard = candidate && placement ? <div className="template-context__candidate" data-template-candidate="true"><span className="template-context__candidate-label">Card nueva</span>{candidate}</div> : null
  return <section className={`template-context${compact ? ' template-context--compact' : ''}${highlightedCardId ? ' template-context--highlighted' : ''}${fitToWidth ? ' template-context--fit' : ''}`} aria-label="Template desktop de Summary con todas las cards">
    <div className="template-context__viewport" ref={viewportRef}>
      <div className="template-context__page" style={fitToWidth ? { zoom: scale } : undefined}>
        <div className="template-context__site-header"><strong>Central de vendedores</strong><span>Busca tus productos o ventas por título, SKU o #</span><small>Usuario · Publicar</small></div>
        <div className="template-context__site-nav">Resumen <span>Publicaciones</span><span>Ventas</span></div>
        <div className="template-context__summary">
          <h3>Resumen</h3>
          <ControlPanelCard visible={{ reputation: true, logistics: true, sales: true, money: true }} onNavigate={noop} />
          <div className="template-context__tabs"><strong>▦&nbsp; Resumen principal</strong><span>✦&nbsp; Recomendaciones</span><span>＋ Crear vista</span></div>
          <div className="template-context__grid">
            {templateColumns.map((column, index) => <div className="template-context__column" key={index} aria-label={`Columna ${index + 1}`}>
              {placement?.column === index && placement.after === null && candidateCard}
              {column.map((card) => <Fragment key={card.id}>
                <div className={`template-context__reference${highlightedCardId === card.id ? ' template-context__reference--highlighted' : ''}`} data-template-card={card.id} data-template-highlighted={highlightedCardId === card.id || undefined} aria-label={highlightedCardId === card.id ? `${card.label}, card resaltada en el template` : undefined}>
                  {referenceCards?.[card.id] ?? <ReferenceTemplateCard id={card.id} />}
                </div>
                {placement?.column === index && placement.after === card.id && candidateCard}
              </Fragment>)}
            </div>)}
          </div>
        </div>
      </div>
    </div>
  </section>
}
