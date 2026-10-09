import type { LucideIcon } from 'lucide-react'
import {
  BadgeDollarSign,
  BarChart3,
  Boxes,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  PackageCheck,
  ReceiptText,
  Star,
  Store,
  Truck,
  WalletCards,
  Zap,
} from 'lucide-react'
import { TasksCard, type PublicationTaskGroup } from '../component-detail/PublicationTasksCard'
import { ReputationCard, type ReputationMetric } from '../component-detail/ReputationCard'
import { NewsCard, type NewsItem } from '../component-detail/NewsCard'
import { BusinessMetricsCard } from '../component-detail/BusinessMetricsCard'
import { MoneyCard } from '../component-detail/MoneyCard'
import { BillingCard } from '../component-detail/BillingCard'
import { CreditScoringCard } from '../component-detail/CreditScoringCard'
import { AdvertisingMetricsCard, ControlPanelCard, FullSpacesCard, MyPageCard, ShippingPerformanceCard, type AdvertisingMetric, type FullSpaceMetric, type ShippingMetric } from '../component-detail/RemainingCards'

type PreviewKind = 'tasks-publication' | 'tasks-sales' | 'reputation' | 'news' | 'metric' | 'money' | 'billing' | 'shipping' | 'inventory' | 'prices' | 'store' | 'ads' | 'score' | 'dashboard'
type PreviewTone = 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan'

type PreviewConfig = {
  icon: LucideIcon
  kind: PreviewKind
  label: string
  tone: PreviewTone
}

const previews: Record<string, PreviewConfig> = {
  'publication-tasks': { icon: ClipboardCheck, kind: 'tasks-publication', label: 'Tareas', tone: 'blue' },
  'sales-tasks': { icon: PackageCheck, kind: 'tasks-sales', label: 'Operación', tone: 'cyan' },
  reputation: { icon: Star, kind: 'reputation', label: 'Reputación', tone: 'green' },
  news: { icon: Newspaper, kind: 'news', label: 'Contenido', tone: 'purple' },
  'business-metrics': { icon: BarChart3, kind: 'metric', label: 'Performance', tone: 'blue' },
  money: { icon: WalletCards, kind: 'money', label: 'Finanzas', tone: 'green' },
  billing: { icon: ReceiptText, kind: 'billing', label: 'Facturación', tone: 'purple' },
  'shipping-collect': { icon: Truck, kind: 'shipping', label: 'Colecta', tone: 'orange' },
  'shipping-flex': { icon: Truck, kind: 'shipping', label: 'Flex', tone: 'blue' },
  full: { icon: Boxes, kind: 'inventory', label: 'Stock', tone: 'cyan' },
  'price-competitiveness': { icon: BadgeDollarSign, kind: 'prices', label: 'Precios', tone: 'yellow' },
  'my-page': { icon: Store, kind: 'store', label: 'Presencia', tone: 'purple' },
  'advertising-metrics': { icon: Megaphone, kind: 'ads', label: 'Publicidad', tone: 'blue' },
  'credits-scoring': { icon: Gauge, kind: 'score', label: 'Scoring', tone: 'green' },
  'shipping-turbo': { icon: Zap, kind: 'shipping', label: 'Turbo', tone: 'yellow' },
  'control-panel': { icon: LayoutDashboard, kind: 'dashboard', label: 'Gestión', tone: 'orange' },
}

const publicationPreviewGroups: PublicationTaskGroup[] = [
  { id: 'preview-questions', title: 'Preguntas', value: '15', description: 'Por responder', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'preview-publications', title: 'Publicaciones', value: '+999', description: 'Por mejorar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
]

const salesPreviewGroups: PublicationTaskGroup[] = [
  { id: 'preview-shipping', title: 'Envíos de hoy', value: '15', description: 'Por despachar', hasNavigation: true, tasks: [] },
  { id: 'preview-post-sales', title: 'Posventa', value: '4', description: 'Por atender', hasNavigation: true, tasks: [] },
]

const reputationPreviewMetrics: ReputationMetric[] = [
  { id: 'preview-claims', value: '0,9%', label: 'Reclamos', tone: 'orange' },
  { id: 'preview-cancelled', value: '0%', label: 'Canceladas por ti', tone: 'green' },
  { id: 'preview-mediations', value: '0%', label: 'Mediaciones', tone: 'green' },
  { id: 'preview-delayed', value: '2%', label: 'Demoradas', tone: 'green' },
]

const newsPreviewItems: NewsItem[] = [
  { id: 'preview-display-ads', text: 'Te regalamos $ 100.000 para promocionar tu página con Display Ads' },
  { id: 'preview-flex-limit', text: 'Redujimos tu máximo de Envíos Flex para ayudarte a entregar a tiempo.' },
]

function RealTasksPreview({ sales }: { sales: boolean }) {
  const groups = sales ? salesPreviewGroups : publicationPreviewGroups
  const title = sales ? 'Pendientes en tus ventas' : 'Pendientes en tus publicaciones'
  return <div className={`catalog-real-component catalog-real-component--${sales ? 'sales' : 'publications'}`}><TasksCard title={title} groups={groups} showTitle compact={false} onNavigate={() => undefined} onRetry={() => undefined} /></div>
}

function RealReputationPreview() {
  return <div className="catalog-real-component catalog-real-component--reputation"><ReputationCard title="Reputación" status="Verde" metrics={reputationPreviewMetrics} showTitle onNavigate={() => undefined} /></div>
}

function RealNewsPreview() {
  return <div className="catalog-real-component catalog-real-component--news"><NewsCard title="Novedades" showTitle showFeatured={false} items={newsPreviewItems} onNavigate={() => undefined} /></div>
}

function RealBusinessMetricsPreview() {
  return <div className="catalog-real-component catalog-real-component--business-metrics"><BusinessMetricsCard title="Métricas de negocio" amount="$ 500.000" delta="20%" description="Ventas brutas en los últimos 7 días" upperLimit="$ 555 mil" lowerLimit="$ 500 mil" showTitle onNavigate={() => undefined} /></div>
}

function RealMoneyPreview() {
  return <div className="catalog-real-component catalog-real-component--money"><MoneyCard title="Tu dinero disponible" availableAmount="$ 200.200.000" availableLabel="Disponible" transferLabel="Transferir dinero" accountAmount="$ 100.200.000" accountLabel="En cuenta" showTitle onTransfer={() => undefined} onNavigate={() => undefined} /></div>
}

function RealBillingPreview() {
  return <div className="catalog-real-component catalog-real-component--billing"><BillingCard title="Facturación" balance="$ 15.000" balanceLabel="Saldo del periodo" pendingPeriod="Tienes 1 período cerrado por pagar" dueDate="Vence el 23 jun 2021." showTitle onNavigate={() => undefined} /></div>
}

function RealCreditScoringPreview() {
  const noAction = () => undefined
  return <div className="catalog-real-component catalog-real-component--credits-scoring"><CreditScoringCard title="Empréstimos para seu negócio" score="399" description="Um bom score é o que pode te ajudar a ter crédito." infoLink="Text link" recommendation="Conecte dados de outros bancos e melhore seu score." recommendationAction="Conectar bancos" footer="Ir para Empréstimos" onInfoLink={noAction} onRecommendationAction={noAction} onHideRecommendation={noAction} onNavigate={noAction} /></div>
}

const collectMetrics: ShippingMetric[] = [{ id: 'current', value: '97%', label: 'Semana actual', tone: 'positive' }, { id: 'recent', value: '97%', label: 'Últimas 4 semanas', tone: 'positive' }]
const flexMetrics: ShippingMetric[] = [{ id: 'current', value: '94%', label: 'Semana actual', tone: 'caution' }]
const fullMetrics: FullSpaceMetric[] = [{ id: 'small', percentage: '150%', label: 'Pequeños y medianos', units: '1980 u. de 2000 u.', tone: 'negative' }, { id: 'large', percentage: '150%', label: 'Grandes y extragrandes', units: '1980 u. de 2000 u.', tone: 'negative' }]
const advertisingMetrics: AdvertisingMetric[] = [{ id: 'sales', value: '784', label: 'Ventas por publicidad', delta: '23%', trend: 'up' }, { id: 'clicks', value: '1.346', label: 'Clics recibidos', delta: '17%', trend: 'down' }]

function RealRemainingPreview({ componentId }: { componentId: string }) {
  const noAction = () => undefined
  let card
  if (componentId === 'shipping-collect') card = <ShippingPerformanceCard title="Envíos con colecta" metrics={collectMetrics} exposure="Excelente, con destaque" exposureTone="positive" exposureDescription="Exposición prevista la próxima semana" onNavigate={noAction} />
  else if (componentId === 'shipping-flex') card = <ShippingPerformanceCard title="Envíos Flex" metrics={flexMetrics} exposure="Regular, sin destaque" exposureTone="caution" exposureDescription="Exposición prevista la próxima semana" onNavigate={noAction} />
  else if (componentId === 'full') card = <FullSpacesCard metrics={fullMetrics} onNavigate={noAction} />
  else if (componentId === 'my-page') card = <MyPageCard followers="10 seguidores" followerStatus="Débil" followerDescription="No tienes suficientes seguidores" newFollowers="2 seguidores nuevos" buyers="0 seguidores te compraron" showRecommendation onNavigate={noAction} onCreateCoupon={noAction} onHideRecommendation={noAction} />
  else if (componentId === 'advertising-metrics') card = <AdvertisingMetricsCard metrics={advertisingMetrics} onNavigate={noAction} />
  else card = <ControlPanelCard visible={{ reputation: true, logistics: true, sales: true, money: true }} onNavigate={noAction} />
  return <div className={`catalog-real-component catalog-real-component--${componentId}`}>{card}</div>
}

function TaskPreview({ sales }: { sales: boolean }) {
  const cards = sales
    ? [{ title: 'Posventa', value: '4' }, { title: 'Envíos de hoy', value: '14' }]
    : [{ title: 'Preguntas', value: '15' }, { title: 'Publicaciones', value: '+999' }]

  return <div className="catalog-mini-tasks">{cards.map((card, index) => <div className="catalog-mini-task" key={card.title}><span>{card.title}<i className={index === 0 ? 'is-alert' : ''} /></span><strong>{card.value}</strong><small>{sales ? 'Por gestionar' : 'Por mejorar'}</small></div>)}</div>
}

function MetricPreview({ ads = false }: { ads?: boolean }) {
  return <div className="catalog-mini-metric"><div><small>{ads ? 'Ventas por publicidad' : 'Ventas últimos 30 días'}</small><strong>{ads ? '$ 84.2k' : '$ 2.5M'}</strong><span>↗ 12,4%</span></div><div className="catalog-mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /></div></div>
}

function ShippingPreview() {
  return <div className="catalog-mini-shipping"><div className="catalog-mini-route"><i /><span /><i /><span /><i /></div><div className="catalog-mini-shipping-copy"><strong>12 envíos</strong><small>Listos para despachar</small></div></div>
}

function PreviewGraphic({ kind }: { kind: PreviewKind }) {
  if (kind === 'tasks-publication') return <TaskPreview sales={false} />
  if (kind === 'tasks-sales') return <TaskPreview sales />
  if (kind === 'metric') return <MetricPreview />
  if (kind === 'ads') return <MetricPreview ads />
  if (kind === 'shipping') return <ShippingPreview />

  if (kind === 'reputation') return <div className="catalog-mini-reputation"><div><strong>MercadoLíder</strong><small>Tu reputación está en verde</small></div><div className="catalog-mini-thermometer"><i /><i /><i /><i /><i /></div></div>
  if (kind === 'news') return <div className="catalog-mini-news"><div><span>NUEVO</span><strong>Potenciá tu negocio</strong><small>Conocé las novedades</small></div><div><span>TIP</span><strong>Vendé más</strong><small>Consejos para crecer</small></div></div>
  if (kind === 'money') return <div className="catalog-mini-money"><small>Dinero disponible</small><strong>$ 1.250.000</strong><div className="catalog-mini-spark"><i /><i /><i /><i /><i /><i /></div></div>
  if (kind === 'billing') return <div className="catalog-mini-billing"><div><span>Próximo vencimiento</span><strong>28 SEP</strong></div><i /><i /><i /></div>
  if (kind === 'inventory') return <div className="catalog-mini-inventory"><div><i /><i /><i /></div><div><i /><i /><i /></div><span><strong>92%</strong> de stock saludable</span></div>
  if (kind === 'prices') return <div className="catalog-mini-prices"><div><span>Tu precio</span><strong>$ 24.990</strong></div><div><span>Competencia</span><strong>$ 26.500</strong></div><small>Precio competitivo</small></div>
  if (kind === 'store') return <div className="catalog-mini-store"><div className="catalog-mini-store__bar"><i /><span /><span /></div><div className="catalog-mini-store__hero"><strong>Tu marca</strong><small>Productos destacados</small></div><div className="catalog-mini-store__items"><i /><i /><i /></div></div>
  if (kind === 'score') return <div className="catalog-mini-score"><div><strong>780</strong><span>Muy bueno</span></div><p>Crédito disponible<small>$ 850.000</small></p></div>
  return <div className="catalog-mini-dashboard"><div><small>Ventas</small><strong>+18%</strong></div><div><small>Visitas</small><strong>24k</strong></div><div><small>Conversión</small><strong>3,8%</strong></div><div><small>Pendientes</small><strong>6</strong></div></div>
}

export function ComponentPreview({ componentId }: { componentId: string }) {
  const config = previews[componentId] ?? previews['control-panel']
  const Icon = config.icon

  if (componentId === 'publication-tasks') return <div className="component-preview component-preview--real" aria-hidden="true"><RealTasksPreview sales={false} /></div>
  if (componentId === 'sales-tasks') return <div className="component-preview component-preview--real" aria-hidden="true"><RealTasksPreview sales /></div>
  if (componentId === 'reputation') return <div className="component-preview component-preview--real" aria-hidden="true"><RealReputationPreview /></div>
  if (componentId === 'news') return <div className="component-preview component-preview--real" aria-hidden="true"><RealNewsPreview /></div>
  if (componentId === 'business-metrics') return <div className="component-preview component-preview--real" aria-hidden="true"><RealBusinessMetricsPreview /></div>
  if (componentId === 'money') return <div className="component-preview component-preview--real" aria-hidden="true"><RealMoneyPreview /></div>
  if (componentId === 'billing') return <div className="component-preview component-preview--real" aria-hidden="true"><RealBillingPreview /></div>
  if (componentId === 'credits-scoring') return <div className="component-preview component-preview--real" aria-hidden="true"><RealCreditScoringPreview /></div>
  if (['shipping-collect', 'shipping-flex', 'full', 'my-page', 'advertising-metrics', 'control-panel'].includes(componentId)) return <div className="component-preview component-preview--real" aria-hidden="true"><RealRemainingPreview componentId={componentId} /></div>

  return (
    <div className={`component-preview component-preview--${config.tone}`} aria-hidden="true">
      <div className="component-preview__topline"><span className="component-preview__icon"><Icon size={15} strokeWidth={2} /></span><small>{config.label}</small><span className="component-preview__live">Vista previa</span></div>
      <div className="component-preview__surface"><PreviewGraphic kind={config.kind} /></div>
    </div>
  )
}
