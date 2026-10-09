import { useState } from 'react'
import { TasksCard, type PublicationTaskGroup } from './PublicationTasksCard'
import './publication-template.css'

const noop = () => undefined

const publicationGroups: PublicationTaskGroup[] = [
  { id: 'questions', title: 'Preguntas', value: '15', description: 'Por responder', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  {
    id: 'publications', title: 'Publicaciones', value: '+999', description: 'Por mejorar', summaryBadge: 'red', hasNavigation: true,
    tasks: [
      { id: 'catalog', text: 'Prioritarias para catálogo', badge: { text: '300', color: 'red' } },
      { id: 'out-of-stock', text: 'Sin stock', badge: { text: '500', color: 'red' } },
      { id: 'inactive', text: 'Inactivas por incumplir políticas', badge: { text: '200', color: 'red' } },
      { id: 'paused', text: 'Próximas a pausarse', badge: { text: '390', color: 'gray' } },
    ],
  },
  { id: 'full', title: 'Productos Full', value: '4', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'prices', title: 'Precios', value: '4', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'advertising', title: 'Publicidad', value: '20', description: 'Sugerencias', hasNavigation: true, tasks: [] },
]

const salesGroups: PublicationTaskGroup[] = [
  { id: 'post-sales', title: 'Posventa', value: '0', description: 'Por gestionar', hasNavigation: true, tasks: [] },
  {
    id: 'today-shipping', title: 'Envíos de hoy', value: '14', description: 'Por enviar', summaryBadge: 'red', hasNavigation: true,
    tasks: [
      { id: 'delayed', text: 'Demoradas', badge: { text: '14', color: 'red' } },
      { id: 'pickup', text: 'Colecta pendiente', badge: { text: '5', color: 'gray' } },
    ],
  },
]

export function PublicationTasksTemplate() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <section className="publication-template" aria-labelledby="publication-template-title">
      <header className="publication-template__intro">
        <div>
          <span className="guideline-kicker">Primer template · Layout productivo</span>
          <h2 id="publication-template-title">Pendientes al inicio del Summary</h2>
          <p>Las dos primeras cards estáticas del orden Desktop: publicaciones y ventas.</p>
        </div>
        <div className="publication-template__device-control" role="group" aria-label="Escala de revisión">
          <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>Desktop</button>
          <button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>Mobile</button>
        </div>
      </header>

      <div className="publication-template__context"><span>MCO</span><span>Vista All</span><span>ML · usuario normal</span><span>Orden de referencia: Desktop</span></div>

      <div className="publication-template__stage" data-device={device}>
        <div className="publication-template__grid">
          <section className="publication-template__item" aria-label="Posición 1 del template">
            <div className="publication-template__item-heading"><span>01</span><strong>Pendientes en tus publicaciones</strong><small>pending_pre_sales_task_card · static</small></div>
            <TasksCard title="Pendientes en tus publicaciones" groups={publicationGroups} showTitle compact={false} shortContainer onNavigate={noop} onRetry={noop} />
          </section>
          <section className="publication-template__item" aria-label="Posición 2 del template">
            <div className="publication-template__item-heading"><span>02</span><strong>Pendientes en tus ventas</strong><small>pending_pos_sales_task_card · static</small></div>
            <TasksCard title="Pendientes en tus ventas" groups={salesGroups} showTitle compact={false} shortContainer onNavigate={noop} onRetry={noop} />
          </section>
        </div>
      </div>

      <p className="publication-template__note">Fuente de orden: <code>application.json</code> del Layout API. Las métricas son fixtures de referencia documentados para estas cards y no representan datos actuales de una cuenta. La vista Mobile adapta esta maqueta; el orden documentado corresponde a Desktop.</p>
    </section>
  )
}
