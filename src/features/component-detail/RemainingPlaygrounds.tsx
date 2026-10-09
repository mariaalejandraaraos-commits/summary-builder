import { useState } from 'react'
import type { SummaryComponent } from '../../domain/summary-builder'
import { AdvertisingMetricsCard, ControlPanelCard, FullSpacesCard, MyPageCard, ShippingPerformanceCard, type AdvertisingMetric, type ControlPanelVisibility, type FeedbackTone, type FullSpaceMetric, type ReferenceState, type ShippingMetric } from './RemainingCards'

const shippingDefaults: Record<string, { title: string; metrics: ShippingMetric[]; exposure: string; exposureTone: FeedbackTone }> = {
  'shipping-collect': { title: 'Envíos con colecta', metrics: [{ id: 'current', value: '97%', label: 'Semana actual', tone: 'positive' }, { id: 'recent', value: '97%', label: 'Últimas 4 semanas', tone: 'positive' }], exposure: 'Excelente, con destaque', exposureTone: 'positive' },
  'shipping-flex': { title: 'Envíos Flex', metrics: [{ id: 'current', value: '94%', label: 'Semana actual', tone: 'caution' }], exposure: 'Regular, sin destaque', exposureTone: 'caution' },
}

const initialFullMetrics: FullSpaceMetric[] = [
  { id: 'small', percentage: '150%', label: 'Pequeños y medianos', units: '1980 u. de 2000 u.', tone: 'negative' },
  { id: 'large', percentage: '150%', label: 'Grandes y extragrandes', units: '1980 u. de 2000 u.', tone: 'negative' },
]

const initialAdMetrics: AdvertisingMetric[] = [
  { id: 'sales', value: '784', label: 'Ventas por publicidad', delta: '23%', trend: 'up' },
  { id: 'clicks', value: '1.346', label: 'Clics recibidos', delta: '17%', trend: 'down' },
]

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="playground-toggle"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="playground-toggle__track" aria-hidden="true"><span /></span></label>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="playground-field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return <label className="playground-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value as T)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

const toneOptions: Array<{ value: FeedbackTone; label: string }> = [{ value: 'positive', label: 'Positivo · verde' }, { value: 'caution', label: 'Atención · naranja' }, { value: 'negative', label: 'Crítico · rojo' }]
const stateOptions: Array<{ value: ReferenceState; label: string }> = ['Normal', 'Cargando', 'Sin datos', 'Error', 'No disponible'].map((value) => ({ value: value as ReferenceState, label: value }))

export function RemainingPlayground({ component }: { component: SummaryComponent }) {
  const id = component.id
  const shippingBase = shippingDefaults[id]
  const isShipping = Boolean(shippingBase)
  const [showTitle, setShowTitle] = useState(true)
  const [state, setState] = useState<ReferenceState>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba las variantes y los accesos del componente.')
  const [title, setTitle] = useState(shippingBase?.title ?? component.name)
  const [shippingMetrics, setShippingMetrics] = useState<ShippingMetric[]>(shippingBase?.metrics ?? [])
  const [exposure, setExposure] = useState(shippingBase?.exposure ?? '')
  const [exposureTone, setExposureTone] = useState<FeedbackTone>(shippingBase?.exposureTone ?? 'positive')
  const [exposureDescription, setExposureDescription] = useState('Exposición prevista la próxima semana')
  const [fullMetrics, setFullMetrics] = useState(initialFullMetrics)
  const [followers, setFollowers] = useState('10 seguidores')
  const [followerStatus, setFollowerStatus] = useState('Débil')
  const [followerDescription, setFollowerDescription] = useState('No tienes suficientes seguidores')
  const [newFollowers, setNewFollowers] = useState('2 seguidores nuevos')
  const [buyers, setBuyers] = useState('0 seguidores te compraron')
  const [showRecommendation, setShowRecommendation] = useState(id === 'my-page')
  const [adMetrics, setAdMetrics] = useState(initialAdMetrics)
  const [panelVisibility, setPanelVisibility] = useState<ControlPanelVisibility>({ reputation: true, logistics: true, sales: true, money: true })
  const [mobile, setMobile] = useState(false)

  const changeShipping = (metricId: string, patch: Partial<ShippingMetric>) => setShippingMetrics((current) => current.map((metric) => metric.id === metricId ? { ...metric, ...patch } : metric))
  const changeFull = (metricId: string, patch: Partial<FullSpaceMetric>) => setFullMetrics((current) => current.map((metric) => metric.id === metricId ? { ...metric, ...patch } : metric))
  const changeAd = (metricId: string, patch: Partial<AdvertisingMetric>) => setAdMetrics((current) => current.map((metric) => metric.id === metricId ? { ...metric, ...patch } : metric))
  const navigate = (destination: string) => setInteraction(`Se abriría ${destination}.`)
  const retry = () => { setState('Normal'); setInteraction('Los datos se recuperaron correctamente.') }

  const card = isShipping ? <ShippingPerformanceCard title={title} metrics={shippingMetrics} exposure={exposure} exposureTone={exposureTone} exposureDescription={exposureDescription} showRecommendation={showRecommendation} showTitle={showTitle} state={state} onNavigate={() => navigate('Métricas de envíos')} onRecommendationNavigate={() => navigate('Modificar publicaciones')} onHideRecommendation={() => { setShowRecommendation(false); setInteraction('Recomendación oculta. Puedes volver a mostrarla desde el switch.') }} onRetry={retry} />
    : id === 'full' ? <FullSpacesCard metrics={fullMetrics} showTitle={showTitle} state={state} onNavigate={() => navigate('Métricas de Stock Full')} onRetry={retry} />
    : id === 'my-page' ? <MyPageCard followers={followers} followerStatus={followerStatus} followerDescription={followerDescription} newFollowers={newFollowers} buyers={buyers} showRecommendation={showRecommendation} showTitle={showTitle} state={state} onNavigate={() => navigate('Mi página')} onCreateCoupon={() => navigate('Crear cupón')} onHideRecommendation={() => { setShowRecommendation(false); setInteraction('Recomendación oculta. Puedes volver a mostrarla desde el switch.') }} onRetry={retry} />
    : id === 'advertising-metrics' ? <AdvertisingMetricsCard metrics={adMetrics} showTitle={showTitle} state={state} onNavigate={() => navigate('Crear campaña')} onRetry={retry} />
    : <ControlPanelCard visible={panelVisibility} mobile={mobile} state={state} onNavigate={navigate} onRetry={retry} />

  return <div className="playground-layout">
    <aside className="playground-controls" aria-label="Propiedades del componente">
      <section><h2>Propiedades</h2>{id !== 'control-panel' && <Switch label="Título del componente" checked={showTitle} onChange={setShowTitle} />}{(id === 'my-page' || isShipping) && <Switch label="Recomendación contextual" checked={showRecommendation} onChange={setShowRecommendation} />}{id === 'control-panel' && <Switch label="Vista mobile" checked={mobile} onChange={setMobile} />}</section>
      {isShipping && <section><h2>Contenido y variantes</h2><Field label="Título" value={title} onChange={setTitle} />{shippingMetrics.map((metric) => <div className="playground-control-group" key={metric.id}><Field label={metric.label} value={metric.value} onChange={(value) => changeShipping(metric.id, { value })} /><SelectField label={`Estado · ${metric.label}`} value={metric.tone} options={toneOptions} onChange={(tone) => changeShipping(metric.id, { tone })} /></div>)}<Field label="Exposición próxima semana" value={exposure} onChange={setExposure} /><SelectField label="Estado de exposición" value={exposureTone} options={toneOptions} onChange={setExposureTone} /><Field label="Descripción" value={exposureDescription} onChange={setExposureDescription} /></section>}
      {id === 'full' && <section><h2>Espacios y variantes</h2>{fullMetrics.map((metric) => <div className="playground-control-group" key={metric.id}><Field label={metric.label} value={metric.percentage} onChange={(percentage) => changeFull(metric.id, { percentage })} /><Field label="Unidades" value={metric.units} onChange={(units) => changeFull(metric.id, { units })} /><SelectField label="Estado de ocupación" value={metric.tone} options={toneOptions} onChange={(tone) => changeFull(metric.id, { tone })} /></div>)}</section>}
      {id === 'my-page' && <section><h2>Contenido y variantes</h2><Field label="Seguidores" value={followers} onChange={setFollowers} /><SelectField label="Nivel" value={followerStatus} options={[{ value: 'Débil', label: 'Débil' }, { value: 'Regular', label: 'Regular' }, { value: 'Fuerte', label: 'Fuerte' }]} onChange={setFollowerStatus} /><Field label="Descripción" value={followerDescription} onChange={setFollowerDescription} /><Field label="Seguidores nuevos" value={newFollowers} onChange={setNewFollowers} /><Field label="Compradores" value={buyers} onChange={setBuyers} /></section>}
      {id === 'advertising-metrics' && <section><h2>Contenido y variantes</h2>{adMetrics.map((metric) => <div className="playground-control-group" key={metric.id}><Field label={metric.label} value={metric.value} onChange={(value) => changeAd(metric.id, { value })} /><Field label="Variación" value={metric.delta} onChange={(delta) => changeAd(metric.id, { delta })} /><SelectField label="Tendencia" value={metric.trend} options={[{ value: 'up', label: 'Sube · verde' }, { value: 'down', label: 'Baja · rojo' }]} onChange={(trend) => changeAd(metric.id, { trend })} /></div>)}</section>}
      {id === 'control-panel' && <section><h2>Segmentos visibles</h2>{([['reputation', 'Reputación'], ['logistics', 'Logística'], ['sales', 'Ventas brutas'], ['money', 'Dinero disponible']] as const).map(([key, label]) => <Switch key={key} label={label} checked={panelVisibility[key]} onChange={(checked) => setPanelVisibility((current) => ({ ...current, [key]: checked }))} />)}</section>}
      <section><h2>Estado</h2><SelectField label="Componente completo" value={state} options={stateOptions} onChange={setState} /></section>
      <section><h2>Tema</h2><Switch label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
    </aside>
    <section className="playground-stage" aria-label="Vista previa en tiempo real"><strong className="playground-stage__label">Vista previa en tiempo real</strong><div className={`preview-canvas preview-canvas--reference ${id === 'control-panel' ? 'preview-canvas--control-panel' : ''} ${darkMode ? 'preview-canvas--dark' : ''}`}>{card}</div><p className="playground-stage__feedback" aria-live="polite">{interaction}</p></section>
  </div>
}
