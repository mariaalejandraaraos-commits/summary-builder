export type PublicationUseCaseId = 'mlb' | 'cbt-basic' | 'cbt-m4' | 'cbt-m6' | 'onboarding-locked' | 'onboarding-challenge-1' | 'onboarding-challenge-2'

export const publicationUseCaseOptions: { id: PublicationUseCaseId; group: string; label: string; description: string }[] = [
  { id: 'mlb', group: 'MLB', label: 'Venta local · Portugués', description: 'Card localizada para Brasil, con contenido y métricas en portugués.' },
  { id: 'cbt-basic', group: 'CBT', label: 'T1, T3 y T6 · Listings + Orders', description: 'Pendientes de publicaciones y pedidos en dos cards.' },
  { id: 'cbt-m4', group: 'CBT', label: 'M4 · Dentro del Summary', description: 'Pendientes junto a la card de contexto My page.' },
  { id: 'cbt-m6', group: 'CBT', label: 'M6 · Categorías con detalle', description: 'Categorías con tareas desplegadas y cantidades en inglés.' },
  { id: 'onboarding-locked', group: 'Onboarding', label: 'Acceso bloqueado', description: 'La activación de la cuenta es necesaria para acceder a los pendientes.' },
  { id: 'onboarding-challenge-1', group: 'Onboarding', label: 'Desafío 1', description: 'Invitación a crear la primera publicación.' },
  { id: 'onboarding-challenge-2', group: 'Onboarding', label: 'Desafío 2 · Dentro del Summary', description: 'Pendientes existentes y recomendación para mejorar las fotos.' },
]
