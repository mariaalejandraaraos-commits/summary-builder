import type { MobileReputationVariant } from './mobile-reputation'
import type { MobileSalesPillVariant } from './mobile-sales'
import type { MobileInformativeSlot } from './mobile-informative-slot'
import { createMobileInformativeSlot, resolveMobileInformativeSlot } from './mobile-informative-slot'

export type BuilderElementKind = 'card' | 'mobile-section'
export type MobileSectionKind = 'control-panel' | 'pending-tasks'
export type MobileInformativeSlotTarget = MobileSectionKind | 'control-panel-top' | 'control-panel-above'

export type ControlPanelSection = {
  kind: 'control-panel'
  name: string
  reputation: { label: string; value: string; description: string; variant?: MobileReputationVariant }
  sales: { label: string; value: string; period: string; change: string; pillVariant?: MobileSalesPillVariant }
  money: { label: string; value: string; action: string }
}

export type PendingTasksSection = {
  kind: 'pending-tasks'
  name: string
  items: { id: string; label: string; value: string; attention: boolean }[]
}

// Sections are mobile layout elements. They have their own children, not card slots.
export type MobileSection = ControlPanelSection | PendingTasksSection
export type MobileSectionDrafts = {
  'control-panel': ControlPanelSection
  'pending-tasks': PendingTasksSection
  informativeSlot?: MobileInformativeSlot
  controlPanelAboveInformativeSlot?: MobileInformativeSlot
  controlPanelTopInformativeSlot?: MobileInformativeSlot
  pendingTasksInformativeSlot?: MobileInformativeSlot
}

export function getMobileSectionInformativeSlot(drafts: MobileSectionDrafts, kind: MobileInformativeSlotTarget): MobileInformativeSlot {
  if (kind === 'control-panel') return resolveMobileInformativeSlot(drafts.informativeSlot)
  if (kind === 'control-panel-above') return resolveMobileInformativeSlot(drafts.controlPanelAboveInformativeSlot)
  const saved = kind === 'control-panel-top' ? drafts.controlPanelTopInformativeSlot : drafts.pendingTasksInformativeSlot
  return saved === undefined
    ? { ...createMobileInformativeSlot(), enabled: true }
    : resolveMobileInformativeSlot(saved)
}

export function createMobileSectionDrafts(): MobileSectionDrafts {
  return {
    'control-panel': {
      kind: 'control-panel',
      name: 'Panel de control',
      reputation: { label: 'Tu reputación', value: 'Verde claro', description: 'Así te ven tus compradores', variant: 'Verde claro' },
      sales: { label: 'Ventas brutas', value: '$ 15.000', period: 'Últimos 7 días', change: '20%', pillVariant: 'Green' },
      money: { label: 'Tu dinero', value: '$ 20.000', action: 'Adelantar $20.000' },
    },
    'pending-tasks': {
      kind: 'pending-tasks',
      name: 'Tus tareas pendientes',
      items: [
        { id: 'shipping', label: 'Envíos para hacer hoy', value: '+999', attention: true },
        { id: 'sales', label: 'Ventas por atender', value: '100', attention: true },
        { id: 'questions', label: 'Preguntas por responder', value: '123', attention: false },
        { id: 'publications', label: 'Publicaciones por mejorar', value: '38', attention: false },
        { id: 'products', label: 'Productos Full por gestionar', value: '24', attention: false },
        { id: 'advertising', label: 'Sugerencias de publicidad', value: '24', attention: false },
      ],
    },
    // New sessions start with every optional slot off. Missing keys in older
    // sessions still use their original defaults in getMobileSectionInformativeSlot.
    informativeSlot: createMobileInformativeSlot(),
    controlPanelAboveInformativeSlot: createMobileInformativeSlot(),
    controlPanelTopInformativeSlot: createMobileInformativeSlot(),
    pendingTasksInformativeSlot: createMobileInformativeSlot(),
  }
}

// Upgrade only untouched examples from the screenshot-based draft. Keep edited tasks.
export function migrateMobileSectionDrafts(drafts: MobileSectionDrafts): MobileSectionDrafts {
  const previousExamples = [
    { id: 'publications', label: 'Publicaciones para revisar', value: '38', attention: false },
    { id: 'products', label: 'Productos Full por revisar', value: '13', attention: false },
  ]
  const defaults = createMobileSectionDrafts()['pending-tasks']
  return {
    ...drafts,
    'pending-tasks': {
      ...drafts['pending-tasks'],
      items: drafts['pending-tasks'].items.map((item) => {
        const previous = previousExamples.find((example) => example.id === item.id)
        const unchanged = previous && item.label === previous.label && item.value === previous.value && item.attention === previous.attention
        return unchanged ? { ...defaults.items.find((example) => example.id === item.id)! } : item
      }),
    },
  }
}

export function isMobileSectionDrafts(value: unknown): value is MobileSectionDrafts {
  if (!value || typeof value !== 'object') return false
  const drafts = value as Partial<MobileSectionDrafts>
  const panel = drafts['control-panel']
  const tasks = drafts['pending-tasks']
  const hasStrings = (entry: unknown, keys: string[]) => entry !== null && typeof entry === 'object'
    && keys.every((key) => typeof (entry as Record<string, unknown>)[key] === 'string')
  return Boolean(panel?.kind === 'control-panel' && typeof panel.name === 'string'
    && hasStrings(panel.reputation, ['label', 'value', 'description'])
    && hasStrings(panel.sales, ['label', 'value', 'period', 'change'])
    && hasStrings(panel.money, ['label', 'value', 'action'])
    && tasks?.kind === 'pending-tasks' && typeof tasks.name === 'string'
    && Array.isArray(tasks.items) && tasks.items.length === 6
    && new Set(tasks.items.map((item) => item?.id)).size === tasks.items.length
    && tasks.items.every((item) => hasStrings(item, ['id', 'label', 'value']) && typeof item.attention === 'boolean'))
}
