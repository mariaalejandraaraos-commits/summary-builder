export type ComponentStatus = 'Publicado' | 'En revisión' | 'Borrador'

export type SummaryComponent = {
  id: string
  name: string
  description: string
  category: string
  countries: string[]
  status: ComponentStatus
  templatesCount: number
  owner: string
  version: string
  updatedAt: string
}

export type Route =
  | { name: 'home' }
  | { name: 'builder' }
  | { name: 'builder-editor' }
  | { name: 'library' }
  | { name: 'component-detail'; componentId: string }
