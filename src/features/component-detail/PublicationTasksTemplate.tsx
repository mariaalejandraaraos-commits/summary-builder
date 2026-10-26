import { useState } from 'react'
import chevronRight from '../../assets/publication-tasks/chevron-right.svg'
import { SummaryTemplatePreview } from '../builder/SummaryTemplatePreview'
import './publication-template.css'

const templateSource = 'https://www.figma.com/design/uWP6X6YhgX2lzgOBwyiguO/MASTER---Ajustes?node-id=41215-55158'

// This MASTER instance has its own sample data and detail labels. Keep it
// separate from the newer anatomy and the interactive Playground fixtures.
const sections = [
  { title: 'Preguntas', value: '15', description: 'Por responder', urgent: true, details: true },
  { title: 'Publicaciones', value: '135', description: 'Por mejorar', urgent: true, details: true },
  { title: 'Productos Full', value: '4', description: 'Por gestionar', urgent: true, details: true },
  { title: 'Precios', value: '4', description: 'Por gestionar', urgent: true, details: true },
  { title: 'Publicidad', value: '20', description: 'Sugerencias', urgent: false, details: false },
]

function PublicationTemplateCard() {
  return (
    <article className="publication-tasks-card publication-tasks-card--short publication-template__reference-card" aria-label="Pendientes en tus publicaciones, card resaltada">
      <h3 className="publication-tasks-card__title">Pendientes en tus publicaciones</h3>
      <div className="publication-tasks-card__list">
        {sections.map((section) => (
          <section className="task-subcard" key={section.title}>
            <div className="task-subcard__header">
              <span className="task-subcard__title">{section.title}{section.urgent && <span className="task-subcard__dot" aria-label="Requiere atención" />}</span>
              <img className="publication-template__chevron" src={chevronRight} alt="" />
            </div>
            <div className="task-subcard__metric"><strong>{section.value}</strong><span>{section.description}</span></div>
            {section.details && <div className="task-subcard__footer"><span>Más detalle</span></div>}
          </section>
        ))}
      </div>
    </article>
  )
}

export function PublicationTasksTemplate() {
  const [scale, setScale] = useState<'fit' | 'actual'>('fit')

  return (
    <section className="publication-template" aria-labelledby="publication-template-title">
      <header className="publication-template__intro">
        <div>
          <span className="guideline-kicker">Template · Desktop</span>
          <h2 id="publication-template-title">Pendientes en el contexto de Summary</h2>
          <p>La card se resalta en la primera columna del template. Las demás cards quedan atenuadas para mostrar su ubicación y qué la rodea.</p>
        </div>
        <a className="publication-template__source" href={templateSource} target="_blank" rel="noreferrer">Abrir en Figma ↗</a>
      </header>

      <div className="publication-template__toolbar">
        <div className="publication-template__context"><span>MASTER · Ajustes</span><span>1280 px · 4 columnas</span><span className="publication-template__legend"><i aria-hidden="true" />Card resaltada</span></div>
        <div className="publication-template__scale-control" role="group" aria-label="Escala del template desktop">
          <button type="button" aria-pressed={scale === 'fit'} onClick={() => setScale('fit')}>Ajustar al ancho</button>
          <button type="button" aria-pressed={scale === 'actual'} onClick={() => setScale('actual')}>100%</button>
        </div>
      </div>

      <div className="publication-template__stage">
        <SummaryTemplatePreview highlightedCardId="publication-tasks" fitToWidth={scale === 'fit'} referenceCards={{ 'publication-tasks': <PublicationTemplateCard /> }} />
      </div>

      <p className="publication-template__note">Referencia visual del MASTER con datos de ejemplo. La card reproduce esta instancia de Figma; para explorar estados e interacciones, usa Playground.</p>
    </section>
  )
}
