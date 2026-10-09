import { useState } from 'react'
import { AppShell } from './components/shell/AppShell'
import { components } from './data/components'
import { ComponentDetailPage } from './features/component-detail/ComponentDetailPage'
import { ComponentsCatalogPage } from './features/catalog/ComponentsCatalogPage'
import { SummaryBuilderPage } from './features/builder/SummaryBuilderPage'
import { ReputationDemoPage } from './features/builder/ReputationDemoPage'
import { HomePage } from './features/home/HomePage'
import type { Route } from './domain/summary-builder'
import './App.css'
import './features/builder/builder.css'
import './features/home/home.css'

function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' })
  const [initialComponentId, setInitialComponentId] = useState<string | null>(null)
  const [cardDraftId, setCardDraftId] = useState(0)
  const openComponent = (componentId: string) => setRoute({ name: 'component-detail', componentId })
  const addComponent = (componentId: string) => {
    setInitialComponentId(componentId)
    setRoute({ name: 'builder-editor' })
  }
  const createCard = () => {
    setInitialComponentId(null)
    setCardDraftId((current) => current + 1)
    setRoute({ name: 'builder-editor' })
  }
  const selectedComponent = route.name === 'component-detail'
    ? components.find((component) => component.id === route.componentId) ?? components[0]
    : null

  return (
    <AppShell route={route} onNavigate={(nextRoute) => nextRoute.name === 'builder' || nextRoute.name === 'builder-editor' ? createCard() : setRoute(nextRoute)}>
      {route.name === 'home' && <HomePage onOpenBuilder={createCard} onOpenLibrary={() => setRoute({ name: 'library' })} />}
      {route.name === 'builder-editor' && (
        initialComponentId && initialComponentId !== 'reputation'
          ? <SummaryBuilderPage key={cardDraftId} components={components} initialComponentId={initialComponentId} />
          : <ReputationDemoPage key={cardDraftId} prefill={initialComponentId === 'reputation'} onOpenLibrary={() => setRoute({ name: 'library' })} />
      )}
      {route.name === 'library' && <ComponentsCatalogPage components={components} onOpenComponent={openComponent} onAddToBuilder={addComponent} />}
      {route.name === 'component-detail' && selectedComponent && (
        <ComponentDetailPage component={selectedComponent} onBack={() => setRoute({ name: 'library' })} onAddToBuilder={() => addComponent(selectedComponent.id)} />
      )}
    </AppShell>
  )
}

export default App
