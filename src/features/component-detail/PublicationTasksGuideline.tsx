import { CardStructureRules, OperationalGuideline } from './ComponentGuideline'

const states = [
  { name: 'Resumida', description: 'Muestra categoría, métrica, etiqueta y acceso; si hay detalle disponible, ofrece “Ver más”.' },
  { name: 'Desplegada', description: 'Agrega hasta cuatro tareas con sus cantidades y cambia el control a “Ver menos”.' },
  { name: 'Con atención', description: 'Puede sumar un dot rojo en la categoría y pills rojas en las tareas señaladas por la fuente.' },
  { name: 'Error parcial', description: 'Reemplaza solo la subcard afectada por “No pudimos mostrar estos datos” y “Reintentar”.' },
  { name: 'Error total', description: 'Mantiene el título del módulo y muestra un único fallback cuando no se recupera ninguna categoría.' },
]

export function PublicationTasksGuideline() {
  return (
    <div className="detail-layout">
      <div>
        <section className="content-section guideline-intro" id="objetivo">
          <span className="guideline-kicker">Fuente principal · HO Tareas pendientes Desktop, nodo 4:92</span>
          <h2>Reunir pendientes sobre publicaciones y problemas por resolver</h2>
          <p>
            “Pendientes en tus publicaciones” incluye tareas relacionadas con el estado de las publicaciones o con problemas que requieren una acción. El contenido puede crecer con nuevas categorías y tareas, pero conserva la estructura base de la card.
          </p>
          <p className="guideline-note">Alcance confirmado: composición, orden, expansión y fallbacks en Desktop. La elegibilidad de cada categoría, su ranking y los destinos se validan con la definición técnica; mobile no se deduce de este HO.</p>
        </section>

        <section className="content-section" id="uso">
          <div className="dos-donts">
            <div className="guideline-column guideline-column--do">
              <span className="guideline-label">Usar</span>
              <h2>Cuándo usar</h2>
              <ul>
                <li>Cuando hay tareas accionables vinculadas a publicaciones.</li>
                <li>Cuando el seller necesita reconocer urgencia y volumen de pendientes.</li>
                <li>Cuando las tareas pueden agruparse en categorías claras y estables.</li>
              </ul>
            </div>
            <div className="guideline-column guideline-column--dont">
              <span className="guideline-label">Evitar</span>
              <h2>Cuándo no usar</h2>
              <ul>
                <li>Para tareas de ventas o posventa: corresponden a “Pendientes en tus ventas”.</li>
                <li>Para mostrar métricas informativas que no requieren una acción.</li>
                <li>Cuando el contenido necesita un flujo extenso o explicación contextual larga.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="content-section" id="anatomia">
          <h2>Anatomía</h2>
          <p className="section-intro">La estructura de la card se conserva; lo editable son sus categorías, tareas y señales de prioridad.</p>
          <div className="publication-anatomy">
            <div className="publication-anatomy__preview" aria-label="Ejemplo de anatomía del componente">
              <div className="publication-anatomy__card-title"><span className="number-marker">1</span>Pendientes en tus publicaciones</div>
              <div className="publication-anatomy__subcard">
                <div className="publication-anatomy__header"><span><span className="number-marker">2</span>Publicaciones</span><span className="publication-anatomy__dot"><span className="number-marker">6</span></span></div>
              <div className="publication-anatomy__metric"><span className="number-marker">3</span><strong>+999</strong><small>Por mejorar</small></div>
              <div className="publication-anatomy__task"><span><span className="number-marker">4</span>Prioritarias para catálogo</span><span className="publication-anatomy__pill publication-anatomy__pill--quiet"><span className="number-marker">5</span>300</span></div>
              <div className="publication-anatomy__task"><span>Sin stock</span><span className="publication-anatomy__pill">500</span></div>
              <div className="publication-anatomy__task"><span>Próximas a pausarse</span><span className="publication-anatomy__pill publication-anatomy__pill--quiet">390</span></div>
                <div className="publication-anatomy__footer"><span className="number-marker">7</span>Ver menos</div>
              </div>
            </div>
            <ol className="anatomy-list">
              <li><strong>Título de la card</strong><span>Identifica el conjunto de pendientes.</span></li>
              <li><strong>Categoría</strong><span>Agrupa tareas relacionadas.</span></li>
              <li><strong>Resumen</strong><span>Comunica la métrica agregada y su significado: por responder, mejorar, gestionar o sugerencias.</span></li>
              <li><strong>Tarea</strong><span>Expresa una acción concreta y dirige a su resolución.</span></li>
              <li><strong>Pill</strong><span>Muestra la cantidad asociada a una tarea.</span></li>
              <li><strong>Dot</strong><span>Señala atención en la categoría según el estado recibido.</span></li>
              <li><strong>Controles</strong><span>El chevron navega al dominio; “Ver más/menos” despliega o pliega las tareas.</span></li>
            </ol>
          </div>
        </section>

        <section className="content-section" id="contenido">
          <h2>Reglas de contenido</h2>
          <div className="guideline-rules">
            <div><strong>48 caracteres</strong><span>Máximo por tarea y hasta dos líneas.</span></div>
            <div><strong>4 tareas</strong><span>Máximo visible por categoría; mostrar solo las priorizadas.</span></div>
            <div><strong>32 caracteres</strong><span>Máximo para el nombre de una categoría y hasta dos líneas.</span></div>
          </div>
          <ul className="guideline-checklist">
            <li>Escribir tareas claras, concisas y orientadas a una acción.</li>
            <li>Definir para cada tarea un destino claro donde el seller pueda resolverla.</li>
            <li>Conservar el orden documentado: Preguntas, Publicaciones, Productos Full, Precios y Publicidad.</li>
            <li>No calcular la métrica agregada sumando las pills visibles: se muestra el valor recibido.</li>
          </ul>
        </section>

        <section className="content-section" id="prioridad">
          <h2>Prioridad y urgencia</h2>
          <div className="priority-grid">
            <div className="priority-card priority-card--urgent"><span className="priority-dot" /><div><strong>Urgente</strong><p>Requiere resolución el mismo día porque puede afectar la reputación, la satisfacción del cliente u otro indicador crítico.</p></div></div>
            <div className="priority-card"><span className="priority-dot priority-dot--quiet" /><div><strong>No urgente</strong><p>Puede resolverse dentro del flujo diario normal. No debe competir visualmente con una tarea crítica.</p></div></div>
          </div>
          <p className="guideline-note">Usar la urgencia con criterio: si todo se marca como urgente, la señal deja de ayudar a priorizar.</p>
        </section>

        <OperationalGuideline componentId="publication-tasks" />

        <CardStructureRules />

        <section className="content-section" id="estados">
          <h2>Variantes y estados</h2>
          <div className="publication-states">
            {states.map((state) => <div className="publication-state" key={state.name}><span className="publication-state__sample" aria-hidden="true"><i /><i /><i /></span><strong>{state.name}</strong><p>{state.description}</p></div>)}
          </div>
        </section>

      </div>
      <aside className="detail-index" aria-label="En esta guía">
        <strong>En esta guía</strong>
        <a href="#objetivo">Objetivo</a>
        <a href="#uso">Cuándo usar</a>
        <a href="#anatomia">Anatomía</a>
        <a href="#contenido">Reglas de contenido</a>
        <a href="#prioridad">Prioridad y urgencia</a>
        <a href="#logica">Lógica y condiciones</a>
        <a href="#datos-comportamiento">Datos y comportamiento</a>
        <a href="#responsive-accesibilidad">Responsive y accesibilidad</a>
        <a href="#validacion">Checklist</a>
        <a href="#transversales">Reglas transversales</a>
        <a href="#estados">Variantes y estados</a>
      </aside>
    </div>
  )
}
