import { OperationalGuideline } from './ComponentGuideline'
import { PublicationTasksAnatomy } from './PublicationTasksAnatomy'

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
          <p className="section-intro">Cinco secciones plegadas, según el <a href="https://www.figma.com/design/uWP6X6YhgX2lzgOBwyiguO/MASTER---Ajustes?node-id=41965-303239" target="_blank" rel="noreferrer">MASTER · Ajustes</a>. La estructura se conserva; los valores y las señales de atención son ejemplos de esta instancia.</p>
          <PublicationTasksAnatomy />
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

        <OperationalGuideline componentId="publication-tasks" showResponsiveAccessibility={false} />

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
        <a href="#validacion">Checklist</a>
      </aside>
    </div>
  )
}
