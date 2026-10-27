import { useState } from 'react'
import type { SummaryComponent } from '../../domain/summary-builder'
import { TasksCard, type PublicationTaskGroup } from './PublicationTasksCard'
import { PublicationUseCasePreview } from './PublicationTasksUseCases'
import { publicationUseCaseOptions, type PublicationUseCaseId } from './PublicationUseCaseOptions'

const groups: PublicationTaskGroup[] = [
  { id: 'question_task_card', title: 'Preguntas', value: '15', description: 'Por responder', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  { id: 'publication_task_card', title: 'Publicaciones', value: '19', description: 'Por mejorar', summaryBadge: 'red', hasNavigation: true, tasks: [
    { id: 'publication-catalog', text: 'Prioritarias para catálogo', badge: { text: '5', color: 'red' } },
    { id: 'publication-stock', text: 'Sin stock', badge: { text: '7', color: 'red' } },
    { id: 'publication-policy', text: 'Inactivas por incumplir políticas', badge: { text: '4', color: 'red' } },
    { id: 'publication-pausing', text: 'Próximas a pausarse', badge: { text: '3', color: 'gray' } },
  ], hideTasksUntilExpanded: true, showDetailsAction: true, detailsLabel: 'Ver más' },
  { id: 'full_task_card', title: 'Productos Full', value: '4', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [
    { id: 'full-stock', text: 'Productos con stock bajo', badge: { text: '2', color: 'red' } },
    { id: 'full-reception', text: 'Ingresos pendientes', badge: { text: '2', color: 'gray' } },
  ], hideTasksUntilExpanded: true, showDetailsAction: true, detailsLabel: 'Ver más' },
  { id: 'pricing_automation_task_card', title: 'Precios', value: '10', description: 'Por gestionar', summaryBadge: 'red', hasNavigation: true, tasks: [
    { id: 'pricing-competition', text: 'Precios poco competitivos', badge: { text: '6', color: 'red' } },
    { id: 'pricing-rules', text: 'Reglas por revisar', badge: { text: '4', color: 'gray' } },
  ], hideTasksUntilExpanded: true, showDetailsAction: true, detailsLabel: 'Ver más' },
  { id: 'advertising_task_card', title: 'Publicidad', value: '32', description: 'Sugerencias', summaryBadge: 'red', hasNavigation: true, tasks: [
    { id: 'advertising-budget', text: 'Campañas para optimizar', badge: { text: '12', color: 'red' } },
    { id: 'advertising-opportunities', text: 'Oportunidades de crecimiento', badge: { text: '20', color: 'gray' } },
  ], hideTasksUntilExpanded: true, showDetailsAction: true, detailsLabel: 'Ver más' },
]

const defaultGroupId = 'publication_task_card'

function ExplorerToggle({ label, checked, disabled = false, onChange }: { label: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
  return <label className={`playground-toggle ${disabled ? 'publication-explorer__toggle--disabled' : ''}`}>
    <span>{label}</span>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    <span className="playground-toggle__track" aria-hidden="true"><span /></span>
  </label>
}

export function PublicationTasksPlayground({ component }: { component: SummaryComponent }) {
  const [mode, setMode] = useState<'states' | 'use-cases'>('states')
  const [useCaseId, setUseCaseId] = useState<PublicationUseCaseId>('mlb')
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId)
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null)
  const [noUrgent, setNoUrgent] = useState(false)
  const [emptyGroups, setEmptyGroups] = useState<Set<string>>(new Set())
  const [errorGroups, setErrorGroups] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState('Elige una sección y cambia sus condiciones, o usa «Ver más» directamente en la card.')

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[1]
  const activeUseCase = publicationUseCaseOptions.find((item) => item.id === useCaseId) ?? publicationUseCaseOptions[0]
  const selectedEmpty = emptyGroups.has(selectedGroupId)
  const selectedError = errorGroups.has(selectedGroupId)
  const visibleGroups = groups.map((group) => ({
    ...group,
    value: emptyGroups.has(group.id) ? '0' : group.value,
    fallback: errorGroups.has(group.id),
    fallbackStyle: errorGroups.has(group.id) ? 'panel' as const : undefined,
    summaryBadge: noUrgent ? undefined : group.summaryBadge,
    tasks: noUrgent ? group.tasks.map((task) => ({ ...task, badge: { ...task.badge, color: 'gray' as const } })) : group.tasks,
  }))

  const toggleGroup = (groupId: string) => {
    const willExpand = !expanded.has(groupId)
    setExpanded((current) => {
      const next = new Set(current)
      if (willExpand) next.add(groupId)
      else next.delete(groupId)
      return next
    })
    setSelectedGroupId(groupId)
    setFocusedGroupId(groupId)
    const title = groups.find((group) => group.id === groupId)?.title ?? 'La sección'
    setFeedback(willExpand ? `${title}: se muestran las tareas. Las otras secciones no cambian.` : `${title}: se ocultó el desglose.`)
  }

  const toggleEmpty = (checked: boolean) => {
    setFocusedGroupId(selectedGroupId)
    setEmptyGroups((current) => {
      const next = new Set(current)
      if (checked) next.add(selectedGroupId)
      else next.delete(selectedGroupId)
      return next
    })
    if (checked) {
      setErrorGroups((current) => { const next = new Set(current); next.delete(selectedGroupId); return next })
      setExpanded((current) => { const next = new Set(current); next.delete(selectedGroupId); return next })
    }
    setFeedback(checked ? `${selectedGroup.title} muestra cero pendientes; las demás secciones no cambian.` : `${selectedGroup.title} recuperó su total de ejemplo.`)
  }

  const toggleError = (checked: boolean) => {
    setFocusedGroupId(selectedGroupId)
    setErrorGroups((current) => {
      const next = new Set(current)
      if (checked) next.add(selectedGroupId)
      else next.delete(selectedGroupId)
      return next
    })
    if (checked) {
      setEmptyGroups((current) => { const next = new Set(current); next.delete(selectedGroupId); return next })
      setExpanded((current) => { const next = new Set(current); next.delete(selectedGroupId); return next })
    }
    setFeedback(checked ? `${selectedGroup.title} muestra un error local. Prueba «Reintentar».` : `${selectedGroup.title} vuelve a mostrar sus datos.`)
  }

  const resetExample = () => {
    setSelectedGroupId(defaultGroupId)
    setFocusedGroupId(null)
    setNoUrgent(false)
    setEmptyGroups(new Set())
    setErrorGroups(new Set())
    setExpanded(new Set())
    setFeedback('Se restableció la vista inicial de la anatomía.')
  }

  return (
    <div className="playground-layout publication-explorer">
      <aside className="playground-controls publication-explorer__controls" aria-label="Explorar publicaciones">
        <section>
          <h2>¿Qué quieres explorar?</h2>
          <div className="publication-explorer__modes" aria-label="Tipo de exploración">
            <button type="button" aria-pressed={mode === 'states'} className={mode === 'states' ? 'publication-explorer__mode--active' : ''} onClick={() => { setMode('states'); setFeedback('Prueba los estados y las acciones directamente en la card.') }}>Estados e interacciones</button>
            <button type="button" aria-pressed={mode === 'use-cases'} className={mode === 'use-cases' ? 'publication-explorer__mode--active' : ''} onClick={() => { setMode('use-cases'); setFeedback('Elige un mercado o contexto para ver una implementación relevada.') }}>Casos de uso</button>
          </div>
        </section>
        {mode === 'states' ? <>
          <section>
            <h2>Card completa</h2>
            <ExplorerToggle label="Tiene tareas urgentes" checked={!noUrgent} onChange={(checked) => { setNoUrgent(!checked); setFeedback(checked ? 'Vuelven los puntos rojos y las tareas urgentes.' : 'No hay puntos rojos; las tareas del desglose usan indicadores grises.') }} />
          </section>
          <section>
            <h2>Una sección</h2>
            <label className="playground-field"><span>Sección para explorar</span><select value={selectedGroupId} onChange={(event) => { setSelectedGroupId(event.target.value); setFocusedGroupId(event.target.value); setFeedback(`Ahora estás explorando ${groups.find((group) => group.id === event.target.value)?.title ?? 'la sección'}.`) }}>
              {groups.map((group) => <option value={group.id} key={group.id}>{group.title}</option>)}
            </select></label>
            <ExplorerToggle label="Mostrar detalle" checked={expanded.has(selectedGroupId)} disabled={selectedGroup.tasks.length === 0 || selectedEmpty || selectedError} onChange={() => toggleGroup(selectedGroupId)} />
            <ExplorerToggle label="Sin pendientes" checked={selectedEmpty} onChange={toggleEmpty} />
            <ExplorerToggle label="Error al cargar" checked={selectedError} onChange={toggleError} />
            {selectedGroup.tasks.length === 0 && <p className="publication-explorer__hint">Preguntas solo navega: no tiene desglose de tareas.</p>}
          </section>
          <section className="publication-explorer__explanation">
            <p>Cambia los controles o prueba la card directamente. Cada sección conserva su propio estado.</p>
            <button className="publication-explorer__reset" type="button" onClick={resetExample}>Restablecer ejemplo</button>
          </section>
        </> : <>
          <section>
            <h2>Mercado y contexto</h2>
            <label className="playground-field"><span>Caso para explorar</span><select value={useCaseId} onChange={(event) => {
              const next = event.target.value as PublicationUseCaseId
              setUseCaseId(next)
              const item = publicationUseCaseOptions.find((option) => option.id === next)
              setFeedback(item ? `${item.group}: ${item.label}.` : '')
            }}>
              {['MLB', 'CBT', 'Onboarding'].map((group) => <optgroup label={group} key={group}>
                {publicationUseCaseOptions.filter((item) => item.group === group).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
              </optgroup>)}
            </select></label>
          </section>
          <section className="publication-explorer__explanation" aria-live="polite">
            <h2>{activeUseCase.group} · {activeUseCase.label}</h2>
            <p>{activeUseCase.description}</p>
            <p>Elige un mercado o contexto y prueba los accesos del ejemplo en la vista previa.</p>
          </section>
        </>}
      </aside>

      <section className="playground-stage publication-explorer__stage" aria-label="Vista previa interactiva">
        <strong className="playground-stage__label">{mode === 'states' ? 'Vista previa interactiva' : `${activeUseCase.group} · ${activeUseCase.label}`}</strong>
        <div className={`preview-canvas preview-canvas--tasks publication-explorer__canvas ${mode === 'use-cases' ? 'publication-explorer__canvas--use-case' : ''}`}>
          {mode === 'use-cases' ? (
            <div className="publication-explorer__case-preview"><PublicationUseCasePreview key={useCaseId} caseId={useCaseId} onNavigate={(label) => setFeedback(`Se abriría ${label}.`)} /></div>
          ) : (
            <TasksCard title={component.name} groups={visibleGroups} showTitle compact={false} focusedGroupId={focusedGroupId ?? undefined} onFocusGroup={(groupId) => { setSelectedGroupId(groupId); setFocusedGroupId(groupId) }} expandedGroupIds={expanded} onToggleGroup={toggleGroup} onNavigate={(label) => setFeedback(`Se abriría el detalle de ${label}. El encabezado navega; «Ver más» despliega tareas aquí.`)} onRetry={(groupId) => {
              setErrorGroups((current) => { const next = new Set(current); next.delete(groupId); return next })
              setFeedback(`${groups.find((group) => group.id === groupId)?.title ?? 'La sección'} recuperó sus datos.`)
            }} />
          )}
        </div>
        <p className="playground-stage__feedback" role="status" aria-live="polite">{feedback}</p>
      </section>
    </div>
  )
}
