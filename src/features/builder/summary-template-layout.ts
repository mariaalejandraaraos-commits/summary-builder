export type TemplatePlacement = { column: number; after: string | null }

export const templateColumns = [
  [{ id: 'publication-tasks', label: 'Pendientes en tus publicaciones' }, { id: 'full', label: 'Full' }, { id: 'shipping-flex', label: 'Envíos Flex' }],
  [{ id: 'sales-tasks', label: 'Pendientes en tus ventas' }, { id: 'shipping-collect', label: 'Envíos con colecta' }, { id: 'shipping-turbo', label: 'Envíos Turbo' }, { id: 'billing', label: 'Facturación' }, { id: 'my-page', label: 'Mi página' }],
  [{ id: 'reputation', label: 'Reputación' }, { id: 'business-metrics', label: 'Métricas de negocio' }, { id: 'money', label: 'Tu dinero' }, { id: 'recommendations', label: 'Recomendaciones' }],
  [{ id: 'news', label: 'Novedades' }, { id: 'credits-scoring', label: 'Créditos' }, { id: 'advertising-metrics', label: 'Métricas de publicidad' }],
] as const
