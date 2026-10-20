export type TemplatePlacement = { column: number; after: string | null }

export type PlacementSuggestion = {
  placement: TemplatePlacement
  reason: string
  review: string
}

export const templateColumns = [
  [{ id: 'publication-tasks', label: 'Pendientes en tus publicaciones' }, { id: 'full', label: 'Full' }, { id: 'shipping-flex', label: 'Envíos Flex' }],
  [{ id: 'sales-tasks', label: 'Pendientes en tus ventas' }, { id: 'shipping-collect', label: 'Envíos con colecta' }, { id: 'shipping-turbo', label: 'Envíos Turbo' }, { id: 'billing', label: 'Facturación' }, { id: 'my-page', label: 'Mi página' }],
  [{ id: 'reputation', label: 'Reputación' }, { id: 'business-metrics', label: 'Métricas de negocio' }, { id: 'money', label: 'Tu dinero' }, { id: 'recommendations', label: 'Recomendaciones' }],
  [{ id: 'news', label: 'Novedades' }, { id: 'credits-scoring', label: 'Créditos' }, { id: 'advertising-metrics', label: 'Métricas de publicidad' }],
] as const

type PlacementInput = {
  title: string
  ideaPrompt: string
  slots: { enabled: boolean; variant: string; label: string; description: string; sketch: { kind: string; interpretation: string } | null }[]
}

// Referencia operativa: summary-guidelines/references/reglas-summary.md,
// "Ordenamiento del resumen principal", y references/casos-template.md.
// El MASTER es una instancia; no determina ranking ni elegibilidad productiva.
export function suggestTemplatePlacement({ title, ideaPrompt, slots }: PlacementInput): PlacementSuggestion {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const content = normalize([title, ideaPrompt, ...slots.filter((slot) => slot.enabled).flatMap((slot) => [slot.label, slot.description])].join(' '))
  const taskDraft = slots.some((slot) => slot.enabled && slot.sketch?.interpretation.includes('Card de tareas'))
  const taskIdea = /\b(tareas?|pendientes?|publicaciones?\s+(?:pausadas|para revisar)|pedidos?\s+pendientes?|envios?\s+pendientes?|reclamos?|posventa|stock\s+(?:bajo|sin|agotado))\b/.test(content)
  const suggest = (column: number, after: string, reason: string, review = 'La posición es una propuesta visual. Summary debe confirmar prioridad, elegibilidad y orden efectivo por site y tipo de seller.'): PlacementSuggestion => ({ placement: { column, after }, reason, review })

  // La primera card de cada columna del MASTER queda intacta. En este frame,
  // Reputación y Novedades difieren de las columnas indicadas en el Guideline.
  if (/alerta|banner|riesgo|bloqueo/.test(content)) return suggest(0, 'publication-tasks', 'Las alertas y los banners tienen prioridad en la primera columna; se conserva la card fija que abre esa columna.', 'Confirma con Summary si la señal es una alerta o banner aplicable y su prioridad frente a otras cards. La posición productiva depende del contexto.')
  if (taskDraft || taskIdea) {
    if (/publicacion|anuncio|catalogo|stock/.test(content)) return suggest(0, 'publication-tasks', 'Las tareas de publicaciones se revisan junto a Pendientes en tus publicaciones, una de las cards iniciales.', 'Antes de sumar otra card, valida si corresponde ampliar el contenido de Pendientes en tus publicaciones. La estructura de tareas se conserva.')
    return suggest(1, 'sales-tasks', 'Las tareas de ventas y posventa se revisan junto a Pendientes en tus ventas, una de las cards iniciales.', 'Antes de sumar otra card, valida si corresponde ampliar el contenido de Pendientes en tus ventas. La estructura de tareas se conserva.')
  }
  if (/reputacion|mercadolider/.test(content) || slots.some((slot) => slot.enabled && slot.variant === 'reputation')) return suggest(2, 'reputation', 'El contenido se relaciona con Reputación, que ya aparece en este MASTER.', 'El Guideline ubica Reputación en la cuarta columna, mientras este MASTER la muestra en la tercera. Valida esa diferencia y si corresponde ampliar la card existente.')
  if (/novedad|noticia|anuncio comercial/.test(content)) return suggest(3, 'news', 'El contenido editorial se revisa junto a Novedades en el MASTER.', 'Novedades es una card fija. Valida si el contenido debe entrar allí y su vigencia; su posición cambia cuando hay cuatro cards o menos.')
  if (/seguidores|comunidad|mi pagina/.test(content)) return suggest(1, 'my-page', 'La propuesta se relaciona con Mi página y queda junto a esa card del MASTER.')
  if (/publicidad|campana|ads\b|clics/.test(content)) return suggest(3, 'advertising-metrics', 'La métrica se relaciona con publicidad y queda junto a Métricas de publicidad.')
  if (/credito|score|financiamiento/.test(content)) return suggest(3, 'credits-scoring', 'La propuesta se relaciona con Créditos y queda junto a esa card.')
  if (/facturacion|deuda|vencimiento/.test(content)) return suggest(1, 'billing', 'El dato financiero se relaciona con Facturación y queda junto a esa card.')
  if (/dinero|saldo|ingreso|monto|transferencia/.test(content)) return suggest(2, 'money', 'El dato de dinero se revisa junto a Tu dinero disponible en el MASTER.')
  if (/envio|logistica|full\b|colecta|flex\b|turbo/.test(content)) return suggest(0, 'shipping-flex', 'La propuesta se relaciona con logística y queda después de las cards logísticas de la primera columna.')
  if (/recomendacion|oportunidad|sugerencia/.test(content) && !slots.some((slot) => slot.enabled && slot.sketch?.kind === 'metric')) return suggest(2, 'recommendations', 'La propuesta se relaciona con las recomendaciones del MASTER.')
  return suggest(2, 'business-metrics', 'La propuesta se lee junto a Métricas de negocio, después de las cards iniciales del MASTER.')
}

export function placementLabel(placement: TemplatePlacement) {
  const card = templateColumns[placement.column]?.find((item) => item.id === placement.after)
  return `Columna ${placement.column + 1} · ${card ? `después de ${card.label}` : 'al inicio'}`
}
