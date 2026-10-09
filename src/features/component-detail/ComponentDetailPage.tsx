import { useState } from 'react'
import { StatusPill } from '../../components/ui/StatusPill'
import type { SummaryComponent } from '../../domain/summary-builder'
import { ComponentPlayground } from './ComponentPlayground'
import { ComponentGuideline } from './ComponentGuideline'
import { PublicationTasksGuideline } from './PublicationTasksGuideline'
import { PublicationTasksUseCases } from './PublicationTasksUseCases'
import { PublicationTasksTemplate } from './PublicationTasksTemplate'
import { SalesTasksGuideline } from './SalesTasksGuideline'

type Props = {
  component: SummaryComponent
  onBack: () => void
  onAddToBuilder: () => void
}

type DetailTab = 'guideline' | 'playground' | 'use-cases' | 'template'

export function ComponentDetailPage({ component, onBack, onAddToBuilder }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>('guideline')

  return (
    <section className={`page ${activeTab === 'playground' ? 'page--playground' : ''} ${activeTab === 'use-cases' ? 'page--use-cases' : ''}`}>
      <button className="text-button back" type="button" onClick={onBack}>← Volver a Librería</button>

      <article className="detail-main">
        <header className="page-header">
          <div>
            <div className="title-with-status">
              <h1>{component.name}</h1>
              <StatusPill status={component.status} />
            </div>
            <p className="lead">{component.description}</p>
            <div className="detail-meta">
              <span>Países: {component.countries.join(', ')}</span>
              <span>Responsable: {component.owner}</span>
              <span>Versión: {component.version}</span>
              <span>Actualización: {component.updatedAt}</span>
            </div>
          </div>
          <button className="button button--primary" type="button" onClick={onAddToBuilder}>Agregar al Builder</button>
        </header>

        <div className="tabs" role="tablist" aria-label="Secciones del componente">
          <button className="tab" role="tab" aria-selected={activeTab === 'guideline'} onClick={() => setActiveTab('guideline')}>Guideline</button>
          <button className="tab" role="tab" aria-selected={activeTab === 'playground'} onClick={() => setActiveTab('playground')}>Playground</button>
          <button className="tab" role="tab" aria-selected={activeTab === 'use-cases'} onClick={() => setActiveTab('use-cases')}>Casos de uso</button>
          {component.id === 'publication-tasks' && <button className="tab" role="tab" aria-selected={activeTab === 'template'} onClick={() => setActiveTab('template')}>Template</button>}
        </div>

        {activeTab === 'guideline' && (
          component.id === 'publication-tasks' ? <PublicationTasksGuideline /> : component.id === 'sales-tasks' ? <SalesTasksGuideline /> : <ComponentGuideline componentId={component.id} />
        )}

        {activeTab === 'playground' && <ComponentPlayground key={component.id} component={component} />}
        {activeTab === 'use-cases' && (component.id === 'publication-tasks' ? <PublicationTasksUseCases /> : <div className="empty-state"><strong>Casos de uso</strong><span>Esta sección se conectará con templates e implementaciones reales en el próximo incremento.</span></div>)}
        {activeTab === 'template' && component.id === 'publication-tasks' && <PublicationTasksTemplate />}
      </article>
    </section>
  )
}
