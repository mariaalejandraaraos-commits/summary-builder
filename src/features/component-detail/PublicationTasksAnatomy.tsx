import chevronRight from '../../assets/publication-tasks/chevron-right.svg'

const sections = [
  { title: 'Preguntas', value: '15', description: 'Por responder', expandable: false },
  { title: 'Publicaciones', value: '19', description: 'Por mejorar', expandable: true },
  { title: 'Productos Full', value: '4', description: 'Por gestionar', expandable: true },
  { title: 'Precios', value: '10', description: 'Por gestionar', expandable: true },
  { title: 'Publicidad', value: '32', description: 'Sugerencias', expandable: true },
]

function Marker({ number, position }: { number: number; position: string }) {
  return <span className={`publication-reference__marker publication-reference__marker--${position}`} aria-hidden="true">{number}</span>
}

export function PublicationTasksAnatomy() {
  return (
    <div className="publication-anatomy publication-anatomy--reference">
      <figure className="publication-reference" aria-label="Anatomía de Pendientes en tus publicaciones: cinco secciones plegadas">
        <div className="publication-tasks-card publication-tasks-card--short">
          <div className="publication-reference__title">
            <Marker number={1} position="left" />
            <span className="publication-tasks-card__title">Pendientes en tus publicaciones</span>
          </div>
          <div className="publication-tasks-card__list">
            {sections.map((section, index) => (
              <div className="publication-reference__section" key={section.title}>
                {index === 0 && <><Marker number={2} position="section" /><Marker number={3} position="dot" /><Marker number={4} position="navigation" /><Marker number={5} position="value" /><Marker number={6} position="description" /></>}
                {index === 1 && <Marker number={7} position="footer" />}
                <div className="task-subcard">
                  <div className="task-subcard__header">
                    <span className="task-subcard__title">{section.title}<span className="task-subcard__dot" /></span>
                    <span className="publication-reference__chevron"><img src={chevronRight} alt="" /></span>
                  </div>
                  <div className="task-subcard__metric"><strong>{section.value}</strong><span>{section.description}</span></div>
                  {section.expandable && <div className="task-subcard__footer"><span className="publication-reference__details">Ver más</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </figure>
      <ol className="anatomy-list">
        <li><strong>Título de la card</strong><span>Identifica el conjunto: Pendientes en tus publicaciones.</span></li>
        <li><strong>Título de la sección</strong><span>Agrupa los pendientes en Preguntas, Publicaciones, Productos Full, Precios y Publicidad.</span></li>
        <li><strong>Indicador de atención</strong><span>Dot rojo junto al título de la sección. Su presencia depende del estado recibido; todas las secciones lo muestran en este ejemplo.</span></li>
        <li><strong>Acceso a la sección</strong><span>Chevron en el encabezado para navegar al dominio correspondiente.</span></li>
        <li><strong>Totalizador</strong><span>Comunica la cantidad de pendientes de la sección. Los valores son ejemplos de Figma.</span></li>
        <li><strong>Descripción del totalizador</strong><span>Explica el dato: Por responder, Por mejorar, Por gestionar o Sugerencias.</span></li>
        <li><strong>Desglose de tareas</strong><span>“Ver más” despliega las tareas de esa sección y cambia a “Ver menos”. Preguntas no lleva este control.</span></li>
      </ol>
    </div>
  )
}
