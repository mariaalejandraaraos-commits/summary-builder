import { useEffect, useRef, useState, type DragEvent } from 'react'
import { GripVertical, MoreVertical, RotateCcw, Sparkles, X } from 'lucide-react'
import dataLines from '../../assets/slot-variants/dataGraphic-imgLines.svg?inline'
import dataMask from '../../assets/slot-variants/dataGraphic-imgVector2957.svg?inline'
import dataTrend from '../../assets/slot-variants/dataGraphic-imgVector2958.svg?inline'
import gaugeBase from '../../assets/slot-variants/gauge-imgBase.svg?inline'
import gaugeFigmaArc from '../../assets/slot-variants/gauge-imgBoa2.svg?inline'
import storeIllustration from '../../assets/slot-variants/card-store.png?inline'
import newsBean from '../../assets/slot-variants/news-imgBean.svg?inline'
import newsScreenSmall from '../../assets/slot-variants/news-imgScreen01.svg?inline'
import newsScreenLarge from '../../assets/slot-variants/news-imgScreen4.svg?inline'
import newsShoeSmall from '../../assets/slot-variants/news-imgGroupCopy16.svg?inline'
import newsShoeLarge from '../../assets/slot-variants/news-imgGroupCopy17.svg?inline'
import newsEdit from '../../assets/slot-variants/news-imgIconEdit.svg?inline'
import newsSparkle from '../../assets/slot-variants/news-imgGroup790473.svg?inline'
import feedbackPositiveShape from '../../assets/slot-variants/feedbackPositiveShape.svg?inline'
import feedbackInfoShape from '../../assets/slot-variants/feedbackInfoShape.svg?inline'
import feedbackCautionShape from '../../assets/slot-variants/feedbackCautionShape.svg?inline'
import monitorLines from '../../assets/slot-variants/liveMonitor-imgLineas.svg?inline'
import monitorTrends from '../../assets/slot-variants/liveMonitor-imgGraficos.svg?inline'
import recommendationSparkle from '../../assets/recommendation-card/sparkle.svg?inline'
import recommendationProduct from '../../assets/recommendation-card/product-background.png?inline'
import fontLight from '../../assets/fonts/proximanova-light.woff2?inline'
import fontRegular from '../../assets/fonts/proximanova-regular.woff2?inline'
import fontSemibold from '../../assets/fonts/proximanova-semibold.woff2?inline'
import fontBold from '../../assets/fonts/proximanova-bold.woff2?inline'
import demoStyles from './reputation-demo.css?raw'
import appStyles from '../../App.css?raw'
import { downloadContextHtml } from './exportCardHtml'
import { SummaryTemplatePreview } from './SummaryTemplatePreview'
import { placementLabel, suggestTemplatePlacement, templateColumns, type TemplatePlacement } from './summary-template-layout'
import { monthlyPrompt, type MonthlyFrame } from '../../monthly-sequence'
import { MonthlyGeneration } from '../../monthly-generation'
import './reputation-demo.css'

const contextStyles = appStyles
  .replace('./assets/fonts/proximanova-light.woff2', fontLight)
  .replace('./assets/fonts/proximanova-regular.woff2', fontRegular)
  .replace('./assets/fonts/proximanova-semibold.woff2', fontSemibold)
  .replace('./assets/fonts/proximanova-bold.woff2', fontBold)

type SlotId = 'slot-1' | 'slot-2' | 'slot-3'
type PromptPattern = 'reputation' | 'value' | 'gauge' | 'news'
type SlotVariant = PromptPattern | 'dataGraphic' | 'fallback' | 'stateDescription' | 'card' | 'benefits' | 'trendsByCategory' | 'decliningListings' | 'opportunities' | 'liveMonitor' | 'recommendationCard'
type SlotSource = 'library' | 'figma' | 'prompt'
type ReputationTone = 'green' | 'yellow' | 'red'
type MetricStatus = 'icon' | 'dot'
type MetricColor = 'accent' | 'green' | 'orange' | 'red' | 'gray'
type Metric = { value: string; label: string; status: MetricStatus; color: MetricColor }
type MetricColumns = 1 | 2 | 3 | 4
type SketchKind = 'metric' | 'chart' | 'gauge' | 'status' | 'list' | 'message' | 'followers' | 'period-list' | 'recommendation'
type PromptSketch = {
  kind: SketchKind
  andesPattern: PromptPattern
  title: string
  cardTitle: string
  cta: string
  interpretation: string
  value: string
  change: string
  period: string
  support: string
  direction: 'up' | 'down'
  gaugeValue: number
  items: { label: string; value: string }[]
}

type DemoSlot = {
  enabled: boolean
  source: SlotSource
  variant: SlotVariant
  label: string
  value: string
  description: string
  showProduct: boolean
  productName: string
  productCount: string
  tone: ReputationTone
  columns: MetricColumns
  metrics: Metric[]
  figmaUrl: string
  figmaImageDataUrl: string
  figmaImageSource: 'api' | 'upload' | ''
  prompt: string
  promptApplied: boolean
  usesLibraryVariant: boolean
  sketch: PromptSketch | null
}

type DemoConfig = {
  title: string
  footer: string
  ideaPrompt: string
  autoTitle: boolean
  autoFooter: boolean
  order: SlotId[]
  slots: Record<SlotId, DemoSlot>
  placement: TemplatePlacement
  placementCustomized: boolean
}

type LocalAiProposal = {
  title: string
  cta: string
  rationale?: string
  slots: { role?: string; variant: string; label: string; value: string; description: string }[]
}

type BuilderStage = 'build' | 'template' | 'mobile'

const allSlotIds: SlotId[] = ['slot-1', 'slot-2', 'slot-3']
const slotRoles: Record<SlotId, { name: string; description: string; emptyAction: string }> = {
  'slot-1': {
    name: 'Información principal',
    description: 'Lo que más debe resaltar de la card.',
    emptyAction: 'Agregar información principal',
  },
  'slot-2': {
    name: 'Información complementaria',
    description: 'Datos que amplían o explican la información principal.',
    emptyAction: 'Agregar información complementaria',
  },
  'slot-3': {
    name: 'Recomendaciones contextuales',
    description: 'Sugerencias relacionadas con la situación que muestra la card.',
    emptyAction: 'Agregar recomendación contextual',
  },
}

const variantNames: Record<SlotVariant, string> = {
  dataGraphic: 'Data Graphic',
  value: 'Value basic',
  gauge: 'Data gauge',
  fallback: 'Fallback',
  stateDescription: 'State description',
  news: 'News',
  reputation: 'Reputation',
  card: 'Card',
  benefits: 'Benefits',
  trendsByCategory: 'Trends by category',
  decliningListings: 'Declining listings',
  opportunities: 'Opportunities',
  liveMonitor: 'Live monitor',
  recommendationCard: 'Card de recomendaciones',
}

const extraPatternDefaults: Record<Exclude<SlotVariant, PromptPattern>, { label: string; value: string; description: string }> = {
  dataGraphic: { label: '$ 555 mil', value: '$ 500 mil', description: '22 sep. · 29 sep.' },
  fallback: { label: 'No pudimos mostrar estos datos', value: 'Prueba cargando la página de nuevo.', description: 'Reintentar' },
  stateDescription: { label: 'Aclaración del estado', value: 'Periodo de tiempo', description: '' },
  card: { label: 'Estás más cerca de ser proveedor de Mercado Libre', value: 'Solo te falta conocer el impacto de reventa en tu negocio, aceptar los Términos y condiciones, y configurar nuestro facturador gratuito.', description: 'Empieza a vender con hasta 10.5% más de liquidez.' },
  benefits: { label: 'Sigue disfrutando de los beneficios que tienes', value: 'Tarifa de venta reducida en categorías seleccionadas.', description: 'Acceso a campañas con inversión de Mercado Libre.' },
  trendsByCategory: { label: 'Desempeño de tus categorías del mes en curso', value: 'Nombre de la categoría', description: '20%' },
  decliningListings: { label: 'Con caída en ventas brutas en los últimos 7 días', value: 'Funda iPhone 13 Silicone Case', description: '5,2%' },
  opportunities: { label: 'Deportes y fitness', value: 'Zapatillas deportivas Nike Air Zoom Pegasus originales + factura', description: 'Publicar este producto' },
  liveMonitor: { label: 'Ventas brutas de hoy', value: '$ 8.123.605', description: 'Hoy · Ayer' },
  recommendationCard: { label: 'Agrega zonas y vendé hasta 15 veces más', value: 'Puedes crear productos de catálogo a partir de tus publicaciones.', description: 'Crear productos' },
}

const extraPatternFieldNames: Record<Exclude<SlotVariant, PromptPattern>, [string, string, string]> = {
  dataGraphic: ['Valor superior del eje', 'Valor inferior del eje', 'Fechas (separadas por ·)'],
  fallback: ['Estado', 'Mensaje', 'Acción'],
  stateDescription: ['Aclaración', 'Período', ''],
  card: ['Título', 'Texto principal', 'Texto secundario'],
  benefits: ['Título', 'Primer beneficio', 'Segundo beneficio'],
  trendsByCategory: ['Título', 'Nombre de categoría', 'Variación'],
  decliningListings: ['Título', 'Primer producto', 'Variación'],
  opportunities: ['Primera categoría', 'Primer producto', 'Acción'],
  liveMonitor: ['Métrica', 'Monto', ''],
  recommendationCard: ['Título', 'Descripción', 'Enlace'],
}

const sessionStorageKey = 'summary-builder-reputation-session-v1'

function defaultSlot(variant: SlotVariant, enabled = false): DemoSlot {
  const metrics = [
    { value: '0.000', label: 'Label', status: 'icon' as const, color: 'green' as const },
    { value: '0%', label: 'Label', status: 'icon' as const, color: 'green' as const },
    { value: '0%', label: 'Label', status: 'icon' as const, color: 'green' as const },
    { value: '0%', label: 'Label', status: 'icon' as const, color: 'green' as const },
  ]
  const common = { enabled, source: 'library' as const, variant, tone: 'green' as const, columns: 1 as const, metrics, figmaUrl: '', figmaImageDataUrl: '', figmaImageSource: '' as const, prompt: '', promptApplied: false, usesLibraryVariant: false, sketch: null, showProduct: true, productName: 'Varias publicaciones', productCount: '+4' }
  if (variant === 'reputation') return { ...common, label: 'MercadoLíder Platinum', value: '', description: '' }
  if (variant === 'gauge') return { ...common, label: 'Texto', value: 'Text link', description: 'Alto' }
  if (variant === 'news') return { ...common, label: 'NOVEDAD', value: 'Explora las herramientas de nuestro editor y transforma imágenes.', description: 'Usaremos inteligencia artificial para transformar tus imágenes y aumentar las ventas de forma automática, garantizando resultados efectivos.' }
  if (variant === 'value') return { ...common, label: 'Label', value: '0.000', description: '' }
  return { ...common, ...extraPatternDefaults[variant] }
}

function defaultSlotForRole(_id: SlotId, variant: SlotVariant, enabled = false): DemoSlot {
  return defaultSlot(variant, enabled)
}

function createConfig(prefill: boolean): DemoConfig {
  return {
    title: prefill ? 'Reputación' : '',
    footer: prefill ? 'Ver reputación' : '',
    ideaPrompt: '',
    autoTitle: false,
    autoFooter: false,
    order: prefill ? [...allSlotIds] : [],
    slots: {
      'slot-1': defaultSlotForRole('slot-1', 'reputation', prefill),
      'slot-2': defaultSlotForRole('slot-2', 'value', prefill),
      'slot-3': defaultSlotForRole('slot-3', 'news'),
    },
    placement: { column: 2, after: 'reputation' },
    placementCustomized: false,
  }
}

function placementSuggestion(config: DemoConfig) {
  return suggestTemplatePlacement({
    title: config.title,
    ideaPrompt: config.ideaPrompt,
    slots: config.order.map((id) => config.slots[id]),
  })
}

function variantName(variant: SlotVariant) { return variantNames[variant] }
function slotContentName(slot: DemoSlot) {
  if (slot.source === 'figma') return 'Diseño de Figma'
  if (slot.source === 'prompt' && slot.usesLibraryVariant) return `${variantName(slot.variant)} · propuesta de Mi idea`
  return slot.source === 'prompt' ? 'Idea por prompt' : variantName(slot.variant)
}

function figmaNodeReference(value: string) {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || !['figma.com', 'www.figma.com'].includes(url.hostname)) return null
    const [, rawType, fileKey] = url.pathname.split('/')
    const type = rawType === 'file' ? 'design' : rawType
    if (type !== 'design' || !/^[a-zA-Z0-9]+$/.test(fileKey || '')) return null
    const nodeId = url.searchParams.get('node-id')
    if (!nodeId || !/^\d+[-:]\d+$/.test(nodeId)) return null
    return { fileKey, nodeId: nodeId.replace('-', ':') }
  } catch {
    return null
  }
}

function validFigmaUrl(value: string) { return figmaNodeReference(value) !== null }

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(blob)
  })
}

function verifyImage(dataUrl: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => image.naturalWidth > 0 && image.naturalHeight > 0 ? resolve() : reject(new Error('La imagen está vacía.'))
    image.onerror = () => reject(new Error('No pudimos abrir la imagen.'))
    image.src = dataUrl
  })
}

function andesPatternForSketch(kind: SketchKind): PromptPattern {
  if (kind === 'gauge' || kind === 'followers') return 'gauge'
  if (kind === 'status') return 'reputation'
  if (kind === 'list' || kind === 'message' || kind === 'period-list' || kind === 'recommendation') return 'news'
  return 'value'
}

type StoredSession = { version: 1 | 2 | 3 | 4; savedAt: string; config: DemoConfig; device: 'desktop' | 'mobile' }

function readSavedSession(prefill: boolean): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(prefill ? `${sessionStorageKey}-library` : sessionStorageKey)
    if (!raw) return null
    const stored = JSON.parse(raw) as StoredSession
    if ((stored.version !== 1 && stored.version !== 2 && stored.version !== 3 && stored.version !== 4) || !stored.config || !stored.config.slots) return null
    const defaults = createConfig(false)
    const storedOrder = Array.isArray(stored.config.order)
      ? [...new Set(stored.config.order.filter((id): id is SlotId => allSlotIds.includes(id)))].slice(0, allSlotIds.length)
      : defaults.order
    const order = stored.version === 1 && storedOrder.join(',') === 'slot-1,slot-2' ? [...allSlotIds] : storedOrder
    const slots = Object.fromEntries(allSlotIds.map((id) => {
      const saved = stored.version === 1 && id === 'slot-3' && !storedOrder.includes(id) ? undefined : stored.config.slots[id]
      const savedMetrics = Array.isArray(saved?.metrics) ? saved.metrics : []
      const figmaImageDataUrl = typeof saved?.figmaImageDataUrl === 'string' && saved.figmaImageDataUrl.startsWith('data:image/') ? saved.figmaImageDataUrl : ''
      return [id, {
        ...defaults.slots[id],
        ...saved,
        enabled: saved?.source === 'figma' ? Boolean(figmaImageDataUrl) : Boolean(saved?.enabled),
        figmaImageDataUrl,
        figmaImageSource: figmaImageDataUrl ? saved?.figmaImageSource === 'upload' ? 'upload' : 'api' : '',
        metrics: defaults.slots[id].metrics.map((metric, index) => {
          const savedMetric = savedMetrics[index]
          const status = savedMetric?.status === 'dot' ? 'dot' : 'icon'
          const savedColor = savedMetric?.color
          const color = savedColor === 'accent' || savedColor === 'orange' || savedColor === 'red' || savedColor === 'gray' ? savedColor : 'green'
          return { ...metric, ...savedMetric, status, color: status === 'icon' && color === 'gray' ? 'green' : color }
        }),
      }]
    })) as Record<SlotId, DemoSlot>
    const hasSavedContent = order.some((id) => slots[id].enabled)
    const savedPlacement = stored.config.placement
    const placement = Number.isInteger(savedPlacement?.column) && savedPlacement.column >= 0 && savedPlacement.column < templateColumns.length
      && (savedPlacement.after === null || templateColumns[savedPlacement.column].some((card) => card.id === savedPlacement.after))
      ? { ...savedPlacement, after: savedPlacement.after ?? templateColumns[savedPlacement.column][0].id } : defaults.placement
    return {
      version: 4,
      savedAt: typeof stored.savedAt === 'string' ? stored.savedAt : '',
      config: {
        ...defaults,
        ...stored.config,
        title: hasSavedContent && typeof stored.config.title === 'string' ? stored.config.title : defaults.title,
        footer: hasSavedContent && typeof stored.config.footer === 'string' ? stored.config.footer : defaults.footer,
        ideaPrompt: '',
        order,
        slots,
        placement,
        placementCustomized: stored.config.placementCustomized === undefined
          ? placement.column !== defaults.placement.column || placement.after !== defaults.placement.after
          : Boolean(stored.config.placementCustomized),
      },
      device: stored.device === 'mobile' ? 'mobile' : 'desktop',
    }
  } catch {
    return null
  }
}

function writeSavedSession(config: DemoConfig, device: 'desktop' | 'mobile', prefill: boolean) {
  try {
    const session: StoredSession = { version: 4, savedAt: new Date().toISOString(), config, device }
    window.localStorage.setItem(prefill ? `${sessionStorageKey}-library` : sessionStorageKey, JSON.stringify(session))
    return true
  } catch {
    return false
  }
}

function clearSavedSession(prefill: boolean) {
  try {
    window.localStorage.removeItem(prefill ? `${sessionStorageKey}-library` : sessionStorageKey)
  } catch {
    // The session can still be reset in memory if browser storage is unavailable.
  }
}

function gaugeArc(value: number) {
  const angle = Math.PI * (1 - value / 100)
  return `M20 95 A90 90 0 0 1 ${(110 + 90 * Math.cos(angle)).toFixed(1)} ${(95 - 90 * Math.sin(angle)).toFixed(1)}`
}

function buildPromptSketch(prompt: string): PromptSketch {
  const normalize = (value: string) => value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const words = normalize(prompt)
  const matches = (pattern: RegExp) => pattern.test(words)
  const direction: PromptSketch['direction'] = matches(/baj|caid|disminu|descens/) ? 'down' : 'up'
  const period = matches(/hoy/) ? 'Hoy' : matches(/mes|30 dias/) ? 'Últimos 30 días' : 'Últimos 7 días'
  const isSales = matches(/venta/)
  const isIncome = matches(/ingreso|facturacion|monto|dinero|saldo/)
  const valueMatch = words.match(/(\d{1,3})\s*(?:%|de 100|sobre 100)/)
  const gaugeValue = valueMatch ? Math.max(0, Math.min(100, Number(valueMatch[1]))) : 72
  const base = {
    value: isIncome ? '$ 1.248.500' : '1.248',
    change: direction === 'down' ? '−8,1%' : '+12,4%',
    period,
    support: period === 'Hoy' ? 'vs. ayer' : 'vs. período anterior',
    direction,
    gaugeValue,
    items: [] as { label: string; value: string }[],
  }
  if (matches(/tacometro|velocimetro|medidor semicircular/)) return { ...base, kind: 'gauge', andesPattern: 'gauge', title: matches(/reputacion/) ? 'Nivel de reputación' : 'Nivel actual', cardTitle: matches(/reputacion/) ? 'Reputación' : 'Estado', cta: matches(/reputacion/) ? 'Ver reputación' : 'Ver detalle', interpretation: 'Tacómetro de estado' }
  if (matches(/reputacion|calificacion|semaforo|estado del vendedor/)) return { ...base, kind: 'status', andesPattern: 'reputation', title: direction === 'down' ? 'Tu reputación necesita atención' : 'MercadoLíder Platinum', cardTitle: 'Reputación', cta: 'Ver reputación', interpretation: 'Estado visual con escala de color' }
  if (matches(/grafico|grafica|tendencia|evolucion|historico|comparar/)) return { ...base, kind: 'chart', andesPattern: 'value', title: isSales ? 'Tendencia de ventas' : isIncome ? 'Tendencia de ingresos' : 'Evolución reciente', cardTitle: isSales ? 'Ventas' : isIncome ? 'Ingresos' : 'Actividad', cta: isSales ? 'Ver ventas' : 'Ver detalle', interpretation: 'Gráfica con patrón base de Valor básico' }
  if (matches(/pendiente|tarea|listado|lista|pedido|publicacion/)) {
    const isListings = matches(/publicacion/)
    const isOrders = matches(/pedido/)
    return { ...base, kind: 'list', andesPattern: 'news', title: isListings ? 'Publicaciones para revisar' : isOrders ? 'Pedidos pendientes' : 'Tareas pendientes', cardTitle: isListings ? 'Publicaciones' : isOrders ? 'Pedidos' : 'Pendientes', cta: 'Ver pendientes', interpretation: 'Lista basada en el patrón de contenido News', items: isListings ? [{ label: 'Pausadas', value: '3' }, { label: 'Con stock bajo', value: '2' }, { label: 'Para revisar', value: '1' }] : isOrders ? [{ label: 'Por preparar', value: '3' }, { label: 'Por enviar', value: '2' }, { label: 'Para revisar', value: '1' }] : [{ label: 'Por resolver', value: '3' }, { label: 'En seguimiento', value: '2' }, { label: 'Para revisar', value: '1' }] }
  }
  if (matches(/venta|ingreso|facturacion|monto|dinero|saldo|crecimiento|progreso|porcentaje|metrica|dato|valor/)) return { ...base, kind: 'metric', andesPattern: 'value', title: isIncome ? period === 'Hoy' ? 'Ingresos de hoy' : 'Ingresos' : isSales ? period === 'Hoy' ? 'Ventas de hoy' : 'Ventas' : 'Resultado principal', cardTitle: isIncome ? 'Tu dinero' : isSales ? 'Ventas' : 'Métricas', cta: isIncome ? 'Ver movimientos' : isSales ? 'Ver ventas' : 'Ver métricas', interpretation: 'Valor destacado con indicador' }
  return { ...base, kind: 'message', andesPattern: 'news', title: matches(/novedad/) ? 'Tienes una novedad' : 'Información para tu negocio', cardTitle: 'Novedades', cta: 'Ver detalle', support: 'Conoce los detalles de esta información.', interpretation: 'Bloque de contenido' }
}

type CardDraftResult = { config: DemoConfig; warningCount: number } | { error: string }

function fitCardText(value: string, limit: number, fallback: string) {
  const text = value.replace(/\s+/g, ' ').trim() || fallback
  return text.length <= limit ? text : `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
}

function buildTaskDraft(prompt: string, normalized: string): CardDraftResult {
  const config = createConfig(false)
  const isListings = /publicacion|anuncio|catalogo/.test(normalized)
  const isSales = /venta|pedido|envio|despacho|posventa/.test(normalized)
  const title = isListings ? 'Pendientes en tus publicaciones' : isSales ? 'Pendientes en tus ventas' : 'Pendientes para revisar'
  const cta = isListings ? 'Ver publicaciones' : isSales ? 'Ver ventas' : 'Ver pendientes'
  const taskCount = Number(prompt.match(/\b(\d{1,2})\s+(?:tareas?|pendientes?|publicaciones?|pedidos?|envios?)/i)?.[1])
  const count = Number.isFinite(taskCount) && taskCount > 0 ? taskCount : 3
  const urgent = /urgente|hoy|critica|critico|reputacion|reclamo/.test(normalized)
  const category = isListings
    ? /stock/.test(normalized) ? 'Stock y disponibilidad' : /pausad/.test(normalized) ? 'Publicaciones pausadas' : 'Publicaciones para revisar'
    : isSales
      ? /envio|despacho/.test(normalized) ? 'Envíos por resolver' : /posventa|reclamo/.test(normalized) ? 'Posventa para atender' : 'Ventas para revisar'
      : 'Tareas para resolver'
  const detail = isListings
    ? /stock/.test(normalized) ? 'Actualiza el stock de tus publicaciones' : /pausad/.test(normalized) ? 'Revisa las publicaciones pausadas' : 'Revisa el estado de tus publicaciones'
    : isSales
      ? /envio|despacho/.test(normalized) ? 'Despacha los envíos pendientes' : /posventa|reclamo/.test(normalized) ? 'Responde las consultas de posventa' : 'Revisa las ventas que requieren atención'
      : 'Revisa las tareas que requieren atención'
  const visibleTasks = Math.min(count, 4)
  const sketch: PromptSketch = {
    kind: 'list',
    andesPattern: 'news',
    title: fitCardText(category, 32, 'Pendientes para revisar'),
    cardTitle: title,
    cta: fitCardText(cta, 32, 'Ver pendientes'),
    interpretation: 'Card de tareas · estructura fija · contenido editable',
    value: '',
    change: '',
    period: '',
    support: urgent ? 'Incluye una tarea urgente para resolver hoy.' : 'Las tareas no urgentes se resuelven dentro del flujo diario.',
    direction: urgent ? 'down' : 'up',
    gaugeValue: 0,
    items: Array.from({ length: visibleTasks }, (_, index) => ({
      label: index === 0 ? detail : `Tarea pendiente ${index + 1}`,
      value: index === 0 && urgent ? `${count} urgente${count === 1 ? '' : 's'}` : String(Math.max(1, count - index)),
    })),
  }
  const warnings: string[] = []
  if (!isListings && !isSales) warnings.push('Falta definir si las tareas corresponden a publicaciones o a ventas.')
  if (!/\b\d+\b/.test(prompt)) warnings.push('Falta la cantidad real de tareas; se muestra un ejemplo editable.')
  if (/categoria nueva|nueva categoria/.test(normalized)) warnings.push('La nueva categoría debe validarse contra la Matriz de tareas de Summary.')
  if (count > 4) warnings.push('Se muestran como máximo cuatro tareas por categoría; el resto debe quedar disponible al expandirla.')
  config.ideaPrompt = prompt
  config.title = title
  config.footer = sketch.cta
  config.autoTitle = true
  config.autoFooter = true
  config.order = ['slot-1']
  config.slots['slot-1'] = { ...defaultSlot('news', true), source: 'prompt', prompt, promptApplied: true, sketch }
  return { config, warningCount: warnings.length }
}

function buildGeneralDraft(prompt: string): CardDraftResult {
  const config = createConfig(false)
  const sketch = buildPromptSketch(prompt)
  const warnings: string[] = []
  const rawTitle = sketch.cardTitle === 'Novedades' ? 'Novedades' : sketch.cardTitle || 'Nueva card'
  const rawCta = sketch.cta || 'Ver detalle'
  if (!/\b(hoy|ayer|semana|mes|d[ií]as|periodo|per[ií]odo)\b/i.test(prompt) && (sketch.kind === 'metric' || sketch.kind === 'chart')) warnings.push('Falta el período de referencia.')
  if (!/\b(\d|\$|porcentaje|tasa|monto|valor|cantidad)\b/i.test(prompt) && (sketch.kind === 'metric' || sketch.kind === 'chart')) warnings.push('Falta el valor principal; se muestra un campo editable.')
  if (rawTitle.length > 32) warnings.push('El título se ajustó al máximo de 32 caracteres.')
  if (rawCta.length > 32) warnings.push('El CTA se ajustó al máximo de 32 caracteres.')
  sketch.cardTitle = fitCardText(rawTitle, 32, 'Nueva card')
  sketch.cta = fitCardText(rawCta, 32, 'Ver detalle')
  config.ideaPrompt = prompt
  config.title = sketch.cardTitle
  config.footer = sketch.cta
  config.autoTitle = true
  config.autoFooter = true
  config.order = ['slot-1']
  const variant: SlotVariant = sketch.kind === 'message' ? 'news' : sketch.kind === 'gauge' ? 'gauge' : 'value'
  const slot = defaultSlot(variant, true)
  config.slots['slot-1'] = {
    ...slot,
    source: 'prompt',
    prompt,
    promptApplied: true,
    usesLibraryVariant: true,
    sketch,
    label: variant === 'news' ? 'NOVEDAD' : sketch.title,
    value: variant === 'news' ? sketch.title : sketch.value || 'Dato pendiente',
    description: variant === 'news' ? sketch.support : [sketch.period, sketch.support].filter(Boolean).join(' · '),
  }
  return { config, warningCount: warnings.length }
}

function buildCardDraft(prompt: string, alternativeIndex = 0): CardDraftResult {
  const normalized = prompt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const isFollowers = /mi pagina|seguidores|comunidad/.test(normalized)
  const isMetric = /ventas|ingresos|facturacion|monto|saldo|metrica|dato/.test(normalized)
  // "Catálogo" también aparece en pedidos de métricas (por ejemplo, para decidir dónde reforzarlo).
  // Solo activa la estructura fija de tareas si hay una señal concreta de pendiente o gestión operativa.
  const isTask = /tareas?|pendientes?|publicaciones?|anuncios?|pedidos?|envios?|despachos?|posventa|reclamos?|stock\s+(?:bajo|sin|agotado)|publicaciones?\s+(?:pausadas|para revisar)/.test(normalized)
  const variation = Math.abs(alternativeIndex) % 3
  if (isTask) return buildTaskDraft(prompt, normalized)
  if (!isFollowers && !isMetric) return buildGeneralDraft(prompt)

  const config = createConfig(false)
  config.ideaPrompt = prompt
  config.autoTitle = true
  config.autoFooter = true
  config.order = ['slot-1']
  const warnings: string[] = []
  const base = (kind: SketchKind, title: string, cardTitle: string, cta: string): PromptSketch => ({
    kind, andesPattern: andesPatternForSketch(kind), title, cardTitle, cta,
    interpretation: '', value: '', change: '', period: '', support: '', direction: 'up', gaugeValue: 0, items: [],
  })
  const add = (id: SlotId, sketch: PromptSketch) => {
    config.slots[id] = { ...defaultSlot(sketch.andesPattern, true), source: 'prompt', prompt, promptApplied: true, sketch }
    if (!config.order.includes(id)) config.order.push(id)
  }
  const addLibrary = (id: SlotId, variant: SlotVariant, sketch: PromptSketch) => {
    const slot = defaultSlot(variant, true)
    const isGraphic = variant === 'dataGraphic'
    const isValue = variant === 'value'
    const isNews = variant === 'news'
    const isRecommendation = variant === 'recommendationCard'
    config.slots[id] = {
      ...slot,
      source: 'prompt',
      prompt,
      promptApplied: true,
      usesLibraryVariant: true,
      sketch,
      label: isNews ? 'NOVEDAD' : isRecommendation ? sketch.title : isValue ? sketch.title : sketch.value || sketch.title,
      value: isNews || isRecommendation ? sketch.support || sketch.title : isGraphic ? sketch.change || 'Dato comparable pendiente' : sketch.value || 'Dato pendiente',
      description: isRecommendation ? sketch.cta : isGraphic ? [sketch.period || 'Inicio', 'Actual'].join(' · ') : [sketch.period, sketch.support].filter(Boolean).join(' · '),
    }
    if (!config.order.includes(id)) config.order.push(id)
  }

  if (isFollowers) {
    config.title = 'Mi página'
    config.footer = 'Ir a Mi página'
    const count = prompt.match(/\b(\d[\d.,]*)\s+seguidores\b(?!\s+(?:nuevos|compraron))/i)?.[1]
    const weak = /debil|insuficientes|no (?:tienes|hay) suficientes|pocos seguidores/.test(normalized)
    const strong = /fuerte|suficientes seguidores|buen nivel/.test(normalized) && !weak
    const status = weak ? 'Débil' : strong ? 'Fuerte' : 'Estado por definir'
    const mainKind: SketchKind = variation === 1 ? 'chart' : variation === 2 ? 'metric' : 'followers'
    const mainTitle = variation === 1 ? 'Evolución de seguidores' : variation === 2 ? 'Tu comunidad hoy' : status
    const main = base(mainKind, mainTitle, config.title, config.footer)
    main.value = count ? `${count} seguidores` : 'Seguidores: dato pendiente'
    main.support = weak ? 'No tienes suficientes seguidores' : strong ? 'Tu comunidad tiene un buen nivel' : 'Define el estado de tu comunidad'
    main.period = `Últimos ${prompt.match(/(?:ultimos|últimos)\s+(\d+)\s+dias/i)?.[1] || '30'} días`
    main.gaugeValue = weak ? 20 : strong ? 75 : 0
    main.interpretation = variation === 1 ? 'Tendencia · seguidores' : variation === 2 ? 'Métrica destacada · seguidores' : 'Dato principal · seguidores'
    if (!count) warnings.push('Falta la cantidad total de seguidores.')
    if (!weak && !strong) warnings.push('Falta definir el estado de seguidores.')
    addLibrary('slot-1', mainKind === 'followers' ? 'gauge' : mainKind === 'chart' ? 'dataGraphic' : 'value', main)

    const days = prompt.match(/(?:ultimos|últimos)\s+(\d+)\s+dias/i)?.[1] || '30'
    const newFollowers = prompt.match(/\b(\d[\d.,]*)\s+seguidores\s+nuevos\b/i)?.[1]
    const buyers = prompt.match(/\b(\d[\d.,]*)\s+seguidores\s+(?:te\s+)?compraron\b/i)?.[1]
    const period = base('period-list', `En los últimos ${days} días`, config.title, config.footer)
    period.items = [
      { label: 'Seguidores nuevos', value: newFollowers ?? '—' },
      { label: 'Seguidores que compraron', value: buyers ?? '—' },
    ]
    period.interpretation = 'Información complementaria · últimos días'
    if (!newFollowers) warnings.push('Falta la cantidad de seguidores nuevos.')
    if (!buyers) warnings.push('Falta la cantidad de seguidores que compraron.')
    add('slot-2', period)

    if (/cupon|descuento/.test(normalized) || variation > 0) {
      const hasDiscount = /cupon|descuento/.test(normalized)
      const recommendation = base('recommendation', hasDiscount ? 'Aumenta tu comunidad creando descuentos' : variation === 1 ? 'Activa tu comunidad' : 'Convierte seguidores en compradores', config.title, hasDiscount ? 'Crear cupón' : 'Ver oportunidades')
      recommendation.support = hasDiscount ? 'Ofrece un cupón exclusivo y convierte visitas en seguidores.' : variation === 1 ? 'Comparte beneficios para atraer nuevos seguidores.' : 'Revisa acciones para impulsar la primera compra.'
      recommendation.interpretation = 'Recomendación contextual · comunidad'
      addLibrary('slot-3', 'recommendationCard', recommendation)
    }
  } else {
    const isIncome = /ingresos|facturacion|monto|saldo/.test(normalized)
    const isSales = /ventas/.test(normalized)
    const subject = isIncome ? 'Ingresos' : isSales ? 'Ventas' : 'Métrica'
    const period = /hoy/.test(normalized) ? 'Hoy' : /30\s+dias|mes/.test(normalized) ? 'Últimos 30 días' : /7\s+dias|semana/.test(normalized) ? 'Últimos 7 días' : 'Período por definir'
    config.title = isIncome ? 'Tu dinero' : isSales ? 'Ventas' : 'Métricas'
    config.footer = isIncome ? 'Ver movimientos' : isSales ? 'Ver ventas' : 'Ver detalle'
    const currency = prompt.match(/(?:\$|USD\s*)\s*\d[\d.,]*/i)?.[0]
    const percent = prompt.match(/[+−-]?\d+(?:[.,]\d+)?\s*%/)?.[0]
    const directCount = prompt.match(/\b(\d[\d.,]*)\s+(?:ventas?|productos?|unidades?|pedidos?|ingresos?)\b/i)?.[1]
    const main = base('metric', period === 'Hoy' ? `${subject} de hoy` : subject, config.title, config.footer)
    main.value = currency?.replace(/\s+/g, ' ').trim() || directCount || (/(?:porcentaje|tasa)/.test(normalized) ? percent : '') || 'Dato pendiente'
    main.change = percent ? percent.replace(/\s+/g, '') : ''
    main.period = period
    main.support = /ayer/.test(normalized) ? 'vs. ayer' : ''
    main.direction = /baj|caid|disminu/.test(normalized) || main.change.startsWith('-') || main.change.startsWith('−') ? 'down' : 'up'
    main.interpretation = 'Información principal'
    if (main.value === 'Dato pendiente') warnings.push('Falta el valor de la métrica.')
    if (period === 'Período por definir') warnings.push('Falta el período de la métrica.')

    const trend = base('chart', `Evolución de ${subject.toLowerCase()}`, config.title, config.footer)
    trend.value = main.value
    trend.change = main.change
    trend.period = main.period
    trend.support = main.support
    trend.direction = main.direction
    trend.interpretation = 'Información complementaria · tendencia'

    // La card se compone por función de cada slot: dato principal, contexto y sugerencia opcional.
    if (variation === 1) {
      addLibrary('slot-1', 'dataGraphic', trend)
      addLibrary('slot-2', 'value', main)
    } else {
      addLibrary('slot-1', 'value', main)
      addLibrary('slot-2', 'dataGraphic', trend)
    }
    if (variation === 2) {
      const recommendation = base('recommendation', isIncome ? 'Planifica tus próximos movimientos' : isSales ? 'Detecta qué impulsó tus ventas' : 'Profundiza en este resultado', config.title, config.footer)
      recommendation.support = isIncome ? 'Compara ingresos y saldos antes de decidir el próximo paso.' : isSales ? 'Revisa los productos y canales con mayor crecimiento.' : 'Consulta el detalle para entender los cambios del período.'
      recommendation.interpretation = 'Recomendación contextual · siguiente paso'
      addLibrary('slot-3', 'recommendationCard', recommendation)
    }
  }

  return { config, warningCount: warnings.length }
}

function isTaskIdea(prompt: string) {
  const normalized = prompt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return /tareas?|pendientes?|publicaciones?|anuncios?|pedidos?|envios?|despachos?|posventa|reclamos?|stock\s+(?:bajo|sin|agotado)|publicaciones?\s+(?:pausadas|para revisar)/.test(normalized)
}

function isSlotVariant(value: string): value is SlotVariant {
  return Object.prototype.hasOwnProperty.call(variantNames, value)
}

function localSketchKind(variant: SlotVariant): SketchKind {
  if (variant === 'dataGraphic' || variant === 'liveMonitor') return 'chart'
  if (variant === 'gauge') return 'gauge'
  if (variant === 'reputation') return 'status'
  if (variant === 'recommendationCard') return 'recommendation'
  if (variant === 'news') return 'message'
  return 'metric'
}

function buildLocalAiDraft(prompt: string, proposal: LocalAiProposal): CardDraftResult | null {
  const slots = proposal.slots.filter((slot) => isSlotVariant(slot.variant)).slice(0, allSlotIds.length)
  if (!slots.length) return null
  const config = createConfig(false)
  config.ideaPrompt = prompt
  config.title = fitCardText(proposal.title, 32, 'Nueva card')
  config.footer = fitCardText(proposal.cta, 32, 'Ver detalle')
  config.autoTitle = true
  config.autoFooter = true
  config.order = []
  let warningCount = 0
  slots.forEach((proposalSlot, index) => {
    const id = allSlotIds[index]
    const variant = proposalSlot.variant as SlotVariant
    const defaults = defaultSlot(variant, true)
    const kind = localSketchKind(variant)
    const label = proposalSlot.label.trim() || defaults.label
    const value = proposalSlot.value.trim() || defaults.value
    const description = proposalSlot.description.trim() || defaults.description
    if (/dato por definir/i.test(`${label} ${value} ${description}`)) warningCount += 1
    const sketch: PromptSketch = {
      kind,
      andesPattern: andesPatternForSketch(kind),
      title: label,
      cardTitle: config.title,
      cta: config.footer,
      interpretation: `Propuesta local · ${proposalSlot.role || (index === 0 ? 'principal' : 'complementario')}`,
      value,
      change: variant === 'dataGraphic' ? value : '',
      period: description,
      support: description,
      direction: /baj|ca[ií]d|disminu|−|-/.test(`${label} ${value} ${description}`) ? 'down' : 'up',
      gaugeValue: 0,
      items: [],
    }
    config.slots[id] = {
      ...defaults,
      source: 'prompt',
      prompt,
      promptApplied: true,
      usesLibraryVariant: true,
      sketch,
      label,
      value,
      description,
    }
    config.order.push(id)
  })
  return { config, warningCount }
}

function draftWarnings(config: DemoConfig) {
  const warnings: string[] = []
  for (const id of config.order) {
    const sketch = config.slots[id].source === 'prompt' ? config.slots[id].sketch : null
    if (!sketch) continue
    if (sketch.value.includes('Dato pendiente') || sketch.value.includes('dato pendiente')) warnings.push(`Slot ${allSlotIds.indexOf(id) + 1}: falta un valor.`)
    if (sketch.title === 'Estado por definir') warnings.push('Slot 1: falta definir el estado.')
    if (sketch.period === 'Período por definir') warnings.push('Slot 1: falta definir el período.')
    if (sketch.kind === 'period-list' && sketch.items.some((item) => item.value === '—')) warnings.push(`Slot ${allSlotIds.indexOf(id) + 1}: faltan cifras del período.`)
  }
  return warnings
}

type CardReadiness = {
  phase: 'draft' | 'review' | 'ready'
  label: string
  detail: string
  issues: string[]
  canReview: boolean
  canShare: boolean
}

function getCardReadiness(config: DemoConfig): CardReadiness {
  const hasContent = config.order.some((id) => config.slots[id].enabled)
  const issues = [
    ...(!hasContent ? ['Agrega contenido principal.'] : []),
    ...(!config.title.trim() ? ['Define el título de la card.'] : []),
    ...(!config.footer.trim() ? ['Define la acción principal.'] : []),
    ...draftWarnings(config),
  ]
  const canReview = hasContent && Boolean(config.title.trim()) && Boolean(config.footer.trim())
  if (!canReview) return { phase: 'draft', label: 'Borrador en construcción', detail: issues[0] || 'Completa la estructura para continuar.', issues, canReview: false, canShare: false }
  if (issues.length > 0) return { phase: 'review', label: 'Listo para revisar', detail: `Faltan ${issues.length} dato${issues.length === 1 ? '' : 's'} antes de compartir.`, issues, canReview: true, canShare: false }
  return { phase: 'ready', label: 'Listo para compartir', detail: 'Contenido, título y acción están completos para esta propuesta.', issues: [], canReview: true, canShare: true }
}

function getMobileChecks(config: DemoConfig, readiness: CardReadiness) {
  return [
    { label: 'Título dentro del límite de 32 caracteres', complete: Boolean(config.title.trim()) && config.title.trim().length <= 32 },
    { label: 'Acción dentro del límite de 32 caracteres', complete: Boolean(config.footer.trim()) && config.footer.trim().length <= 32 },
    { label: 'No hay datos pendientes en la propuesta', complete: readiness.canShare },
    { label: 'La card usa hasta tres slots', complete: config.order.length <= allSlotIds.length },
  ]
}

function ReputationThermometer({ tone }: { tone: ReputationTone }) {
  return <span role="img" className={`demo-reputation-meter demo-reputation-meter--${tone}`} aria-label={`Estado ${tone === 'green' ? 'verde' : tone === 'yellow' ? 'amarillo' : 'rojo'}`}><i /><i /><i /><i /><i /></span>
}

function ExtraPatternPreview({ slot }: { slot: DemoSlot }) {
  const title = <span className="figma-slot__heading">{slot.label}</span>
  const trendRows = Array.from({ length: 4 }, (_, index) => <span className="figma-slot__trend-row" key={index}><span>{slot.value}</span><em>▲ {slot.description}</em><span className="figma-slot__chevron">›</span></span>)
  const decliningProducts = [slot.value, 'Funda iPhone 13 Silicone Case', 'Kit Celular + funda de silicona', 'Cargador rápido', 'Audífonos inalámbricos', 'Protector de pantalla', 'Soporte para auto']
  const decliningIcons = ['📱', '📱', '📱', '🔌', '🎧', '📦', '🚗']
  const opportunities = [
    { category: slot.label, name: slot.value, price: '$ 170.000', icon: '👟' },
    { category: 'Ropa y accesorios', name: 'Tenis Vans Ultrarange Neo Vr3 Original + Nf', price: '$ 250.000', icon: '👟' },
    { category: 'Accesorios', name: 'Billetera de cuero cafe con...', price: '$ 350.000', icon: '👛' },
  ]
  switch (slot.variant) {
    case 'recommendationCard': return <span className="figma-slot figma-slot--recommendation-card">
      <span className="figma-slot__recommendation-copy">
        <span className="figma-slot__recommendation-title"><img src={recommendationSparkle} alt="" /><strong>{slot.label}</strong><MoreVertical size={16} aria-hidden="true" /></span>
        <span className="figma-slot__recommendation-description">{slot.value}</span>
        <span className="figma-slot__recommendation-action">{slot.description}</span>
      </span>
      {slot.showProduct && <span className="figma-slot__recommendation-product"><span className="figma-slot__recommendation-thumbnails" aria-hidden="true"><img src={recommendationProduct} alt="" /><span>{slot.productCount}</span></span><span className="figma-slot__recommendation-product-name">{slot.productName}</span></span>}
    </span>
    case 'dataGraphic': return <span className="figma-slot figma-slot--graphic"><span className="figma-slot__graphic-axis"><span>{slot.label}</span><span>{slot.value}</span></span><span className="figma-slot__graphic-plot"><span className="figma-slot__graphic-lines"><img src={dataLines} alt="" /><span className="figma-slot__graphic-trend" style={{ maskImage: `url(${dataMask})` }}><img src={dataTrend} alt="" /></span></span><span className="figma-slot__graphic-dates"><span>{slot.description.split('·')[0]?.trim() || '22 sep.'}</span><span>{slot.description.split('·')[1]?.trim() || '29 sep.'}</span></span></span></span>
    case 'fallback': return <span className="figma-slot figma-slot--fallback"><strong>{slot.label}</strong><span>{slot.value}</span><span className="figma-slot__link">{slot.description}</span></span>
    case 'stateDescription': return <span className="figma-slot figma-slot--state">{title}<span>{slot.value}</span></span>
    case 'card': return <span className="figma-slot figma-slot--card"><img className="figma-slot__store" src={storeIllustration} alt="" /><strong>{slot.label}</strong><span>{slot.value}</span><span>{slot.description}</span><span className="figma-slot__button">Completar configuración</span></span>
    case 'benefits': return <span className="figma-slot figma-slot--benefits"><span className="figma-slot__benefits-box"><strong>{slot.label}</strong><span><i>✓</i>{slot.value}</span><span><i>✓</i>{slot.description}</span></span><strong>Comece pelos anúncios não competitivos com mais vendas:</strong><span className="figma-slot__benefit-product"><span>📱</span>Apple iPhone 17 Pro Max (256 GB)...</span><span className="figma-slot__benefit-product"><span>📱</span>Apple iPhone 16 (128 GB) - Negro</span><span className="figma-slot__benefit-product"><span>📱</span>Apple iPhone 11 (64 GB) - Blanco ...</span></span>
    case 'trendsByCategory': return <span className="figma-slot figma-slot--trends">{title}<span className="figma-slot__trend-list">{trendRows}</span></span>
    case 'decliningListings': return <span className="figma-slot figma-slot--declining">{title}<span className="figma-slot__declining-list">{decliningProducts.map((product, index) => <span className="figma-slot__declining-row" key={index}><span className="figma-slot__thumbnail" aria-hidden="true">{decliningIcons[index]}</span><span className="figma-slot__product-copy"><strong>{product}</strong><span><b>$ 1.200.000</b><em>▼ {slot.description}</em></span></span><span className="figma-slot__chevron">›</span></span>)}</span></span>
    case 'opportunities': return <span className="figma-slot figma-slot--opportunities">{opportunities.map((product, index) => <span className="figma-slot__opportunity-row" key={index}><span className="figma-slot__thumbnail" aria-hidden="true">{product.icon}</span><span className="figma-slot__product-copy"><span>{product.category}</span><strong>{product.name}</strong><b>{product.price}</b><span className="figma-slot__link">{slot.description}</span></span></span>)}</span>
    case 'liveMonitor': return <span className="figma-slot figma-slot--monitor"><strong>{slot.value}</strong><span>{slot.label}</span><span className="figma-slot__monitor-chart"><span className="figma-slot__monitor-legend"><i />Hoy <i />Ayer</span><span className="figma-slot__monitor-plot"><span className="figma-slot__monitor-axis"><span>1.3 M</span><span>650 mil</span><span>325 mil</span><span>0</span></span><span className="figma-slot__monitor-lines"><img src={monitorLines} alt="" /><img src={monitorTrends} alt="" /><span className="figma-slot__monitor-dates"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></span></span></span></span></span>
    default: return null
  }
}

function ExtraPatternEditor({ slot, onChange }: { slot: DemoSlot; onChange: (patch: Partial<DemoSlot>) => void }) {
  const [labelName, valueName, descriptionName] = extraPatternFieldNames[slot.variant as Exclude<SlotVariant, PromptPattern>]
  return <>
    <label>{labelName}<input value={slot.label} onChange={(event) => onChange({ label: event.target.value })} /></label>
    <label>{valueName}<input value={slot.value} onChange={(event) => onChange({ value: event.target.value })} /></label>
    {descriptionName && <label>{descriptionName}<input value={slot.description} onChange={(event) => onChange({ description: event.target.value })} /></label>}
  </>
}

function RecommendationCardEditor({ slot, onChange }: { slot: DemoSlot; onChange: (patch: Partial<DemoSlot>) => void }) {
  return <>
    <label>Título de la recomendación<textarea rows={3} value={slot.label} onChange={(event) => onChange({ label: event.target.value })} /></label>
    <label>Descripción<textarea rows={3} value={slot.value} onChange={(event) => onChange({ value: event.target.value })} /></label>
    <label>Texto del enlace<input value={slot.description} onChange={(event) => onChange({ description: event.target.value })} /></label>
    <label className="reputation-demo__check"><input type="checkbox" checked={slot.showProduct} onChange={(event) => onChange({ showProduct: event.target.checked })} />Mostrar producto relacionado</label>
    {slot.showProduct && <><label>Nombre del producto<input value={slot.productName} onChange={(event) => onChange({ productName: event.target.value })} /></label><label>Cantidad adicional<input value={slot.productCount} onChange={(event) => onChange({ productCount: event.target.value })} /></label></>}
  </>
}

function MetricStatusMark({ status, color }: { status: MetricStatus; color: MetricColor }) {
  const shape = color === 'accent' ? feedbackInfoShape : color === 'orange' || color === 'red' ? feedbackCautionShape : feedbackPositiveShape
  return <span className={`reputation-demo__metric-status-icon reputation-demo__metric-status-icon--${status} reputation-demo__metric-status-icon--${color}`} aria-hidden="true">{status === 'icon' && <img src={shape} alt="" />}</span>
}

function MetricStatusControl({ status, label, onChange }: { status: MetricStatus; label: string; onChange: (status: MetricStatus) => void }) {
  return <label className="reputation-demo__metric-status-field">Indicador<select aria-label={label} value={status} onChange={(event) => onChange(event.target.value as MetricStatus)}><option value="icon">Ícono</option><option value="dot">Punto</option></select></label>
}

function MetricColorControl({ color, status, label, onChange }: { color: MetricColor; status: MetricStatus; label: string; onChange: (color: MetricColor) => void }) {
  return <label className="reputation-demo__metric-status-field">Color<select aria-label={label} value={color} onChange={(event) => onChange(event.target.value as MetricColor)}><option value="accent">Azul</option><option value="green">Verde</option><option value="orange">Naranja</option><option value="red">Rojo</option>{status === 'dot' && <option value="gray">Gris</option>}</select></label>
}

function SlotPreviewContent({ slot, isGenerating = false, generationStep = 'analyzing' }: { slot: DemoSlot; isGenerating?: boolean; generationStep?: 'analyzing' | 'assembling' }) {
  if (slot.source === 'figma') return <span className="reputation-demo__figma-preview"><span className="reputation-demo__figma-mark" aria-hidden="true">F</span><strong>Diseño de Figma</strong><small>Agrega el link desde Propiedades</small></span>

  if (slot.source === 'prompt' && !slot.usesLibraryVariant) {
    if (isGenerating) return <span className="reputation-demo__prompt-loading" role="status"><span className="reputation-demo__spinner" aria-hidden="true" /><strong>{generationStep === 'analyzing' ? 'Interpretando tu idea…' : 'Armando la card…'}</strong><small>Usamos patrones de la Librería y reglas locales de Summary.</small></span>
    if (!slot.promptApplied || !slot.sketch) return <span className="reputation-demo__source-placeholder">Describe tu idea en Propiedades</span>
    const sketch = slot.sketch
    if (sketch.kind === 'followers') return <span className="reputation-demo__prompt-preview reputation-demo__followers">
      <span className="reputation-demo__followers-gauge" data-level={sketch.gaugeValue > 50 ? 'high' : sketch.gaugeValue > 0 ? 'low' : 'unknown'}><svg viewBox="0 0 220 108" aria-hidden="true"><path className="reputation-demo__sketch-gauge-track" d="M20 95 A90 90 0 0 1 200 95" /><path className="reputation-demo__sketch-gauge-fill" d={gaugeArc(sketch.gaugeValue)} /></svg><strong>{sketch.title}</strong></span>
      <span className="reputation-demo__followers-copy"><strong>{sketch.value}</strong><span>{sketch.support}</span></span>
    </span>
    if (sketch.kind === 'period-list') return <span className="reputation-demo__prompt-preview reputation-demo__period-list"><strong className="reputation-demo__sketch-title">{sketch.title}</strong>{sketch.items.map((item) => <span className="reputation-demo__period-row" key={item.label}><span aria-hidden="true">!</span><span>{item.value} {item.label.toLowerCase()}</span></span>)}</span>
    if (sketch.kind === 'recommendation') return <span className="reputation-demo__prompt-preview reputation-demo__recommendation"><strong className="reputation-demo__sketch-title"><span aria-hidden="true">✦</span> {sketch.title}</strong><span>{sketch.support}</span><span className="reputation-demo__recommendation-link">{sketch.cta}</span></span>
    const gauge = <span className="reputation-demo__sketch-gauge" data-level={sketch.gaugeValue >= 70 ? 'high' : sketch.gaugeValue >= 40 ? 'medium' : 'low'}><svg viewBox="0 0 220 108" role="img" aria-label={`Nivel ilustrativo: ${sketch.gaugeValue} de 100`}><path className="reputation-demo__sketch-gauge-track" d="M20 95 A90 90 0 0 1 200 95" /><path className="reputation-demo__sketch-gauge-fill" d={gaugeArc(sketch.gaugeValue)} /></svg><span className="reputation-demo__sketch-gauge-value"><strong>{sketch.gaugeValue}</strong><small>de 100</small></span><span className="reputation-demo__sketch-gauge-state">{sketch.gaugeValue >= 70 ? 'Nivel alto' : sketch.gaugeValue >= 40 ? 'Nivel medio' : 'Necesita atención'}</span></span>
    if (sketch.andesPattern === 'reputation') return <span className="reputation-demo__prompt-preview reputation-demo__prompt-preview--status reputation-demo__prompt-preview--andes-reputation"><strong className="reputation-demo__sketch-title">{sketch.title}</strong><span className="reputation-demo__sketch-status" data-direction={sketch.direction}><span>{sketch.direction === 'down' ? '!' : '✓'}</span>{sketch.direction === 'down' ? 'Revisa los factores que afectan tu nivel' : 'Tu reputación está en nivel alto'}</span><ReputationThermometer tone={sketch.direction === 'down' ? 'red' : 'green'} /></span>
    if (sketch.andesPattern === 'gauge') return <span className="reputation-demo__prompt-preview reputation-demo__prompt-preview--gauge reputation-demo__prompt-preview--andes-gauge"><strong className="reputation-demo__sketch-title">{sketch.title}</strong>{gauge}</span>
    if (sketch.andesPattern === 'news') return <span className="reputation-demo__prompt-preview reputation-demo__prompt-preview--message reputation-demo__prompt-preview--andes-news"><span className="reputation-demo__sketch-badge">{sketch.kind === 'list' ? 'PENDIENTES' : 'NOVEDAD'}</span><strong className="reputation-demo__sketch-title">{sketch.title}</strong>{sketch.kind === 'list' ? <span className="reputation-demo__sketch-list">{sketch.items.map((item) => <span key={item.label}><span>{item.label}</span><b>{item.value}</b></span>)}</span> : <span className="reputation-demo__sketch-copy">{sketch.support}</span>}</span>
    return <span className={`reputation-demo__prompt-preview reputation-demo__prompt-preview--${sketch.kind} reputation-demo__prompt-preview--andes-value`}>
      <strong className="reputation-demo__sketch-title">{sketch.title}</strong>
      <span className="reputation-demo__sketch-period">{sketch.period}</span>
      <span className="reputation-demo__sketch-metric"><b>{sketch.value}</b>{sketch.change && <em data-direction={sketch.direction}>{sketch.direction === 'down' ? '↘' : '↗'} {sketch.change}</em>}</span>
      {sketch.support && <span className="reputation-demo__sketch-comparison">{sketch.support}</span>}
      {sketch.kind === 'chart' && <><svg className="reputation-demo__sketch-chart" viewBox="0 0 220 76" role="img" aria-label={`Tendencia ${sketch.direction === 'down' ? 'descendente' : 'ascendente'} con datos ilustrativos`} preserveAspectRatio="none"><line x1="0" y1="62" x2="220" y2="62" /><line x1="0" y1="34" x2="220" y2="34" /><path d={sketch.direction === 'down' ? 'M0 10 C28 18 41 16 63 24 S99 31 123 37 S162 45 185 53 S206 58 220 63 L220 76 L0 76 Z' : 'M0 65 C26 57 42 60 64 52 S99 48 124 36 S164 41 187 23 S205 16 220 8 L220 76 L0 76 Z'} /><polyline points={sketch.direction === 'down' ? '0,10 32,18 64,23 96,29 128,38 160,44 192,55 220,63' : '0,65 32,58 64,53 96,50 128,35 160,39 192,21 220,8'} /><circle cx="220" cy={sketch.direction === 'down' ? '63' : '8'} r="3" /></svg><span className="reputation-demo__sketch-axis"><small>Inicio</small><small>{sketch.period === 'Hoy' ? 'Hoy' : 'Actual'}</small></span></>}
    </span>
  }

  if (slot.variant === 'reputation') return <>
    <span className="reputation-demo__reputation-title"><span className="reputation-demo__filled-heading">{slot.label || 'MercadoLíder Platinum'}</span><span className="reputation-demo__status-mark" aria-hidden="true">✓</span></span>
    {slot.description && <span className="reputation-demo__filled-detail">{slot.description}</span>}
    <ReputationThermometer tone={slot.tone} />
  </>

  if (slot.variant === 'value') return slot.columns > 1
    ? <span className="reputation-demo__metric-grid">{slot.metrics.slice(0, slot.columns).map((metric, index) => <span className="reputation-demo__metric-cell" key={index}><span className="reputation-demo__metric-value">{metric.value || '0'}<MetricStatusMark status={metric.status} color={metric.color} /></span><span className="reputation-demo__metric-label">{metric.label || 'Label'}</span></span>)}</span>
    : <><span className="reputation-demo__metric-value">{slot.value || '0.000'}<MetricStatusMark status={slot.metrics[0].status} color={slot.metrics[0].color} /></span><span className="reputation-demo__metric-label">{slot.label || 'Label'}</span>{slot.description && <span className="reputation-demo__filled-detail">{slot.description}</span>}</>

  if (slot.variant === 'gauge') return <span className="figma-slot figma-slot--gauge"><span className="figma-slot__gauge-copy"><span>{slot.label}</span><span className="figma-slot__link">{slot.value}</span></span><span className="figma-slot__gauge-art"><img src={gaugeBase} alt="" /><img src={gaugeFigmaArc} alt="" /><strong>{slot.description}</strong></span></span>

  if (slot.variant === 'news') return <span className="figma-slot figma-slot--news"><span className="figma-slot__news-top"><span>{slot.label}</span><span aria-hidden="true">×</span></span><span className="figma-slot__news-art" aria-hidden="true"><img src={newsBean} alt="" /><img src={newsScreenSmall} alt="" /><img src={newsScreenLarge} alt="" /><img src={newsShoeSmall} alt="" /><img src={newsShoeLarge} alt="" /><img src={newsEdit} alt="" /><img src={newsSparkle} alt="" /></span><strong>{slot.value}</strong><span className="figma-slot__news-description">{slot.description}</span><span className="figma-slot__link">Ir a Publicaciones</span></span>

  return <ExtraPatternPreview slot={slot} />
}

function ContextCardPreview({ config, className = '' }: { config: DemoConfig; className?: string }) {
  const configuredSlots = config.order.filter((id) => config.slots[id].enabled)
  return <article className={`reputation-demo__card reputation-demo__context-card ${className}`.trim()} aria-label={`Card ${config.title.trim() || 'sin título'} en contexto`}>
    <header className="reputation-demo__card-header"><strong>{config.title.trim() || 'Título de la card'}</strong></header>
    <div className="reputation-demo__card-body">
      {configuredSlots.map((id) => {
        const slot = config.slots[id]
        const slotNumber = allSlotIds.indexOf(id) + 1
        return <div key={id} className="reputation-demo__drop-zone">
          {slot.source === 'figma' && slot.figmaImageDataUrl
            ? <div className="reputation-demo__filled-slot reputation-demo__filled-slot--figma"><div className="reputation-demo__figma-render"><img src={slot.figmaImageDataUrl} alt={`Diseño de Figma en Slot ${slotNumber}`} /></div></div>
            : <div className={`reputation-demo__filled-slot reputation-demo__filled-slot--${slot.source === 'library' || slot.usesLibraryVariant ? slot.variant : slot.source}`} data-tone={slot.tone}><SlotPreviewContent slot={slot} /></div>}
        </div>
      })}
    </div>
    <footer className="reputation-demo__card-footer"><span>{config.footer.trim() || 'Acción pendiente'}</span><span aria-hidden="true">›</span></footer>
  </article>
}

function TemplateContextPreview({ config, compact = false }: { config: DemoConfig; compact?: boolean }) {
  return <SummaryTemplatePreview placement={config.placement} compact={compact} candidate={<ContextCardPreview config={config} />} />
}

function MobileContextPreview({ config }: { config: DemoConfig }) {
  return <section className="mobile-context" aria-label="Vista de la card adaptada a mobile">
    <div className="mobile-context__device">
      <div className="mobile-context__status" aria-hidden="true"><span>9:41</span><i /></div>
      <div className="mobile-context__topbar"><strong>Summary</strong><span aria-hidden="true">⌄</span></div>
      <div className="mobile-context__scroll">
        <p>Tu resumen</p>
        <article className="mobile-context__neighbor"><strong>Pendientes para hoy</strong><span>3 por resolver</span></article>
        <ContextCardPreview config={config} />
      </div>
    </div>
  </section>
}

function monthlyConfig({ phase, title, prompt }: MonthlyFrame) {
  const result = buildCardDraft(monthlyPrompt)
  const draft = 'config' in result ? result.config : createConfig(false)
  const next = createConfig(false)
  next.order = [...allSlotIds]
  next.title = title
  next.footer = phase >= 3 ? 'Ir a Mi página' : ''
  if (phase >= 3) next.slots['slot-1'] = { ...draft.slots['slot-1'], source: 'library', label: '10 seguidores', value: 'Ver seguidores', description: 'Débil', prompt: '', promptApplied: false }
  if (phase >= 4) {
    next.ideaPrompt = prompt
    next.slots['slot-2'] = { ...next.slots['slot-2'], source: 'prompt', enabled: phase === 5 }
  }
  if (phase >= 6) {
    next.slots = draft.slots
    next.slots['slot-1'] = { ...draft.slots['slot-1'], source: 'library', label: '10 seguidores', value: 'Ver seguidores', description: 'Débil', prompt: '', promptApplied: false }
    next.ideaPrompt = monthlyPrompt
  }
  next.placement = { column: 2, after: null }
  return next
}

export function ReputationDemoPage({ prefill = false, monthlyFrame }: { prefill?: boolean; monthlyFrame?: MonthlyFrame }) {
  const [restoredSession] = useState<StoredSession | null>(() => monthlyFrame ? null : readSavedSession(prefill))
  const [isMonthly] = useState(Boolean(monthlyFrame))
  const [savedConfig, setConfig] = useState<DemoConfig>(() => restoredSession?.config ?? createConfig(prefill))
  const config = monthlyFrame ? monthlyConfig(monthlyFrame) : savedConfig
  const [savedStage, setBuilderStage] = useState<BuilderStage>('build')
  const builderStage: BuilderStage = monthlyFrame ? monthlyFrame.phase >= 8 ? 'mobile' : monthlyFrame.phase >= 7 ? 'template' : 'build' : savedStage
  const [savedTemplateVisited, setTemplateVisited] = useState(false)
  const templateVisited = monthlyFrame ? monthlyFrame.phase >= 7 : savedTemplateVisited
  const [device, setDevice] = useState<'desktop' | 'mobile'>(() => restoredSession?.device ?? 'desktop')
  const sessionStatus = restoredSession ? 'Sesión restaurada · guardado local' : 'Guardado local en este navegador'
  const [savedSelected, setSelected] = useState<SlotId | 'title' | 'footer' | null>(null)
  const selected = monthlyFrame ? monthlyFrame.phase < 1 ? null : monthlyFrame.phase === 1 ? 'title' : monthlyFrame.phase <= 3 ? 'slot-1' : 'slot-2' : savedSelected
  const [dragOver, setDragOver] = useState<SlotId | null>(null)
  const [notice, setNotice] = useState('')
  const [figmaImportingSlot, setFigmaImportingSlot] = useState<SlotId | null>(null)
  const [figmaImportError, setFigmaImportError] = useState('')
  const [figmaNeedsConnection, setFigmaNeedsConnection] = useState(false)
  const [figmaDemoFile, setFigmaDemoFile] = useState<{ slotId: SlotId; file: File } | null>(null)
  const [savedGeneratingSlot, setGeneratingSlot] = useState<SlotId | null>(null)
  const generatingSlot = monthlyFrame ? monthlyFrame.phase === 5 ? 'slot-2' : null : savedGeneratingSlot
  const [generationStep, setGenerationStep] = useState<'analyzing' | 'assembling'>('analyzing')
  const [generatingAlternative, setGeneratingAlternative] = useState(false)
  const [ideaFeedbackOpen, setIdeaFeedbackOpen] = useState(false)
  const [localAiReady, setLocalAiReady] = useState(false)
  const generationTimers = useRef<number[]>([])
  const generationRequest = useRef(0)
  const ideaAlternativeIndex = useRef(0)
  const ideaPromptRef = useRef<HTMLTextAreaElement | null>(null)
  const stageHeadingRef = useRef<HTMLHeadingElement | null>(null)
  const contextExportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => () => { generationTimers.current.forEach(window.clearTimeout) }, [])

  useEffect(() => {
    if (isMonthly) return
    if (window.location.protocol === 'file:') return
    let active = true
    void fetch('/api/local-ai/status')
      .then((response) => response.ok ? response.json() as Promise<{ available?: boolean }> : null)
      .then((status) => { if (active) setLocalAiReady(Boolean(status?.available)) })
      .catch(() => { if (active) setLocalAiReady(false) })
    return () => { active = false }
  }, [isMonthly])

  useEffect(() => {
    if (isMonthly) return
    writeSavedSession(config, device, prefill)
  }, [config, device, prefill, isMonthly])

  useEffect(() => {
    if (builderStage === 'build') return
    window.requestAnimationFrame(() => stageHeadingRef.current?.focus())
  }, [builderStage])

  const cancelGeneration = () => {
    generationRequest.current += 1
    generationTimers.current.forEach(window.clearTimeout)
    generationTimers.current = []
    setGeneratingSlot(null)
    setGeneratingAlternative(false)
  }

  const updateSlot = (id: SlotId, patch: Partial<DemoSlot>) => {
    setConfig((current) => ({ ...current, slots: { ...current.slots, [id]: { ...current.slots[id], ...patch } } }))
  }

  const updateMetric = (id: SlotId, index: number, patch: Partial<Metric>) => {
    setConfig((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [id]: {
          ...current.slots[id],
          metrics: current.slots[id].metrics.map((metric, metricIndex) => {
            if (metricIndex !== index) return metric
            const updated = { ...metric, ...patch }
            return updated.status === 'icon' && updated.color === 'gray' ? { ...updated, color: 'green' } : updated
          }),
        },
      },
    }))
  }

  const changeValueColumns = (id: SlotId, columns: MetricColumns) => {
    setConfig((current) => {
      const slot = current.slots[id]
      const metrics = slot.metrics.map((metric, index) => index === 0 && slot.columns === 1
        ? { ...metric, value: slot.value, label: slot.label }
        : metric)
      return {
        ...current,
        slots: {
          ...current.slots,
          [id]: {
            ...slot,
            columns,
            metrics,
            value: columns === 1 ? metrics[0].value : slot.value,
            label: columns === 1 ? metrics[0].label : slot.label,
          },
        },
      }
    })
  }

  const fillSlot = (targetId: SlotId, sourceId: SlotId = targetId) => {
    setConfig((current) => ({
      ...current,
      order: current.order.includes(targetId) ? current.order : [...current.order, targetId].sort((left, right) => allSlotIds.indexOf(left) - allSlotIds.indexOf(right)).slice(0, allSlotIds.length),
      slots: { ...current.slots, [targetId]: { ...current.slots[sourceId], enabled: current.slots[sourceId].source !== 'figma' || Boolean(current.slots[sourceId].figmaImageDataUrl) } },
    }))
    setSelected(targetId)
  }

  const addSlot = () => {
    const nextId = allSlotIds.find((id) => !config.order.includes(id))
    if (!nextId) return
    setConfig((current) => ({ ...current, order: [...current.order, nextId].sort((left, right) => allSlotIds.indexOf(left) - allSlotIds.indexOf(right)).slice(0, allSlotIds.length), slots: { ...current.slots, [nextId]: defaultSlotForRole(nextId, nextId === 'slot-3' ? 'news' : 'value') } }))
    setSelected(nextId)
    setNotice(`Slot ${allSlotIds.indexOf(nextId) + 1} agregado. Elige cómo quieres construirlo.`)
  }

  const removeSlot = (id: SlotId) => {
    cancelGeneration()
    setConfig((current) => ({ ...current, order: current.order.filter((slotId) => slotId !== id) }))
    if (selected === id) setSelected(null)
    setNotice(`Slot ${allSlotIds.indexOf(id) + 1} eliminado.`)
  }

  const dropSlot = (event: DragEvent, targetId: SlotId) => {
    event.preventDefault()
    setDragOver(null)
    const sourceId = event.dataTransfer.getData('application/x-summary-slot') as SlotId
    if (allSlotIds.includes(sourceId)) fillSlot(targetId, sourceId)
  }

  const changeVariant = (id: SlotId, variant: SlotVariant) => {
    cancelGeneration()
    updateSlot(id, defaultSlotForRole(id, variant, true))
  }

  const changeSource = (id: SlotId, source: SlotSource) => {
    cancelGeneration()
    ideaAlternativeIndex.current = 0
    setConfig((current) => ({ ...current, ideaPrompt: source === 'prompt' && current.slots[id].source !== 'prompt' ? '' : current.ideaPrompt, slots: { ...current.slots, [id]: { ...current.slots[id], source, enabled: source !== 'figma' } } }))
    setFigmaImportError('')
    setFigmaNeedsConnection(false)
    setFigmaDemoFile(null)
    setNotice('')
  }

  const addFigmaDemoImage = async (id: SlotId) => {
    const file = figmaDemoFile?.slotId === id ? figmaDemoFile.file : null
    if (!file || figmaImportingSlot) return
    setFigmaImportError('')
    setFigmaNeedsConnection(false)
    setNotice('')
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setFigmaImportError('Elige una imagen PNG, JPG o WebP del frame de Figma.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFigmaImportError('La imagen supera 2 MB. Exporta el frame de Figma a escala 1x e inténtalo de nuevo.')
      return
    }
    setFigmaImportingSlot(id)
    try {
      const imageDataUrl = await blobToDataUrl(file)
      await verifyImage(imageDataUrl)
      setConfig((current) => {
        const slot = current.slots[id]
        if (slot.source !== 'figma') return current
        return { ...current, slots: { ...current.slots, [id]: { ...slot, enabled: true, figmaImageDataUrl: imageDataUrl, figmaImageSource: 'upload' } } }
      })
      setNotice('Imagen de demo agregada al Slot ' + (allSlotIds.indexOf(id) + 1) + '.')
    } catch (error) {
      setFigmaImportError(error instanceof Error ? error.message : 'No pudimos agregar la imagen al slot.')
    } finally {
      setFigmaImportingSlot(null)
    }
  }

  const addFigmaSlot = async (id: SlotId) => {
    const figmaUrl = config.slots[id].figmaUrl.trim()
    if (!validFigmaUrl(figmaUrl) || figmaImportingSlot) return
    setFigmaImportError('')
    setFigmaNeedsConnection(false)
    setNotice('')
    if (window.location.protocol === 'file:') {
      setFigmaImportError('Esta copia descargada no puede obtener imágenes de Figma. Abre el Builder web configurado para conectar tu cuenta y agregar el diseño.')
      return
    }

    setFigmaImportingSlot(id)
    try {
      const statusResponse = await fetch('/api/figma/status')
      if (!statusResponse.ok) throw new Error('La conexión con Figma no está disponible en este Builder.')
      const status = await statusResponse.json() as { configured?: boolean; connected?: boolean }
      if (!status.configured) throw new Error('No se agregó el diseño: este Builder todavía no tiene activada la conexión con Figma.')
      if (!status.connected) {
        setFigmaNeedsConnection(true)
        throw new Error('Conecta tu cuenta de Figma para poder agregar el diseño.')
      }

      const imageResponse = await fetch(`/api/figma/preview?url=${encodeURIComponent(figmaUrl)}`)
      if (imageResponse.status === 401) {
        setFigmaNeedsConnection(true)
        throw new Error('Tu conexión con Figma venció. Vuelve a conectarla e intenta agregar el diseño.')
      }
      if (!imageResponse.ok) throw new Error('No pudimos obtener la imagen. Comprueba que tienes acceso al archivo y que el enlace selecciona el frame correcto.')
      const blob = await imageResponse.blob()
      if (!blob.type.startsWith('image/')) throw new Error('Figma no devolvió una imagen para ese frame.')
      const imageDataUrl = await blobToDataUrl(blob)
      await verifyImage(imageDataUrl)
      setConfig((current) => {
        const slot = current.slots[id]
        if (slot.source !== 'figma' || slot.figmaUrl.trim() !== figmaUrl) return current
        return { ...current, slots: { ...current.slots, [id]: { ...slot, enabled: true, figmaImageDataUrl: imageDataUrl, figmaImageSource: 'api' } } }
      })
      setNotice(`Diseño agregado al Slot ${allSlotIds.indexOf(id) + 1}.`)
    } catch (error) {
      setFigmaImportError(error instanceof Error ? error.message : 'No pudimos agregar el diseño de Figma.')
    } finally {
      setFigmaImportingSlot(null)
    }
  }

  const generateSketch = async (id: SlotId, alternativeIndex = 0) => {
    const prompt = config.ideaPrompt.trim()
    if (!prompt) return
    cancelGeneration()
    const requestId = generationRequest.current + 1
    generationRequest.current = requestId
    setIdeaFeedbackOpen(false)
    setGeneratingSlot(id)
    setGeneratingAlternative(alternativeIndex > 0)
    setGenerationStep('analyzing')
    setNotice('')
    let result = buildCardDraft(prompt, alternativeIndex)
    let usedLocalAi = false
    if (!isTaskIdea(prompt) && window.location.protocol !== 'file:') {
      try {
        const response = await fetch('/api/local-ai/propose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea: prompt, alternativeIndex }),
        })
        if (response.ok) {
          const payload = await response.json() as { proposal?: LocalAiProposal }
          const localDraft = payload.proposal ? buildLocalAiDraft(prompt, payload.proposal) : null
          if (localDraft) {
            result = localDraft
            usedLocalAi = true
            setLocalAiReady(true)
          }
        }
      } catch {
        // Las reglas locales mantienen el flujo disponible si el modelo no responde.
      }
    }
    if (generationRequest.current !== requestId) return
    if ('error' in result) {
      setGeneratingSlot(null)
      setGeneratingAlternative(false)
      setNotice(result.error)
      return
    }
    generationTimers.current = [
      window.setTimeout(() => { if (generationRequest.current === requestId) setGenerationStep('assembling') }, 300),
      window.setTimeout(() => {
        if (generationRequest.current !== requestId) return
        setConfig((current) => {
          if (current.ideaPrompt.trim() !== prompt) return current
          return { ...result.config, placement: placementSuggestion(result.config).placement, placementCustomized: false }
        })
        setGeneratingSlot(null)
        setGeneratingAlternative(false)
        ideaAlternativeIndex.current = alternativeIndex
        generationTimers.current = []
        setSelected('slot-1')
        setIdeaFeedbackOpen(true)
        setNotice(result.warningCount ? 'Borrador generado. Completa los datos señalados antes de compartirlo.' : usedLocalAi ? 'Propuesta creada con IA local. Puedes editar cada parte antes de compartirla.' : 'Borrador de card listo. Puedes editar cada parte antes de compartirlo.')
      }, 700),
    ]
  }

  const keepIdeaProposal = () => {
    setIdeaFeedbackOpen(false)
    setNotice('Puedes editar cualquier parte de la propuesta.')
  }

  const tryAnotherIdea = () => {
    const nextAlternative = ideaAlternativeIndex.current + 1
    void generateSketch('slot-1', nextAlternative)
  }

  const resetDemo = () => {
    cancelGeneration()
    clearSavedSession(prefill)
    setConfig(createConfig(prefill))
    setFigmaImportError('')
    setFigmaNeedsConnection(false)
    setFigmaDemoFile(null)
    setGeneratingAlternative(false)
    ideaAlternativeIndex.current = 0
    setIdeaFeedbackOpen(false)
    setSelected(null)
    setBuilderStage('build')
    setTemplateVisited(false)
    setNotice('La demo volvió a su estado inicial.')
  }

  const exportContext = () => {
    if (!getMobileChecks(config, getCardReadiness(config)).every((check) => check.complete)) {
      setNotice('Completa las validaciones pendientes antes de descargar la revisión.')
      return
    }
    const exported = downloadContextHtml({ context: contextExportRef.current, title: config.title, styles: `${contextStyles}\n${demoStyles}` })
    setNotice(exported ? 'Se descargó un HTML con el Template desktop y su adaptación mobile.' : 'No se pudo preparar el HTML. Intenta de nuevo.')
  }

  const selectedSlot = selected && selected !== 'title' && selected !== 'footer' && config.order.includes(selected) ? selected : null
  const hasIdeaDraft = Boolean(config.ideaPrompt.trim() && config.slots['slot-1'].promptApplied)
  const hasPreviewContent = config.order.some((id) => config.slots[id].enabled)
  const readiness = monthlyFrame?.phase === 5 ? { ...getCardReadiness(config), label: 'Creando propuesta', canReview: false, canShare: false } : getCardReadiness(config)
  const suggestedPlacement = placementSuggestion(config)
  const suggestionApplied = config.placement.column === suggestedPlacement.placement.column && config.placement.after === suggestedPlacement.placement.after
  const mobileChecks = getMobileChecks(config, readiness)
  const mobileReady = mobileChecks.every((check) => check.complete)
  const templateChecks = [
    { label: 'Contenido principal configurado', complete: hasPreviewContent },
    { label: 'Título y acción definidos', complete: readiness.canReview },
    { label: 'Datos obligatorios completos', complete: readiness.canShare },
    { label: 'Card ubicada en el Template desktop', complete: true },
  ]
  const moveToTemplate = () => {
    if (!readiness.canReview) return
    if (!config.placementCustomized) setConfig((current) => ({ ...current, placement: placementSuggestion(current).placement }))
    setBuilderStage('template')
    setTemplateVisited(true)
    setNotice('Revisa ahora cómo se integra la card en el Template desktop.')
  }
  const moveToMobile = () => {
    if (!templateVisited) return
    setBuilderStage('mobile')
    setNotice('La misma configuración se adaptó a mobile para revisarla en contexto.')
  }


  return (
    <section className="reputation-demo" aria-labelledby="reputation-demo-title">
      <header className="reputation-demo__intro">
        <div>
          <p className="eyebrow">Builder · Nueva card</p>
          <h1 id="reputation-demo-title">Crea una card</h1>
          <p>Organiza la card en tres slots: información principal, información complementaria y recomendaciones contextuales.</p>
        </div>
        <div className="reputation-demo__actions">
          <button type="button" className="reputation-demo__reset" onClick={resetDemo}><RotateCcw size={14} aria-hidden="true" /> Reiniciar demo</button>
          <span className="reputation-demo__session-status" aria-live="polite">{sessionStatus}</span>
          {builderStage === 'build' && <button type="button" className="button button--primary" onClick={moveToTemplate} disabled={!readiness.canReview || generatingSlot !== null}>{readiness.phase === 'review' ? 'Ver borrador en Template' : 'Ver card en Template'}</button>}
          {builderStage === 'template' && <button type="button" className="button button--primary" onClick={moveToMobile}>Revisar adaptación mobile</button>}
          {builderStage === 'mobile' && <button type="button" className="button button--primary" onClick={exportContext} disabled={!mobileReady}>Descargar revisión</button>}
        </div>
      </header>

      <nav className="builder-flow" aria-label="Etapas de creación de la card">
        <button type="button" className={builderStage === 'build' ? 'is-current' : ''} aria-current={builderStage === 'build' ? 'step' : undefined} onClick={() => setBuilderStage('build')}><span>1</span><strong>Crear card</strong><small>{readiness.label}</small></button>
        <button type="button" className={builderStage === 'template' ? 'is-current' : ''} aria-current={builderStage === 'template' ? 'step' : undefined} onClick={moveToTemplate} disabled={!readiness.canReview}><span>2</span><strong>Ver en Template</strong><small>Revisión desktop</small></button>
        <button type="button" className={builderStage === 'mobile' ? 'is-current' : ''} aria-current={builderStage === 'mobile' ? 'step' : undefined} onClick={moveToMobile} disabled={!templateVisited}><span>3</span><strong>Adaptar a mobile</strong><small>Revisión y descarga</small></button>
      </nav>

      {builderStage === 'build' ? <>
      <div className="reputation-demo__layout">
        <aside className="reputation-demo__panel reputation-demo__palette" aria-labelledby="reputation-demo-slots-title">
          <div className="reputation-demo__panel-heading"><p className="eyebrow">1. Construye la card</p><h2 id="reputation-demo-slots-title">Slots configurados · {config.order.filter((id) => config.slots[id].enabled).length} de {config.order.length || 3}</h2><p>{config.order.length === 0 ? 'Agrega el primer slot para definir la estructura de la card.' : 'Los slots disponibles no cuentan como contenido hasta que los completes.'}</p></div>
          <ol className="reputation-demo__slot-list">
            {config.order.map((id) => {
              const slot = config.slots[id]
              const slotNumber = allSlotIds.indexOf(id) + 1
              return <li key={id} className={`reputation-demo__palette-slot${slot.enabled ? ' is-added' : ''}`} draggable onDragStart={(event) => { event.dataTransfer.setData('application/x-summary-slot', id); event.dataTransfer.effectAllowed = 'copy' }}>
                <GripVertical size={15} aria-hidden="true" />
                <span><strong>Slot {slotNumber} · {slotRoles[id].name}</strong><small className="reputation-demo__slot-purpose">{slotRoles[id].description}</small><small>Patrón: {slotContentName(slot)}{(slot.source === 'library' || slot.usesLibraryVariant) && slot.variant === 'value' ? ` · ${slot.columns} ${slot.columns === 1 ? 'columna' : 'columnas'}` : ''}</small></span>
                <button type="button" onClick={() => fillSlot(id)} aria-label={`${slot.enabled ? 'Editar' : 'Agregar'} Slot ${slotNumber}: ${slotRoles[id].name}`}>{slot.enabled ? 'Editar' : 'Agregar'}</button>
              </li>
            })}
          </ol>
          <button type="button" className="reputation-demo__add-slot" onClick={addSlot} disabled={config.order.length >= allSlotIds.length}>+ {config.order.length === 0 ? 'Agregar primer slot' : 'Agregar slot'}</button>
        </aside>

        <section className="reputation-demo__canvas reputation-demo__panel" aria-labelledby="reputation-demo-preview-title">
          <div className="reputation-demo__canvas-heading"><div><p className="eyebrow">Vista previa</p><h2 id="reputation-demo-preview-title">Card en construcción</h2></div><fieldset className="reputation-demo__device-options"><legend className="visually-hidden">Tamaño de vista previa</legend><label><input type="radio" name="reputation-demo-device" checked={device === 'desktop'} onChange={() => setDevice('desktop')} /><span>Desktop</span></label><label><input type="radio" name="reputation-demo-device" checked={device === 'mobile'} onChange={() => setDevice('mobile')} /><span>Mobile</span></label></fieldset></div>
          <div className="reputation-demo__stage" data-device={device}>
            <article className={`reputation-demo__card${hasPreviewContent ? '' : ' reputation-demo__card--empty'}`} aria-label="Vista previa de la card en construcción">
              {(hasPreviewContent || monthlyFrame) && <header className={`reputation-demo__card-header${selected === 'title' ? ' is-selected' : ''}`}>
                <label className="visually-hidden" htmlFor="reputation-demo-card-title">Título de la card</label>
                <input id="reputation-demo-card-title" value={config.title} placeholder="Título de la card" onFocus={() => setSelected('title')} onChange={(event) => setConfig((current) => ({ ...current, title: event.target.value, autoTitle: false }))} />
              </header>}
              <div className="reputation-demo__card-body">
                {config.order.map((id) => {
                  const slot = config.slots[id]
                  const slotNumber = allSlotIds.indexOf(id) + 1
                  return <div key={id} className={`reputation-demo__drop-zone${dragOver === id ? ' is-over' : ''}`} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setDragOver(id) }} onDragLeave={() => setDragOver(null)} onDrop={(event) => dropSlot(event, id)}>
                    {slot.enabled ? slot.source === 'figma' && slot.figmaImageDataUrl ? <div className={`reputation-demo__filled-slot reputation-demo__filled-slot--figma${selected === id ? ' is-selected' : ''}`} data-preview-source={slot.figmaImageSource}>
                      <div className="reputation-demo__figma-render"><img src={slot.figmaImageDataUrl} alt={`Diseño de Figma en Slot ${slotNumber}`} /></div>
                      <button type="button" className="reputation-demo__edit-figma" onClick={() => setSelected(id)} aria-label={`Editar Slot ${slotNumber}: diseño de Figma`}>Editar slot</button>
                    </div> : <button type="button" className={`reputation-demo__filled-slot reputation-demo__filled-slot--${slot.source === 'library' || slot.usesLibraryVariant ? slot.variant : slot.source}${selected === id ? ' is-selected' : ''}`} data-tone={slot.tone} onClick={() => setSelected(id)} aria-label={`Editar Slot ${slotNumber}, ${slotRoles[id].name}: ${slotContentName(slot)}`}>
                      {monthlyFrame && generatingSlot === id ? <MonthlyGeneration /> : <SlotPreviewContent slot={slot} isGenerating={generatingSlot === id} generationStep={generationStep} />}
                    </button> : <button type="button" className="reputation-demo__empty-slot" onClick={() => fillSlot(id)} aria-label={`${slotRoles[id].emptyAction} en Slot ${slotNumber}`}><span aria-hidden="true">⇄</span><span>{slotRoles[id].emptyAction}</span></button>}
                    {slot.enabled && slot.source === 'figma' && validFigmaUrl(slot.figmaUrl) && slot.figmaImageDataUrl && <a className="reputation-demo__figma-open" href={slot.figmaUrl} target="_blank" rel="noreferrer">Abrir en Figma ↗</a>}
                    <button type="button" className="reputation-demo__delete-slot" onClick={() => removeSlot(id)} aria-label={`Eliminar Slot ${slotNumber}`} title={`Eliminar Slot ${slotNumber}`}><X size={15} aria-hidden="true" /></button>
                  </div>
                })}
                {config.order.length === 0 && <div className="reputation-demo__no-slots"><strong>1. Agrega un slot</strong><span>Desde Construcción de la card.</span><strong>2. Elige su contenido</strong><span>En Propiedades, a la derecha.</span></div>}
              </div>
              {(hasPreviewContent || monthlyFrame) && <button type="button" className={`reputation-demo__card-footer${selected === 'footer' ? ' is-selected' : ''}`} onClick={() => setSelected('footer')} aria-label={config.footer || 'Configurar la acción de la card'}><span>{config.footer || 'Agregar acción'}</span><span aria-hidden="true">›</span></button>}
            </article>
          </div>
          <p className="reputation-demo__canvas-hint">Card Desktop: 270 px · Máximo tres slots. Pasa el cursor por uno para eliminarlo.</p>
        </section>

        <aside className="reputation-demo__panel reputation-demo__inspector" aria-labelledby="reputation-demo-properties-title">
          <div className="reputation-demo__panel-heading"><p className="eyebrow">2. Completa el contenido</p><h2 id="reputation-demo-properties-title">Propiedades</h2><p>{selectedSlot ? `Slot ${allSlotIds.indexOf(selectedSlot) + 1} · ${slotRoles[selectedSlot].name}` : selected === 'title' ? 'Título de la card' : selected === 'footer' ? 'Llamada a la acción' : 'Agrega y selecciona un slot para elegir su contenido.'}</p></div>
          {selectedSlot ? <div className="reputation-demo__fields">
            <fieldset className="reputation-demo__source-fields"><legend>¿Cómo quieres completar este slot?</legend><div className="reputation-demo__source-options"><label><input type="radio" name={`slot-source-${selectedSlot}`} checked={config.slots[selectedSlot].source === 'library'} onChange={() => changeSource(selectedSlot, 'library')} /><span>Librería</span></label><label><input type="radio" name={`slot-source-${selectedSlot}`} checked={config.slots[selectedSlot].source === 'figma'} onChange={() => changeSource(selectedSlot, 'figma')} /><span>Figma</span></label><label><input type="radio" name={`slot-source-${selectedSlot}`} checked={config.slots[selectedSlot].source === 'prompt'} onChange={() => changeSource(selectedSlot, 'prompt')} /><span>Mi idea</span></label></div></fieldset>
            {config.slots[selectedSlot].source === 'library' ? <>
            <label>Patrón visual<select value={config.slots[selectedSlot].variant} onChange={(event) => changeVariant(selectedSlot, event.target.value as SlotVariant)}>{Object.entries(variantNames).map(([value, name]) => <option value={value} key={value}>{name}</option>)}</select></label>
            {config.slots[selectedSlot].variant === 'recommendationCard' ? <RecommendationCardEditor slot={config.slots[selectedSlot]} onChange={(patch) => updateSlot(selectedSlot, patch)} /> : config.slots[selectedSlot].variant in extraPatternDefaults ? <ExtraPatternEditor slot={config.slots[selectedSlot]} onChange={(patch) => updateSlot(selectedSlot, patch)} /> : config.slots[selectedSlot].variant === 'value' ? <>
              <label>Columnas<select value={config.slots[selectedSlot].columns} onChange={(event) => changeValueColumns(selectedSlot, Number(event.target.value) as MetricColumns)}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></label>
              {config.slots[selectedSlot].columns > 1 ? <fieldset className="reputation-demo__metric-fields"><legend>Datos de las {config.slots[selectedSlot].columns} columnas</legend>{config.slots[selectedSlot].metrics.slice(0, config.slots[selectedSlot].columns).map((metric, index) => <div className="reputation-demo__metric-editor" key={index}><strong>Dato {index + 1}</strong><label>Valor<input value={metric.value} onChange={(event) => updateMetric(selectedSlot, index, { value: event.target.value })} /></label><label>Etiqueta<input value={metric.label} onChange={(event) => updateMetric(selectedSlot, index, { label: event.target.value })} /></label><MetricStatusControl status={metric.status} label={`Indicador del dato ${index + 1}`} onChange={(status) => updateMetric(selectedSlot, index, { status })} /><MetricColorControl color={metric.color} status={metric.status} label={`Color del dato ${index + 1}`} onChange={(color) => updateMetric(selectedSlot, index, { color })} /></div>)}</fieldset> : <><label>Valor<input value={config.slots[selectedSlot].value} onChange={(event) => updateSlot(selectedSlot, { value: event.target.value })} /></label><label>Etiqueta<input value={config.slots[selectedSlot].label} onChange={(event) => updateSlot(selectedSlot, { label: event.target.value })} /></label><MetricStatusControl status={config.slots[selectedSlot].metrics[0].status} label="Indicador del dato 1" onChange={(status) => updateMetric(selectedSlot, 0, { status })} /><MetricColorControl color={config.slots[selectedSlot].metrics[0].color} status={config.slots[selectedSlot].metrics[0].status} label="Color del dato 1" onChange={(color) => updateMetric(selectedSlot, 0, { color })} /></>}
            </> : config.slots[selectedSlot].variant === 'reputation' ? <><label>Título del estado<input value={config.slots[selectedSlot].label} onChange={(event) => updateSlot(selectedSlot, { label: event.target.value })} /></label><label>Estado<select value={config.slots[selectedSlot].tone} onChange={(event) => updateSlot(selectedSlot, { tone: event.target.value as ReputationTone })}><option value="green">Verde</option><option value="yellow">Amarillo</option><option value="red">Rojo</option></select></label><label>Texto de apoyo (opcional)<input value={config.slots[selectedSlot].description} onChange={(event) => updateSlot(selectedSlot, { description: event.target.value })} /></label></> : config.slots[selectedSlot].variant === 'gauge' ? <><label>Texto<input value={config.slots[selectedSlot].label} onChange={(event) => updateSlot(selectedSlot, { label: event.target.value })} /></label><label>Enlace<input value={config.slots[selectedSlot].value} onChange={(event) => updateSlot(selectedSlot, { value: event.target.value })} /></label><label>Estado<input value={config.slots[selectedSlot].description} onChange={(event) => updateSlot(selectedSlot, { description: event.target.value })} /></label></> : <><label>Badge<input value={config.slots[selectedSlot].label} onChange={(event) => updateSlot(selectedSlot, { label: event.target.value })} /></label><label>Título<input value={config.slots[selectedSlot].value} onChange={(event) => updateSlot(selectedSlot, { value: event.target.value })} /></label><label>Descripción<input value={config.slots[selectedSlot].description} onChange={(event) => updateSlot(selectedSlot, { description: event.target.value })} /></label></>}
            </> : config.slots[selectedSlot].source === 'figma' ? <div className="reputation-demo__free-fields">
              <label>Link al frame de Figma (opcional para la demo)
                <input type="url" value={config.slots[selectedSlot].figmaUrl} placeholder="https://www.figma.com/design/...?...node-id=..." onChange={(event) => {
                  const slot = config.slots[selectedSlot]
                  const keepDemoImage = slot.figmaImageSource === 'upload'
                  updateSlot(selectedSlot, { figmaUrl: event.target.value, enabled: keepDemoImage && slot.enabled, figmaImageDataUrl: keepDemoImage ? slot.figmaImageDataUrl : '', figmaImageSource: keepDemoImage ? 'upload' : '' })
                  setFigmaImportError('')
                  setFigmaNeedsConnection(false)
                }} aria-describedby="reputation-demo-figma-help" />
              </label>
              {config.slots[selectedSlot].figmaUrl && !validFigmaUrl(config.slots[selectedSlot].figmaUrl) && <p className="reputation-demo__field-error" role="status">Copia el enlace de un frame o componente seleccionado en un archivo de diseño de Figma.</p>}
              {validFigmaUrl(config.slots[selectedSlot].figmaUrl) && <a className="reputation-demo__figma-link" href={config.slots[selectedSlot].figmaUrl} target="_blank" rel="noreferrer">Abrir el diseño en Figma ↗</a>}
              {window.location.protocol !== 'file:' && validFigmaUrl(config.slots[selectedSlot].figmaUrl) && <button type="button" className="reputation-demo__apply-idea" disabled={figmaImportingSlot !== null} onClick={() => void addFigmaSlot(selectedSlot)}>{figmaImportingSlot === selectedSlot ? 'Agregando imagen…' : 'Agregar desde Figma a la card'}</button>}
              <div className="reputation-demo__figma-demo-upload">
                <strong>Demo en este HTML · sin conexión</strong>
                <p>Exporta el frame de Figma como PNG. Luego elige esa imagen para verla dentro de la card.</p>
                <label>Imagen del frame (PNG, JPG o WebP; máximo 2 MB)
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                    const file = event.target.files?.[0]
                    setFigmaDemoFile(file ? { slotId: selectedSlot, file } : null)
                    setFigmaImportError('')
                  }} />
                </label>
                {figmaDemoFile?.slotId === selectedSlot && <p className="reputation-demo__file-name">Seleccionada: {figmaDemoFile.file.name}</p>}
                <button type="button" className="reputation-demo__apply-idea" disabled={figmaDemoFile?.slotId !== selectedSlot || figmaImportingSlot !== null} onClick={() => void addFigmaDemoImage(selectedSlot)}>{figmaImportingSlot === selectedSlot ? 'Agregando imagen…' : 'Agregar imagen a la card'}</button>
                {config.slots[selectedSlot].enabled && config.slots[selectedSlot].figmaImageSource === 'upload' && <p role="status">Imagen de demo agregada al slot. No se obtuvo automáticamente desde el enlace.</p>}
              </div>
              {figmaImportError && <p className="reputation-demo__field-error" role="alert">{figmaImportError}</p>}
              {figmaNeedsConnection && window.location.protocol !== 'file:' && <a className="reputation-demo__figma-link" href="/api/figma/connect?returnTo=/">Conectar Figma</a>}
              <p id="reputation-demo-figma-help">{window.location.protocol === 'file:' ? 'Este HTML no descarga imágenes privadas de Figma desde el enlace. Para esta demo, usa la imagen exportada arriba.' : 'Con Figma conectado puedes agregar el diseño desde el enlace; también puedes subir una imagen para la demo.'}</p>
            </div> : <div className="reputation-demo__free-fields">
              <div className="reputation-demo__idea-intro"><h3>Convierte tu idea en una card</h3><p>Cuenta qué quieres lograr y el Builder preparará una propuesta editable con los patrones disponibles de Summary.</p><p className="reputation-demo__local-note">{localAiReady ? 'IA local activa: explora composiciones sin enviar tu idea fuera de este equipo.' : 'Motor de reglas local: usa las composiciones base de Summary.'}</p>{config.slots[selectedSlot].usesLibraryVariant && <p className="reputation-demo__local-note">Componente sugerido: <strong>{variantName(config.slots[selectedSlot].variant)}</strong> de la Librería. Sigues en Mi idea para ajustar o crear otra alternativa.</p>}</div>
              <label>Tu idea para la card<textarea ref={ideaPromptRef} rows={6} maxLength={700} placeholder={'Describe:\n• qué necesitas mostrar o resolver\n• los datos, período o comparación clave\n• la acción que debería seguir la persona'} value={config.ideaPrompt} onChange={(event) => { cancelGeneration(); ideaAlternativeIndex.current = 0; setIdeaFeedbackOpen(false); setConfig((current) => ({ ...current, ideaPrompt: event.target.value })) }} /></label>
              <p className="reputation-demo__local-note">{localAiReady ? 'La propuesta se procesa con el modelo instalado en este equipo; no se envía a un proveedor externo.' : 'La propuesta se interpreta con reglas locales de Summary.'}</p>
              <button type="button" className="reputation-demo__apply-idea" disabled={!config.ideaPrompt.trim() || generatingSlot !== null} onClick={() => void generateSketch(selectedSlot, hasIdeaDraft ? ideaAlternativeIndex.current + 1 : 0)}>{generatingSlot !== null ? 'Preparando propuesta…' : hasIdeaDraft ? 'Crear otra propuesta' : 'Crear mi propuesta'}</button>
              {draftWarnings(config).length > 0 && <div className="reputation-demo__draft-warnings" role="status"><strong>Antes de compartir, completa:</strong><ul>{draftWarnings(config).map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
            </div>}
            {config.slots[selectedSlot].source === 'prompt' && config.slots[selectedSlot].sketch && <div className="reputation-demo__free-fields reputation-demo__sketch-edit">
              <label>Título del contenido<input value={config.slots[selectedSlot].sketch.title} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, title: event.target.value } })} /></label>
              {(config.slots[selectedSlot].sketch.kind === 'metric' || config.slots[selectedSlot].sketch.kind === 'chart' || config.slots[selectedSlot].sketch.kind === 'followers') && <><label>Valor<input value={config.slots[selectedSlot].sketch.value} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, value: event.target.value } })} /></label><label>Texto de apoyo<input value={config.slots[selectedSlot].sketch.support} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, support: event.target.value } })} /></label></>}
              {config.slots[selectedSlot].sketch.kind === 'metric' && <><label>Período<input value={config.slots[selectedSlot].sketch.period} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, period: event.target.value } })} /></label><label>Variación (opcional)<input value={config.slots[selectedSlot].sketch.change} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, change: event.target.value } })} /></label></>}
              {config.slots[selectedSlot].sketch.kind === 'period-list' && config.slots[selectedSlot].sketch.items.map((item, index) => <div className="reputation-demo__draft-item" key={index}><label>Dato {index + 1}<input value={item.value} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, items: config.slots[selectedSlot].sketch!.items.map((entry, entryIndex) => entryIndex === index ? { ...entry, value: event.target.value } : entry) } })} /></label><label>Etiqueta<input value={item.label} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, items: config.slots[selectedSlot].sketch!.items.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: event.target.value } : entry) } })} /></label></div>)}
              {config.slots[selectedSlot].sketch.kind === 'recommendation' && <><label>Descripción<input value={config.slots[selectedSlot].sketch.support} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, support: event.target.value } })} /></label><label>Acción de la recomendación<input value={config.slots[selectedSlot].sketch.cta} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, cta: event.target.value } })} /></label></>}
              {config.slots[selectedSlot].sketch.kind === 'gauge' && <label>Nivel de muestra, de 0 a 100<input type="number" min="0" max="100" value={config.slots[selectedSlot].sketch.gaugeValue} onChange={(event) => updateSlot(selectedSlot, { sketch: { ...config.slots[selectedSlot].sketch!, gaugeValue: Math.max(0, Math.min(100, Number(event.target.value))) } })} /></label>}
            </div>}
            <button className="reputation-demo__remove" type="button" onClick={() => { cancelGeneration(); updateSlot(selectedSlot, { enabled: false, figmaImageDataUrl: '', figmaImageSource: '' }); setSelected(null) }}>Quitar contenido del slot</button>
          </div> : selected === 'title' ? <div className="reputation-demo__fields"><label>Título<input value={config.title} placeholder="Title" onChange={(event) => setConfig((current) => ({ ...current, title: event.target.value, autoTitle: false }))} /></label></div> : selected === 'footer' ? <div className="reputation-demo__fields"><label>Texto del CTA<input value={config.footer} onChange={(event) => setConfig((current) => ({ ...current, footer: event.target.value, autoFooter: false }))} /></label></div> : <div className="reputation-demo__inspector-empty"><strong>Primero agrega un slot desde Construcción de la card.</strong><p>Al seleccionarlo, aquí eliges si completarlo desde Librería, Figma o Mi idea.</p></div>}
        </aside>
      </div>
      <aside className={`reputation-demo__readiness reputation-demo__readiness--${readiness.phase}`} aria-live="polite">
        <strong>{readiness.label}</strong><span>{readiness.detail}</span>
        {readiness.issues.length > 0 && <ul>{readiness.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
      </aside>
      {generatingSlot && <aside className="reputation-demo__idea-agent reputation-demo__idea-agent--working" role="status" aria-live="polite"><Sparkles size={20} aria-hidden="true" /><strong>{generatingAlternative ? generationStep === 'analyzing' ? 'Pensando otra idea…' : 'Cargando la nueva propuesta…' : generationStep === 'analyzing' ? 'Entendiendo tu idea…' : 'Armando tu propuesta…'}</strong></aside>}
      {ideaFeedbackOpen && !generatingSlot && <aside className="reputation-demo__idea-agent" aria-live="polite"><Sparkles size={20} aria-hidden="true" /><div className="reputation-demo__idea-agent-copy"><strong>{readiness.phase === 'ready' ? 'Propuesta lista para compartir' : 'Borrador generado'}</strong><span>{readiness.phase === 'ready' ? 'Puedes revisarla en contexto o descargarla.' : readiness.detail}</span></div><div className="reputation-demo__idea-agent-actions"><button type="button" onClick={keepIdeaProposal}>{readiness.phase === 'ready' ? 'Conservar propuesta' : 'Completar borrador'}</button><button type="button" onClick={tryAnotherIdea}>Probar otra idea</button></div><button type="button" className="reputation-demo__idea-agent-close" onClick={() => setIdeaFeedbackOpen(false)} aria-label="Cerrar opciones de la propuesta"><X size={16} aria-hidden="true" /></button></aside>}
      </> : builderStage === 'template' ? <section className="builder-review" aria-labelledby="template-review-title">
        <header className="builder-review__intro">
          <p className="eyebrow">2. Ver en Template</p>
          <h2 id="template-review-title" ref={stageHeadingRef} tabIndex={-1}>Revisa la card dentro de Summary</h2>
          <p>Confirma la jerarquía y el espacio que ocupa junto a las demás cards antes de adaptarla a mobile.</p>
        </header>
        <div className="builder-review__layout builder-review__layout--template">
          <TemplateContextPreview config={config} />
          <aside className="builder-review__panel">
            <h3>Ubicación sugerida</h3>
            <div className="builder-review__recommendation"><strong>{placementLabel(suggestedPlacement.placement)}</strong><p>{suggestedPlacement.reason}</p><p>{suggestedPlacement.review}</p><small>{suggestionApplied ? 'Ubicación sugerida aplicada en el template' : `Ubicación actual: ${placementLabel(config.placement)}`}</small>{!suggestionApplied && <button type="button" className="builder-review__use-placement" onClick={() => setConfig((current) => ({ ...current, placement: placementSuggestion(current).placement, placementCustomized: false }))}>Usar ubicación sugerida</button>}</div>
            <p>Criterio: Guideline Summary · Organización, contrastado con este MASTER. Aquí Reputación aparece en la columna 3 y Novedades en la 4, mientras el Guideline las ubica en la 4. El orden en «Z» y la compensación de alturas dependen de las cards y medidas reales; esta ubicación se valida con Summary.</p>
            <details className="builder-review__placement-details"><summary>Ajustar posición manualmente</summary><div className="builder-review__placement"><label>Columna<select value={config.placement.column} onChange={(event) => setConfig((current) => { const column = Number(event.target.value); return { ...current, placement: { column, after: templateColumns[column][0].id }, placementCustomized: true } })}>{templateColumns.map((_, index) => <option key={index} value={index}>Columna {index + 1}</option>)}</select></label><label>Posición<select value={config.placement.after ?? templateColumns[config.placement.column][0].id} onChange={(event) => setConfig((current) => ({ ...current, placement: { ...current.placement, after: event.target.value }, placementCustomized: true }))}>{templateColumns[config.placement.column].map((card) => <option key={card.id} value={card.id}>Después de {card.label}</option>)}</select></label></div><p>Las cuatro cards iniciales del ejemplo mantienen su posición.</p></details>
            <p>La card aparece marcada en azul dentro de la grilla completa del template de Figma.</p>
            <h3>Checklist de contexto</h3>
            <ul className="builder-review__checklist">{templateChecks.map((check) => <li className={check.complete ? 'is-complete' : 'is-pending'} key={check.label}><span aria-hidden="true">{check.complete ? '✓' : '!'}</span>{check.label}</li>)}</ul>
            <p>La ubicación elegida se conserva en la revisión y en el HTML descargable. Los datos de las demás cards son ejemplos de referencia.</p>
            <button type="button" className="builder-review__back" onClick={() => setBuilderStage('build')}>Volver a editar la card</button>
            <button type="button" className="button button--primary" onClick={moveToMobile}>Revisar adaptación mobile</button>
          </aside>
        </div>
      </section> : <section className="builder-review" aria-labelledby="mobile-review-title">
        <header className="builder-review__intro">
          <p className="eyebrow">3. Adaptar a mobile</p>
          <h2 id="mobile-review-title" ref={stageHeadingRef} tabIndex={-1}>Valida la card en mobile</h2>
          <p>La adaptación parte de una sola configuración. Antes de compartir, revisa los límites que cambian la legibilidad en una columna.</p>
        </header>
        <div className="builder-review__layout builder-review__layout--mobile">
          <MobileContextPreview config={config} />
          <aside className="builder-review__panel">
            <h3>Validación mobile</h3>
            <ul className="builder-review__checklist">{mobileChecks.map((check) => <li className={check.complete ? 'is-complete' : 'is-pending'} key={check.label}><span aria-hidden="true">{check.complete ? '✓' : '!'}</span>{check.label}</li>)}</ul>
            <p>{mobileReady ? 'La propuesta puede compartirse con las vistas desktop y mobile.' : 'Vuelve a editar la card y resuelve los puntos pendientes antes de descargar.'}</p>
            <button type="button" className="builder-review__back" onClick={() => setBuilderStage('template')}>Volver al Template desktop</button>
            <button type="button" className="button button--primary" onClick={exportContext} disabled={!mobileReady}>Descargar revisión desktop y mobile</button>
          </aside>
        </div>
        <div className="builder-final-review" ref={contextExportRef}>
          <header><p>Summary Builder · Revisión contextual</p><h3>{config.title.trim() || 'Nueva card'}</h3></header>
          <div className="builder-final-review__views"><TemplateContextPreview config={config} compact /><MobileContextPreview config={config} /></div>
        </div>
      </section>}
      <p className="builder-notice" role="status" aria-live="polite">{notice}</p>
    </section>
  )
}
