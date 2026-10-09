import type { ReactNode } from 'react'
import type { Route } from '../../domain/summary-builder'

type AppShellProps = { children: ReactNode; route: Route; onNavigate: (route: Route) => void }

export function AppShell({ children, route, onNavigate }: AppShellProps) {
  const currentSection = route.name === 'library' || route.name === 'component-detail' ? 'library' : route.name === 'home' ? 'home' : 'builder'
  return (
    <div className="app-shell sa-theme" data-sa-theme="dark">
      <header className="studio-header">
        <button className="brand" type="button" onClick={() => onNavigate({ name: 'home' })} aria-label="Ir al inicio de Summary Builder"><span className="brand__mark" aria-hidden="true">S</span><span>Summary Builder</span></button>
        <nav className="studio-tabs" aria-label="Secciones principales">
          <button className="studio-tab" aria-current={currentSection === 'builder' ? 'page' : undefined} onClick={() => onNavigate({ name: 'builder' })}>Builder</button>
          <button className="studio-tab" aria-current={currentSection === 'library' ? 'page' : undefined} onClick={() => onNavigate({ name: 'library' })}>Librería</button>
        </nav>
        <button className="primary-action" type="button" onClick={() => onNavigate({ name: 'builder-editor' })}>+ Crear card</button>
      </header>
      <main className="workspace">{children}</main>
    </div>
  )
}
