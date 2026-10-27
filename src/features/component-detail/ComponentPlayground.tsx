import { useState } from 'react'
import type { SummaryComponent } from '../../domain/summary-builder'
import { TasksCard, type PublicationTaskGroup } from './PublicationTasksCard'
import { ReputationCard, type ReputationMetric } from './ReputationCard'
import { NewsCard, type NewsItem } from './NewsCard'
import { BusinessMetricsCard } from './BusinessMetricsCard'
import { MoneyCard } from './MoneyCard'
import { BillingCard } from './BillingCard'
import { RemainingPlayground } from './RemainingPlaygrounds'
import { CreditScoringPlayground } from './CreditScoringPlayground'
import { PriceCompetitivenessCard, type PriceCompetitivenessProduct, type PriceCompetitivenessState } from './PriceCompetitivenessCard'
import { PublicationTasksPlayground } from './PublicationTasksPlayground'

type Variant = 'Normal' | 'Loading' | 'No disponible'
type Viewport = 'Desktop' | 'Mobile / Webview'
type SubcardState = 'Desplegada' | 'Fallback' | 'Sin Pendientes' | 'Plegada con Urgentes' | 'Plegada Sin Urgentes'

type TasksPlaygroundConfig = {
  groups: PublicationTaskGroup[]
  initialStates: Record<string, SubcardState>
  selectedGroupId: string
}

const salesTaskGroups: PublicationTaskGroup[] = [
  {
    id: 'sales_task_card',
    title: 'Envíos de hoy',
    value: '15',
    description: 'Por despachar',
    hasNavigation: true,
    tasks: [
      { id: 'sales-delayed', text: 'Demoradas', badge: { text: '15', color: 'red' } },
      { id: 'sales-collect', text: 'Colecta pendiente', badge: { text: '5', color: 'gray' } },
      { id: 'sales-turbo', text: 'Turbo | 12:00 - 13:00 hs', badge: { text: '20', color: 'gray' } },
      { id: 'sales-agency', text: 'Agencia | Hasta las 20:00 hs', badge: { text: '20', color: 'gray' } },
    ],
    hideTasksUntilExpanded: true,
    showDetailsAction: true,
  },
  {
    id: 'post_sales_task_card',
    title: 'Posventa',
    value: '4',
    description: 'Por atender',
    hasNavigation: true,
    tasks: [
      { id: 'post-sales-messages', text: 'Mensajes por responder', badge: { text: '2', color: 'red' } },
      { id: 'post-sales-claims', text: 'Reclamos por revisar', badge: { text: '1', color: 'red' } },
      { id: 'post-sales-returns', text: 'Devoluciones pendientes', badge: { text: '1', color: 'gray' } },
    ],
    hideTasksUntilExpanded: true,
    showDetailsAction: true,
  },
]

const salesInitialStates: Record<string, SubcardState> = {
  post_sales_task_card: 'Plegada Sin Urgentes',
  sales_task_card: 'Plegada Sin Urgentes',
}

const salesConfig: TasksPlaygroundConfig = {
  groups: salesTaskGroups,
  initialStates: salesInitialStates,
  selectedGroupId: 'sales_task_card',
}

const groupsForSubcardStates = (baseGroups: PublicationTaskGroup[], states: Record<string, SubcardState>) => baseGroups.map((group) => {
  const state = states[group.id] ?? 'Plegada Sin Urgentes'
  const foldedGroup = { ...group, defaultExpanded: false }
  if (state === 'Desplegada') return { ...group, defaultExpanded: true, fallback: false, fallbackStyle: undefined }
  if (state === 'Fallback') return { ...foldedGroup, fallback: true, fallbackStyle: 'panel' as const }
  if (state === 'Sin Pendientes') return { ...foldedGroup, value: '0', fallback: false, fallbackStyle: undefined }
  if (state === 'Plegada con Urgentes') return { ...foldedGroup, summaryBadge: 'red' as const, fallback: false, fallbackStyle: undefined }
  return { ...foldedGroup, summaryBadge: undefined, tasks: group.tasks.map((task) => ({ ...task, badge: { ...task.badge, color: 'gray' as const } })), fallback: false, fallbackStyle: undefined }
})

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="playground-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="playground-toggle__track" aria-hidden="true"><span /></span>
    </label>
  )
}

function VariantState({ variant }: { variant: Exclude<Variant, 'Normal'> }) {
  if (variant === 'Loading') {
    return <div className="task-card-state task-card-state--loading" aria-label="Estado cargando"><span /><span /><span /><span /></div>
  }

  const message = { title: 'Contenido no disponible', description: 'Este componente no está habilitado para esta cuenta.' }

  return <div className="task-card-state"><strong>{message.title}</strong><span>{message.description}</span></div>
}

function TasksPlayground({ component, config }: { component: SummaryComponent; config: TasksPlaygroundConfig }) {
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [subcardStates, setSubcardStates] = useState<Record<string, SubcardState>>(config.initialStates)
  const [groups, setGroups] = useState(() => groupsForSubcardStates(config.groups, config.initialStates))
  const [variant, setVariant] = useState<Variant>('Normal')
  const [selectedGroupId, setSelectedGroupId] = useState(config.selectedGroupId)
  const [viewport, setViewport] = useState<Viewport>('Desktop')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba los encabezados o despliega un grupo.')

  const changeValue = (id: string, value: string) => setGroups((current) => current.map((group) => group.id === id ? { ...group, value } : group))
  const changeSubcardState = (state: SubcardState) => {
    const nextStates = { ...subcardStates, [selectedGroupId]: state }
    setSubcardStates(nextStates)
    setGroups(groupsForSubcardStates(config.groups, nextStates))
    const messages: Record<SubcardState, string> = {
      Desplegada: 'La subcard muestra sus tareas internas y la acción de detalle.',
      Fallback: 'La subcard muestra un error localizado con opción de reintento.',
      'Sin Pendientes': 'La subcard no tiene tareas pendientes.',
      'Plegada con Urgentes': 'La subcard está plegada y conserva el indicador urgente.',
      'Plegada Sin Urgentes': 'La subcard está plegada sin indicador urgente.',
    }
    setInteraction(messages[state])
  }

  const selectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const retryGroup = (groupId: string) => {
    const nextStates = { ...subcardStates, [groupId]: 'Plegada con Urgentes' as const }
    setSubcardStates(nextStates)
    setGroups(groupsForSubcardStates(config.groups, nextStates))
    setInteraction('Los datos del grupo se recuperaron correctamente.')
  }

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section>
          <h2>Propiedades</h2>
          <Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} />
          <label className="playground-field"><span>Card interna</span><select value={selectedGroupId} onChange={(event) => selectGroup(event.target.value)}>{groups.map((group) => <option value={group.id} key={group.id}>{group.title}</option>)}</select></label>
        </section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          {groups.map((group) => <label className="playground-field" key={group.id}><span>{group.title}</span><input value={group.value} onChange={(event) => changeValue(group.id, event.target.value)} /></label>)}
        </section>
        <section>
          <h2>Estado</h2>
          <label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label>
          <label className="playground-field"><span>Estado de la subcard</span><select value={subcardStates[selectedGroupId]} onChange={(event) => changeSubcardState(event.target.value as SubcardState)}><option>Desplegada</option><option>Fallback</option><option>Sin Pendientes</option><option>Plegada con Urgentes</option><option>Plegada Sin Urgentes</option></select></label>
          <label className="playground-field"><span>Vista</span><select value={viewport} onChange={(event) => setViewport(event.target.value as Viewport)}><option>Desktop</option><option>Mobile / Webview</option></select></label>
        </section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>

      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--tasks ${darkMode ? 'preview-canvas--dark' : ''}`}>
          {variant === 'Normal' ? (
            <TasksCard key={`${selectedGroupId}-${subcardStates[selectedGroupId]}`} title={title} groups={groups} showTitle={showTitle} compact={viewport === 'Mobile / Webview'} shortContainer={component.id === 'sales-tasks'} onNavigate={(label) => setInteraction(`Se abriría el detalle de ${label}.`)} onRetry={retryGroup} />
          ) : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

function GenericPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [showComplementary, setShowComplementary] = useState(true)
  const [showAction, setShowAction] = useState(false)
  const [showStatus, setShowStatus] = useState(true)
  const [mainValue, setMainValue] = useState('12 pendientes')
  const [title, setTitle] = useState(component.name)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título" checked={showTitle} onChange={setShowTitle} /><Toggle label="Descripción" checked={showDescription} onChange={setShowDescription} /><Toggle label="Información complementaria" checked={showComplementary} onChange={setShowComplementary} /><Toggle label="Acción" checked={showAction} onChange={setShowAction} /><Toggle label="Indicador de estado" checked={showStatus} onChange={setShowStatus} /></section>
        <section><h2>Contenido</h2><label className="playground-field"><span>Valor principal</span><input value={mainValue} onChange={(event) => setMainValue(event.target.value)} /></label><label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real"><strong className="playground-stage__label">Vista previa en tiempo real</strong><div className={`preview-canvas ${darkMode ? 'preview-canvas--dark' : ''}`}><article className="preview-card playground-preview-card"><div className="preview-card__topline">{showTitle && <span className="preview-card__eyebrow">{title}</span>}{showStatus && <span className="preview-card__status">Actualizado</span>}</div><strong className="preview-card__value">{mainValue}</strong>{showDescription && <p>{component.description}</p>}{(showComplementary || showAction) && <div className="preview-card__footer">{showComplementary && <span>Actualizado hace 5 minutos</span>}{showAction && <button type="button">Ver detalle</button>}</div>}</article></div></section>
    </div>
  )
}

const reputationMetrics: ReputationMetric[] = [
  { id: 'claims', value: '0,9%', label: 'Reclamos', tone: 'orange' },
  { id: 'cancelled', value: '0%', label: 'Canceladas por ti', tone: 'green' },
  { id: 'mediations', value: '0%', label: 'Mediaciones', tone: 'green' },
  { id: 'delayed', value: '2%', label: 'Demoradas', tone: 'green' },
]

function ReputationPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [status, setStatus] = useState('Verde')
  const [metrics, setMetrics] = useState(reputationMetrics)
  const [variant, setVariant] = useState<Variant>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba el acceso a Reputación.')

  const changeMetricValue = (id: string, value: string) => setMetrics((current) => current.map((metric) => metric.id === id ? { ...metric, value } : metric))

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /></section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="playground-field"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Verde</option><option>Amarillo</option><option>Naranja</option><option>Rojo</option></select></label>
          {metrics.map((metric) => <label className="playground-field" key={metric.id}><span>{metric.label}</span><input value={metric.value} onChange={(event) => changeMetricValue(metric.id, event.target.value)} /></label>)}
        </section>
        <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--reputation ${darkMode ? 'preview-canvas--dark' : ''}`}>
          {variant === 'Normal' ? <ReputationCard title={title} status={status} metrics={metrics} showTitle={showTitle} onNavigate={() => setInteraction('Se abriría Reputación.')} /> : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

const newsItems: NewsItem[] = [
  { id: 'display-ads', text: 'Te regalamos $ 100.000 para promocionar tu página con Display Ads' },
  { id: 'flex-limit', text: 'Redujimos tu máximo de Envíos Flex para ayudarte a entregar a tiempo.' },
]

function NewsPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [showFeatured, setShowFeatured] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [items, setItems] = useState(newsItems)
  const [variant, setVariant] = useState<Variant>('Normal')
  const [viewport, setViewport] = useState<Viewport>('Desktop')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba una novedad o activa la destacada.')

  const setFeaturedVisibility = (visible: boolean) => {
    setShowFeatured(visible)
    setInteraction(visible ? 'La novedad destacada se muestra en la card.' : 'La card muestra solo las novedades de la lista.')
  }

  const changeItem = (id: string, text: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, text } : item))

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /><Toggle label="Novedad destacada" checked={showFeatured} onChange={setFeaturedVisibility} /></section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          {items.map((item) => <label className="playground-field" key={item.id}><span>Novedad</span><textarea value={item.text} rows={3} onChange={(event) => changeItem(item.id, event.target.value)} /></label>)}
        </section>
        <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label><label className="playground-field"><span>Vista</span><select value={viewport} onChange={(event) => setViewport(event.target.value as Viewport)}><option>Desktop</option><option>Mobile / Webview</option></select></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--news ${darkMode ? 'preview-canvas--dark' : ''} ${viewport === 'Mobile / Webview' ? 'preview-canvas--news-mobile' : ''}`}>
          {variant === 'Normal' ? <NewsCard title={title} showTitle={showTitle} showFeatured={showFeatured} items={items} onNavigate={(label) => setInteraction(`Se abriría ${label}.`)} /> : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

function BusinessMetricsPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [amount, setAmount] = useState('$ 500.000')
  const [delta, setDelta] = useState('20%')
  const [description, setDescription] = useState('Ventas brutas en los últimos 7 días')
  const [upperLimit, setUpperLimit] = useState('$ 555 mil')
  const [lowerLimit, setLowerLimit] = useState('$ 500 mil')
  const [variant, setVariant] = useState<Variant>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba el acceso a Métricas de negocio.')

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /></section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="playground-field"><span>Ventas brutas</span><input value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
          <label className="playground-field"><span>Variación</span><input value={delta} onChange={(event) => setDelta(event.target.value)} /></label>
          <label className="playground-field"><span>Descripción</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label className="playground-field"><span>Máximo del gráfico</span><input value={upperLimit} onChange={(event) => setUpperLimit(event.target.value)} /></label>
          <label className="playground-field"><span>Mínimo del gráfico</span><input value={lowerLimit} onChange={(event) => setLowerLimit(event.target.value)} /></label>
        </section>
        <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--business-metrics ${darkMode ? 'preview-canvas--dark' : ''}`}>
          {variant === 'Normal' ? <BusinessMetricsCard title={title} amount={amount} delta={delta} description={description} upperLimit={upperLimit} lowerLimit={lowerLimit} showTitle={showTitle} onNavigate={() => setInteraction('Se abrirían las Métricas de negocio.')} /> : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

function MoneyPlayground() {
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState('Tu dinero disponible')
  const [availableAmount, setAvailableAmount] = useState('$ 200.200.000')
  const [availableLabel, setAvailableLabel] = useState('Disponible')
  const [transferLabel, setTransferLabel] = useState('Transferir dinero')
  const [accountAmount, setAccountAmount] = useState('$ 100.200.000')
  const [accountLabel, setAccountLabel] = useState('En cuenta')
  const [variant, setVariant] = useState<Variant>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba Transferir dinero o el acceso a Mercado Pago.')

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /></section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="playground-field"><span>Dinero disponible</span><input value={availableAmount} onChange={(event) => setAvailableAmount(event.target.value)} /></label>
          <label className="playground-field"><span>Estado disponible</span><input value={availableLabel} onChange={(event) => setAvailableLabel(event.target.value)} /></label>
          <label className="playground-field"><span>Acción</span><input value={transferLabel} onChange={(event) => setTransferLabel(event.target.value)} /></label>
          <label className="playground-field"><span>Dinero en cuenta</span><input value={accountAmount} onChange={(event) => setAccountAmount(event.target.value)} /></label>
          <label className="playground-field"><span>Estado en cuenta</span><input value={accountLabel} onChange={(event) => setAccountLabel(event.target.value)} /></label>
        </section>
        <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--money ${darkMode ? 'preview-canvas--dark' : ''}`}>
          {variant === 'Normal' ? <MoneyCard title={title} availableAmount={availableAmount} availableLabel={availableLabel} transferLabel={transferLabel} accountAmount={accountAmount} accountLabel={accountLabel} showTitle={showTitle} onTransfer={() => setInteraction('Se abriría Transferir dinero.')} onNavigate={() => setInteraction('Se abriría Mercado Pago.')} /> : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

function BillingPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [balance, setBalance] = useState('$ 15.000')
  const [balanceLabel, setBalanceLabel] = useState('Saldo del periodo')
  const [pendingPeriod, setPendingPeriod] = useState('Tienes 1 período cerrado por pagar')
  const [dueDate, setDueDate] = useState('Vence el 23 jun 2021.')
  const [variant, setVariant] = useState<Variant>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba el acceso a Facturación.')

  return (
    <div className="playground-layout">
      <aside className="playground-controls" aria-label="Propiedades del componente">
        <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /></section>
        <section>
          <h2>Contenido</h2>
          <label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label className="playground-field"><span>Saldo</span><input value={balance} onChange={(event) => setBalance(event.target.value)} /></label>
          <label className="playground-field"><span>Etiqueta del saldo</span><input value={balanceLabel} onChange={(event) => setBalanceLabel(event.target.value)} /></label>
          <label className="playground-field"><span>Período pendiente</span><input value={pendingPeriod} onChange={(event) => setPendingPeriod(event.target.value)} /></label>
          <label className="playground-field"><span>Vencimiento</span><input value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
        </section>
        <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={variant} onChange={(event) => setVariant(event.target.value as Variant)}><option>Normal</option><option>Loading</option><option>No disponible</option></select></label></section>
        <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
      </aside>
      <section className="playground-stage" aria-label="Vista previa en tiempo real">
        <strong className="playground-stage__label">Vista previa en tiempo real</strong>
        <div className={`preview-canvas preview-canvas--billing ${darkMode ? 'preview-canvas--dark' : ''}`}>
          {variant === 'Normal' ? <BillingCard title={title} balance={balance} balanceLabel={balanceLabel} pendingPeriod={pendingPeriod} dueDate={dueDate} showTitle={showTitle} onNavigate={() => setInteraction('Se abriría Facturación.')} /> : <VariantState variant={variant} />}
        </div>
        <p className="playground-stage__feedback" aria-live="polite">{interaction}</p>
      </section>
    </div>
  )
}

export function ComponentPlayground({ component }: { component: SummaryComponent }) {
  if (component.id === 'publication-tasks') return <PublicationTasksPlayground component={component} />
  if (component.id === 'sales-tasks') return <TasksPlayground component={component} config={salesConfig} />
  if (component.id === 'reputation') return <ReputationPlayground component={component} />
  if (component.id === 'news') return <NewsPlayground component={component} />
  if (component.id === 'business-metrics') return <BusinessMetricsPlayground component={component} />
  if (component.id === 'money') return <MoneyPlayground />
  if (component.id === 'billing') return <BillingPlayground component={component} />
  if (component.id === 'credits-scoring') return <CreditScoringPlayground />
  if (component.id === 'price-competitiveness') return <PriceCompetitivenessPlayground component={component} />
  if (['shipping-collect', 'shipping-flex', 'full', 'my-page', 'advertising-metrics', 'control-panel'].includes(component.id)) return <RemainingPlayground component={component} />
  return <GenericPlayground component={component} />
}

const initialPriceProducts: PriceCompetitivenessProduct[] = [
  { id: 'iphone-17', name: 'Apple iPhone 17 Pro Max (256 GB) - Naranja cósmico' },
  { id: 'iphone-16', name: 'Apple iPhone 16 (128 GB) - Negro' },
  { id: 'iphone-11', name: 'Apple iPhone 11 (64 GB) - Blanco' },
  { id: 'samsung-s25', name: 'Samsung Galaxy S25 Ultra (512 GB) - Titanio Negro' },
]

function PriceCompetitivenessPlayground({ component }: { component: SummaryComponent }) {
  const [showTitle, setShowTitle] = useState(true)
  const [showBenefits, setShowBenefits] = useState(true)
  const [title, setTitle] = useState(component.name)
  const [affectedCount, setAffectedCount] = useState('16 publicaciones')
  const [products, setProducts] = useState(initialPriceProducts)
  const [state, setState] = useState<PriceCompetitivenessState>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba el acceso a las publicaciones no competitivas.')
  const benefits = ['Tarifa de venta reducida en categorías seleccionadas.', 'Acceso a campañas con inversión de Mercado Libre.']
  const updateProduct = (id: string, name: string) => setProducts((current) => current.map((product) => product.id === id ? { ...product, name } : product))

  return <div className="playground-layout">
    <aside className="playground-controls" aria-label="Propiedades del componente">
      <section><h2>Propiedades</h2><Toggle label="Título del componente" checked={showTitle} onChange={setShowTitle} /><Toggle label="Beneficios afectados" checked={showBenefits} onChange={setShowBenefits} /></section>
      <section><h2>Contenido</h2><label className="playground-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label className="playground-field"><span>Publicaciones no competitivas</span><input value={affectedCount} onChange={(event) => setAffectedCount(event.target.value)} /></label>{products.map((product, index) => <label className="playground-field" key={product.id}><span>Publicación {index + 1}</span><input value={product.name} onChange={(event) => updateProduct(product.id, event.target.value)} /></label>)}</section>
      <section><h2>Estado</h2><label className="playground-field"><span>Componente completo</span><select value={state} onChange={(event) => setState(event.target.value as PriceCompetitivenessState)}><option>Normal</option><option>Cargando</option><option>Sin datos</option><option>Error</option><option>No disponible</option></select></label></section>
      <section><h2>Tema</h2><Toggle label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
    </aside>
    <section className="playground-stage" aria-label="Vista previa en tiempo real"><strong className="playground-stage__label">Vista previa en tiempo real</strong><div className={`preview-canvas preview-canvas--price-competitiveness ${darkMode ? 'preview-canvas--dark' : ''}`}><PriceCompetitivenessCard title={title} affectedCount={affectedCount} benefits={showBenefits ? benefits : []} products={products} showTitle={showTitle} state={state} onNavigate={() => setInteraction('Se abrirían Publicaciones con el filtro de precio no competitivo.')} onOpenProducts={() => setInteraction('Se abriría el listado filtrado de publicaciones no competitivas.')} onRetry={() => { setState('Normal'); setInteraction('Los datos se recuperaron correctamente.') }} /></div><p className="playground-stage__feedback" aria-live="polite">{interaction}</p></section>
  </div>
}
