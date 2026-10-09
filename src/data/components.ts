import type { SummaryComponent } from '../domain/summary-builder'

const sharedMetadata = {
  countries: ['—'],
  status: 'Borrador' as const,
  templatesCount: 0,
  owner: 'Por definir',
  version: 'v0.1',
  updatedAt: '24 sep 2026',
}

export const components: SummaryComponent[] = [
  { id: 'publication-tasks', name: 'Pendientes en tus publicaciones', description: 'Agrupa tareas relacionadas con las publicaciones.', category: 'Pendientes', ...sharedMetadata, templatesCount: 1 },
  { id: 'sales-tasks', name: 'Pendientes en tus ventas', description: 'Agrupa tareas relacionadas con ventas y operaciones.', category: 'Pendientes', ...sharedMetadata },
  { id: 'reputation', name: 'Reputación', description: 'Resume el estado de reputación de la cuenta.', category: 'Negocio', ...sharedMetadata },
  { id: 'news', name: 'Novedades', description: 'Presenta actualizaciones relevantes para la persona usuaria.', category: 'Contenido', ...sharedMetadata },
  { id: 'business-metrics', name: 'Métricas de negocio', description: 'Muestra indicadores principales del desempeño del negocio.', category: 'Métricas', ...sharedMetadata },
  { id: 'money', name: 'Tu dinero', description: 'Resume información relacionada con el dinero de la cuenta.', category: 'Finanzas', ...sharedMetadata },
  { id: 'billing', name: 'Facturación', description: 'Concentra información y acciones de facturación.', category: 'Finanzas', ...sharedMetadata },
  { id: 'shipping-collect', name: 'Envíos colecta', description: 'Muestra información operativa sobre envíos por colecta.', category: 'Logística', ...sharedMetadata },
  { id: 'shipping-flex', name: 'Envíos Flex', description: 'Muestra información operativa sobre Envíos Flex.', category: 'Logística', ...sharedMetadata },
  { id: 'full', name: 'Full', description: 'Resume el estado de la operación logística Full.', category: 'Logística', ...sharedMetadata },
  { id: 'price-competitiveness', name: 'Competitividad de precios', description: 'Muestra indicadores sobre competitividad de precios.', category: 'Negocio', ...sharedMetadata },
  { id: 'my-page', name: 'Mi página', description: 'Resume información y accesos de Mi página.', category: 'Presencia', ...sharedMetadata },
  { id: 'advertising-metrics', name: 'Métricas de publicidad', description: 'Muestra indicadores principales de publicidad.', category: 'Publicidad', ...sharedMetadata },
  { id: 'credits-scoring', name: 'Créditos /scoring', description: 'Presenta información relacionada con crédito y scoring.', category: 'Créditos', ...sharedMetadata },
  { id: 'shipping-turbo', name: 'Envíos turbo', description: 'Muestra información operativa sobre Envíos turbo.', category: 'Logística', ...sharedMetadata },
  { id: 'control-panel', name: 'Panel de control', description: 'Agrupa indicadores y accesos de seguimiento.', category: 'Gestión', ...sharedMetadata },
]
