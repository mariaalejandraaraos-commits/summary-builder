// Librería Summary · Modulos mobile 2089:41670. Texts are editable Figma examples.
export const mobileCardDefinitions = {
  blocked: { name: 'Bloqueada', nodeId: '2089:41669', fields: { title: 'Title', description: 'Description blocked card' } },
  billing: { name: 'Facturación', nodeId: '2089:41668', fields: { title: 'Facturación', balance: '$ 15.000', balanceLabel: 'Saldo del periodo', closing: '23 jun 2027', closingLabel: 'Próximo cierre', pending: 'Tienes 1 período cerrado por pagar', dueDate: 'Vence el 23 jun 2021.', footer: 'Ir a Facturación' } },
  advertising: { name: 'Métricas de publicidad', nodeId: '2089:41666', fields: { title: 'Métricas de publicidad', sales: '784', salesLabel: 'Ventas por publicidad', salesChange: '20%', clicks: '1346', clicksLabel: 'Clics recibidos', clicksChange: '20%', footer: 'Ir a Publicidad' } },
  credits: { name: 'Créditos para tu negocio', nodeId: '2089:41665', fields: { title: 'Créditos para tu negocio', description: 'Mantener un buen score te ayuda a tener crédito.', gauge: 'Alto', scoreAction: 'Revisar mi score', recommendation: 'Agrega zonas y vendé hasta 15 veces más', recommendationDescription: 'Puedes crear productos de catálogo a partir de tus publicaciones.', recommendationAction: 'Ir a Modificar', footer: 'Ir a Créditos' } },
  news: { name: 'Novedades', nodeId: '2089:41667', fields: { title: 'Novedades', newsBadge1: 'IMPORTANTE', news1: 'Te regalamos $ 100.000 para promocionar tu página con Display Ads', newsBadge2: 'IMPORTANTE', news2: 'Redujimos tu máximo de Envíos Flex para ayudarte a entregar a tiempo.', footer: 'Ir a Novedades' } },
  'my-page': { name: 'Mi página', nodeId: '2089:41664', fields: { title: 'Mi página', gauge: 'Fuerte', followers: '1.500 seguidores', followersDescription: 'Sigue así y mantén tu comunidad activa', benefitsTitle: 'Sigue disfrutando de los beneficios que tienes', benefit1: 'Tarifa de venta reducida en categorías seleccionadas.', benefit2: 'Acceso a campañas con inversión de Mercado Libre.', recommendation: 'Aumenta hasta 2x tu comunidad creando descuentos', recommendationDescription: 'Ofrece un cupón exclusivo y convierte visitas en seguidores.', recommendationAction: 'Crear cupón', footer: 'Ir a Mi página' } },
  competitiveness: { name: 'Competitividad de precios', nodeId: '2089:41663', fields: { title: 'Competitividad de precios', badge: 'NUEVA', gauge: 'Fuerte', followers: '1.500 seguidores', followersDescription: 'Sigue así y mantén tu comunidad activa', benefitsTitle: 'Sigue disfrutando de los beneficios que tienes', benefit1: 'Tarifa de venta reducida en categorías seleccionadas.', benefit2: 'Acceso a campañas con inversión de Mercado Libre.', productsTitle: 'Comience con los anuncios no competitivos con más ventas:', product1: 'Apple iPhone 17 Pro Max (256 GB) - Naranja cósmico - Distribuidor Autorizado', product2: 'Apple iPhone 16 (128 GB) - Negro', product3: 'Apple iPhone 11 (64 GB) - Blanco - Aceptable (Reacondicionado)', footer: 'Ir a Anuncios' } },
} as const

export type MobileCardKind = keyof typeof mobileCardDefinitions
export type MobileCardSelection = MobileCardKind | 'free'
export type MobileCardDraft = { fields: Record<string, string>; showRecommendation: boolean; showBenefits: boolean; showBadge: boolean }
export type MobileCardsSession = { version: 1; kind: MobileCardSelection; drafts: Record<MobileCardKind, MobileCardDraft> }
export const mobileCardsStorageKey = 'summary-builder-mobile-cards-v1'
export const mobileCardKinds = Object.keys(mobileCardDefinitions) as MobileCardKind[]
export const isMobileCardSelection = (value: unknown): value is MobileCardSelection => value === 'free' || mobileCardKinds.some((kind) => kind === value)

export function createMobileCardDraft(kind: MobileCardKind): MobileCardDraft {
  return { fields: { ...mobileCardDefinitions[kind].fields }, showRecommendation: true, showBenefits: true, showBadge: true }
}

export function restoreMobileCardsSession(value: unknown): MobileCardsSession {
  const saved = value && typeof value === 'object' ? value as Partial<MobileCardsSession> : null
  const valid = saved?.version === 1
  const drafts = Object.fromEntries(mobileCardKinds.map((kind) => {
    const defaults = createMobileCardDraft(kind)
    const draft = valid ? saved.drafts?.[kind] : null
    const fields = Object.fromEntries(Object.entries(defaults.fields).map(([key, fallback]) => [key, typeof draft?.fields?.[key] === 'string' ? draft.fields[key] : fallback]))
    return [kind, {
      fields,
      showRecommendation: typeof draft?.showRecommendation === 'boolean' ? draft.showRecommendation : true,
      showBenefits: typeof draft?.showBenefits === 'boolean' ? draft.showBenefits : true,
      showBadge: typeof draft?.showBadge === 'boolean' ? draft.showBadge : true,
    }]
  })) as Record<MobileCardKind, MobileCardDraft>
  return { version: 1, kind: valid && isMobileCardSelection(saved.kind) ? saved.kind : 'free', drafts }
}

export function readMobileCardsSession(): MobileCardsSession {
  try { return restoreMobileCardsSession(JSON.parse(window.localStorage.getItem(mobileCardsStorageKey) || 'null')) }
  catch { return restoreMobileCardsSession(null) }
}

export const mobileCardFieldLabels: Record<string, string> = {
  title: 'Título', description: 'Descripción', balance: 'Saldo', balanceLabel: 'Etiqueta del saldo', closing: 'Fecha de cierre', closingLabel: 'Etiqueta del cierre', pending: 'Período pendiente', dueDate: 'Vencimiento', footer: 'Acción de la card', sales: 'Ventas', salesLabel: 'Etiqueta de ventas', salesChange: 'Variación de ventas', clicks: 'Clics', clicksLabel: 'Etiqueta de clics', clicksChange: 'Variación de clics', gauge: 'Etiqueta del indicador', scoreAction: 'Acción del score', recommendation: 'Título de recomendación', recommendationDescription: 'Descripción de recomendación', recommendationAction: 'Acción de recomendación', newsBadge1: 'Etiqueta de novedad 1', newsBadge2: 'Etiqueta de novedad 2', news1: 'Novedad 1', news2: 'Novedad 2', followers: 'Métrica de seguidores', followersDescription: 'Descripción de seguidores', benefitsTitle: 'Título de beneficios', benefit1: 'Beneficio 1', benefit2: 'Beneficio 2', badge: 'Etiqueta de la card', productsTitle: 'Título de productos', product1: 'Producto 1', product2: 'Producto 2', product3: 'Producto 3',
}
