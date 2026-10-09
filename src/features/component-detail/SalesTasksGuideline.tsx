import { CardStructureRules, OperationalGuideline } from './ComponentGuideline'

const states = [
  { name: 'Resumida', description: 'Muestra Envíos de hoy y Posventa con su métrica y ofrece “Ver más” cuando hay detalle.' },
  { name: 'Desplegada', description: 'Expone tareas, cantidades y ventanas horarias; el control cambia a “Ver menos”.' },
  { name: 'Con atención', description: 'Puede sumar un dot rojo o una pill roja según el estado recibido para el grupo o la tarea.' },
  { name: 'Error parcial', description: 'Una categoría puede mostrar reintento sin reemplazar la otra.' },
  { name: 'Error total', description: 'Mantiene el título del módulo y muestra un único fallback cuando fallan ambas categorías.' },
]

export function SalesTasksGuideline() {
  return (
    <div className="detail-layout">
      <div>
        <section className="content-section guideline-intro" id="objetivo">
          <span className="guideline-kicker">Fuente principal · HO Tareas pendientes Desktop, nodo 4:92</span>
          <h2>Reunir las tareas que requieren atención durante y después de una venta</h2>
          <p>
            “Pendientes en tus ventas” usa la misma estructura productiva de TasksCard y agrupa dos categorías: Posventa y Envíos de hoy. Cada grupo mantiene su navegación, resumen, prioridad y estado de carga de forma independiente.
          </p>
          <p className="guideline-note">Alcance confirmado: composición, contenido de ejemplo, expansión y fallbacks en Desktop. Los criterios de elegibilidad, prioridad y navegación se confirman en la definición técnica; este HO no especifica mobile.</p>
        </section>

        <section className="content-section" id="uso">
          <div className="dos-donts">
            <div className="guideline-column guideline-column--do">
              <span className="guideline-label">Usar</span>
              <h2>Cuándo usar</h2>
              <ul>
                <li>Cuando existen tareas accionables asociadas a ventas, envíos o posventa.</li>
                <li>Cuando el seller necesita distinguir urgencias de tareas operativas.</li>
                <li>Cuando cada tarea tiene un destino donde puede resolverse.</li>
              </ul>
            </div>
            <div className="guideline-column guideline-column--dont">
              <span className="guideline-label">Evitar</span>
              <h2>Cuándo no usar</h2>
              <ul>
                <li>Para tareas relacionadas con publicaciones: pertenecen a “Pendientes en tus publicaciones”.</li>
                <li>Para métricas informativas que no requieren una acción.</li>
                <li>Para explicar procesos extensos o mostrar contenido editorial.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="content-section" id="anatomia">
          <h2>Anatomía</h2>
          <p className="section-intro">La card reutiliza la anatomía productiva de TasksCard; solo cambian las categorías y los datos recibidos del proveedor.</p>
          <div className="publication-anatomy">
            <div className="publication-anatomy__preview" aria-label="Ejemplo de anatomía de Pendientes en tus ventas">
              <div className="publication-anatomy__card-title"><span className="number-marker">1</span>Pendientes en tus ventas</div>
              <div className="publication-anatomy__subcard">
                <div className="publication-anatomy__header"><span><span className="number-marker">2</span>Envíos de hoy</span><span className="publication-anatomy__dot"><span className="number-marker">6</span></span></div>
                <div className="publication-anatomy__metric"><span className="number-marker">3</span><strong>4</strong><small>Por despachar</small></div>
                <div className="publication-anatomy__task"><span><span className="number-marker">4</span>Demorados</span><span className="publication-anatomy__pill publication-anatomy__pill--quiet"><span className="number-marker">5</span>1</span></div>
                <div className="publication-anatomy__task"><span>Colecta · 11:00–13:00</span><span className="publication-anatomy__pill publication-anatomy__pill--quiet">1</span></div>
                <div className="publication-anatomy__footer"><span className="number-marker">7</span>Ver menos</div>
              </div>
            </div>
            <ol className="anatomy-list">
              <li><strong>Título de la card</strong><span>Identifica el conjunto de pendientes de ventas.</span></li>
              <li><strong>Categoría</strong><span>Distingue Posventa de Envíos de hoy.</span></li>
              <li><strong>Resumen</strong><span>Comunica el volumen total del grupo.</span></li>
              <li><strong>Tarea</strong><span>Describe una acción concreta.</span></li>
              <li><strong>Pill</strong><span>Muestra la cantidad asociada a una tarea.</span></li>
              <li><strong>Dot</strong><span>Señala atención en el grupo según el estado recibido.</span></li>
              <li><strong>Controles</strong><span>El chevron navega al dominio; “Ver más/menos” despliega o pliega las tareas.</span></li>
            </ol>
          </div>
        </section>

        <section className="content-section" id="contenido">
          <h2>Reglas del componente</h2>
          <div className="guideline-rules">
            <div><strong>2 categorías</strong><span>Envíos de hoy primero y Posventa después.</span></div>
            <div><strong>Hasta 4 tareas</strong><span>Máximo visible por categoría en la variante documentada.</span></div>
            <div><strong>1 estado por grupo</strong><span>Cada subcard controla su resumen, detalle, error y reintento.</span></div>
          </div>
          <ul className="guideline-checklist">
            <li>La señal del dot y el color de cada pill provienen de los datos; no se deduce una de la otra.</li>
            <li>Envíos de hoy conserva modalidad y ventana horaria como una sola unidad de lectura.</li>
            <li>Posventa puede reunir Reclamos y mediaciones, Devoluciones y Mensajes no leídos.</li>
            <li>El comportamiento mobile queda pendiente de una referencia específica.</li>
          </ul>
        </section>

        <OperationalGuideline componentId="sales-tasks" />

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
        <a href="#contenido">Reglas del componente</a>
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
