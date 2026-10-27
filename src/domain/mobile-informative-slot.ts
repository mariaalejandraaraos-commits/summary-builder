export const informativeSlotStatuses = [
  { value: 'positive', label: 'Positivo · Verde' },
  { value: 'caution', label: 'Atención · Naranja' },
  { value: 'negative', label: 'Negativo · Rojo' },
  { value: 'none', label: 'No aplica · Sin ícono' },
] as const

export type MobileInformativeSlot = {
  enabled: boolean
  configured: boolean
  construction: 'free-slot' | 'informative-card'
  freeDraft?: unknown
  label: string
  title: string
  status: typeof informativeSlotStatuses[number]['value']
  description: string
  descriptionKind: 'text' | 'link'
  href: string
}

// This is a sibling layout element, not a child or card slot of ControlPanelSection.
export function createMobileInformativeSlot(): MobileInformativeSlot {
  return { enabled: false, configured: false, construction: 'free-slot', label: 'Título', title: 'Informativo', status: 'caution', description: 'Text link', descriptionKind: 'link', href: '' }
}

// Older sessions lack this element. Recover its fields without resetting edited sections.
export function resolveMobileInformativeSlot(value: unknown): MobileInformativeSlot {
  const defaults = createMobileInformativeSlot()
  if (!value || typeof value !== 'object') return defaults
  const saved = value as Record<string, unknown>
  const descriptionKind = saved.descriptionKind === 'text' || saved.descriptionKind === 'link' ? saved.descriptionKind : defaults.descriptionKind
  const defaultDescription = descriptionKind === 'link' ? 'Text link' : 'Text description'
  // Replace only the untouched account example; retain collaborators' custom copy.
  const previousExample = saved.label === 'Estado de la cuenta' && saved.title === 'En riesgo' && saved.description === 'Tienes 1 advertencia activa'
  const configured = typeof saved.configured === 'boolean' ? saved.configured : saved.enabled === true
  return {
    enabled: typeof saved.enabled === 'boolean' ? saved.enabled : defaults.enabled,
    // Previously enabled meant the content had already been configured.
    configured,
    construction: saved.construction === 'free-slot' || saved.construction === 'informative-card' ? saved.construction : configured ? 'informative-card' : 'free-slot',
    freeDraft: saved.freeDraft,
    label: previousExample ? defaults.label : typeof saved.label === 'string' ? saved.label : defaults.label,
    title: previousExample ? defaults.title : typeof saved.title === 'string' ? saved.title : defaults.title,
    status: informativeSlotStatuses.find((status) => status.value === saved.status)?.value ?? defaults.status,
    description: previousExample ? defaultDescription : typeof saved.description === 'string' ? saved.description : defaultDescription,
    descriptionKind,
    href: typeof saved.href === 'string' ? saved.href : defaults.href,
  }
}

export function informativeSlotHref(value: string): string | undefined {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}

export function isInformativeSlotComplete(slot: MobileInformativeSlot): boolean {
  return !slot.enabled || slot.construction === 'free-slot' || !slot.configured || Boolean(slot.label.trim() && slot.title.trim() && slot.description.trim()
    && (slot.descriptionKind === 'text' || !slot.href.trim() || informativeSlotHref(slot.href)))
}
