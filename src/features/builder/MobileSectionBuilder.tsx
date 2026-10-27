import { useRef, useState, type ComponentType } from 'react'
import { ChevronDown, Download, RotateCcw } from 'lucide-react'
import { createMobileSectionDrafts, getMobileSectionInformativeSlot, isMobileSectionDrafts, migrateMobileSectionDrafts, type BuilderElementKind, type ControlPanelSection, type MobileInformativeSlotTarget, type MobileSectionDrafts, type MobileSectionKind } from '../../domain/mobile-sections'
import { BuilderElementSelector } from './BuilderElementSelector'
import { MobileSectionPreview } from './MobileSectionPreview'
import { downloadContextHtml } from './exportCardHtml'
import { mobileReputationVariants, resolveMobileReputation } from '../../domain/mobile-reputation'
import { mobileSalesPillVariants, resolveMobileSalesPill } from '../../domain/mobile-sales'
import { informativeSlotHref, informativeSlotStatuses, isInformativeSlotComplete, type MobileInformativeSlot as InformativeSlot } from '../../domain/mobile-informative-slot'
import { MobileInformativeSlot } from './MobileInformativeSlot'
import type { MobileFreeSlotBuilderProps, MobileFreeSlotParts } from './mobile-free-slot'
import sectionStyles from './mobile-sections.css?inline'

const storageKey = 'summary-builder-mobile-sections-v1'
const sectionNames = { 'control-panel': 'Panel de control', 'pending-tasks': 'Tareas pendientes' }
const informativeSlotKeys = { 'control-panel-above': 'controlPanelAboveInformativeSlot', 'control-panel-top': 'controlPanelTopInformativeSlot', 'control-panel': 'informativeSlot', 'pending-tasks': 'pendingTasksInformativeSlot' } as const
const slotNames = { 'control-panel-above': 'Superior', 'control-panel': 'Medio', 'pending-tasks': 'Inferior', 'control-panel-top': 'Dentro de reputación' }
const slotDescriptions = {
  'control-panel-above': 'Antes del Panel de control.',
  'control-panel': 'Entre el Panel de control y Tareas pendientes.',
  'pending-tasks': 'Debajo de Tareas pendientes.',
  'control-panel-top': 'Dentro de la card de reputación, debajo del texto de apoyo.',
}
const slotOrder: MobileInformativeSlotTarget[] = ['control-panel-above', 'control-panel', 'pending-tasks', 'control-panel-top']
const slotSection = (target: MobileInformativeSlotTarget): MobileSectionKind => target === 'pending-tasks' ? 'pending-tasks' : 'control-panel'

function readSession(): { version: 3; drafts: MobileSectionDrafts; kind: MobileSectionKind } {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    if ((saved?.version === 1 || saved?.version === 2 || saved?.version === 3) && isMobileSectionDrafts(saved.drafts)) {
      const drafts = saved.version === 1 ? migrateMobileSectionDrafts(saved.drafts) : saved.drafts
      return { version: 3, drafts, kind: saved.kind === 'pending-tasks' ? 'pending-tasks' : 'control-panel' }
    }
  } catch {
    // A malformed or unavailable local draft falls back to the reference examples.
  }
  return { version: 3, drafts: createMobileSectionDrafts(), kind: 'control-panel' }
}

export function MobileSectionBuilder({ onElementChange, onDesktop, exportStyles, freeSlotBuilder: FreeSlotBuilder }: {
  onElementChange: (kind: BuilderElementKind) => void
  onDesktop: () => void
  exportStyles: string
  freeSlotBuilder: ComponentType<MobileFreeSlotBuilderProps>
}) {
  const [session, setSession] = useState(readSession)
  const sessionRef = useRef(session)
  const { kind } = session
  const drafts = session.drafts
  const [selectedElement, setSelectedElement] = useState('section')
  const [activeSlotTarget, setActiveSlotTarget] = useState<MobileInformativeSlotTarget>(() => session.kind === 'pending-tasks' ? 'pending-tasks' : 'control-panel-top')
  const [notice, setNotice] = useState('')
  const [saveFailed, setSaveFailed] = useState(false)
  const [showTasksContext, setShowTasksContext] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const section = drafts[kind]
  const panel = drafts['control-panel']
  const aboveInformativeSlot = getMobileSectionInformativeSlot(drafts, 'control-panel-above')
  const topInformativeSlot = getMobileSectionInformativeSlot(drafts, 'control-panel-top')
  const sectionSlotTargets: MobileInformativeSlotTarget[] = kind === 'control-panel' ? ['control-panel-above', 'control-panel-top', 'control-panel'] : ['pending-tasks']
  const panelInformativeSlot = getMobileSectionInformativeSlot(drafts, 'control-panel')
  const tasksInformativeSlot = getMobileSectionInformativeSlot(drafts, 'pending-tasks')
  const superiorNeedsConstruction = aboveInformativeSlot.construction === 'informative-card'
  const activeSlotDraft = getMobileSectionInformativeSlot(drafts, activeSlotTarget)
  const informativeSlot = activeSlotTarget === 'control-panel-above' && superiorNeedsConstruction
    ? { ...activeSlotDraft, construction: 'free-slot' as const, configured: false }
    : activeSlotDraft
  const invalidSlotHref = informativeSlot.descriptionKind === 'link' && Boolean(informativeSlot.href.trim()) && !informativeSlotHref(informativeSlot.href)
  const reputationVariant = resolveMobileReputation(panel.reputation.variant, panel.reputation.value)
  const salesPillVariant = resolveMobileSalesPill(panel.sales.pillVariant)
  const selectedTask = kind === 'pending-tasks' ? drafts['pending-tasks'].items.find((item) => item.id === selectedElement) : undefined
  const baseCanExport = Boolean(section.name.trim()) && (section.kind === 'control-panel'
    ? [section.reputation, section.sales, section.money].every((element) => element.label.trim() && element.value.trim())
    : section.items.every((item) => item.label.trim() && item.value.trim())) && sectionSlotTargets.every((target) => target === 'control-panel-above' || isInformativeSlotComplete(getMobileSectionInformativeSlot(drafts, target)))

  const updateSession = (next: typeof session) => {
    const normalized = { ...next, version: 3 as const }
    // Slot editors can save in the same React batch. Always build on the latest session.
    sessionRef.current = normalized
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalized))
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
    setSession(normalized)
  }
  const setDrafts = (update: (current: MobileSectionDrafts) => MobileSectionDrafts) => {
    const current = sessionRef.current
    updateSession({ ...current, drafts: update(current.drafts) })
  }

  const selectSection = (nextKind: MobileSectionKind) => {
    updateSession({ ...sessionRef.current, kind: nextKind })
    setActiveSlotTarget(nextKind === 'pending-tasks' ? 'pending-tasks' : 'control-panel-top')
    setSelectedElement('section')
  }
  const updatePanel = <K extends 'reputation' | 'sales' | 'money'>(element: K, patch: Partial<ControlPanelSection[K]>) => {
    setDrafts((current) => ({ ...current, 'control-panel': { ...current['control-panel'], [element]: { ...current['control-panel'][element], ...patch } } }))
  }
  const updateTask = (patch: Partial<NonNullable<typeof selectedTask>>) => {
    setDrafts((current) => ({ ...current, 'pending-tasks': { ...current['pending-tasks'], items: current['pending-tasks'].items.map((item) => item.id === selectedElement ? { ...item, ...patch } : item) } }))
  }
  const updateInformativeSlot = (patch: Partial<InformativeSlot>, slotKind: MobileInformativeSlotTarget = activeSlotTarget) => {
    setDrafts((current) => ({ ...current, [informativeSlotKeys[slotKind]]: { ...getMobileSectionInformativeSlot(current, slotKind), ...patch } }))
  }
  const editInformativeSlot = (slotKind: MobileInformativeSlotTarget = activeSlotTarget) => {
    const slot = getMobileSectionInformativeSlot(sessionRef.current.drafts, slotKind)
    updateInformativeSlot({ enabled: true, ...(slot.construction === 'informative-card' ? { configured: true } : {}) }, slotKind)
    const sectionKind = slotSection(slotKind)
    setActiveSlotTarget(slotKind)
    if (sectionKind !== kind) updateSession({ ...sessionRef.current, kind: sectionKind })
    setSelectedElement('informative-slot')
    window.requestAnimationFrame(() => (document.getElementById('mobile-informative-label') ?? document.querySelector<HTMLElement>('.mobile-informative-slot__free-editor select, .mobile-informative-slot__free-editor textarea, .mobile-informative-slot__free-editor input[type="url"]'))?.focus())
  }
  const resetSection = () => {
    const defaults = createMobileSectionDrafts()
    setDrafts((current) => ({ ...current, [kind]: defaults[kind] }))
    setSelectedElement('section')
    setNotice('La sección volvió a su contenido de referencia.')
  }
  const exportSection = (canExport: boolean) => {
    if (!canExport) return
    const exported = downloadContextHtml({ context: previewRef.current, title: section.name, styles: `${exportStyles}\n${sectionStyles}`, scope: 'mobile-section' })
    setNotice(exported ? 'Se descargó la propuesta para revisar en mobile.' : 'No se pudo descargar la sección. Intenta de nuevo.')
  }

  const renderBuilder = (freeSlots: Record<MobileInformativeSlotTarget, MobileFreeSlotParts>) => {
    const freeSlot = freeSlots[activeSlotTarget]
    const canExport = baseCanExport && sectionSlotTargets.every((target) => {
      if (target === 'control-panel-above' && superiorNeedsConstruction) return true
      const slot = getMobileSectionInformativeSlot(drafts, target)
      return !slot.enabled || slot.construction !== 'free-slot' || freeSlots[target].complete
    })
    const buildFreeSlot = (target: MobileInformativeSlotTarget) => {
      updateInformativeSlot({ construction: 'free-slot' }, target)
      freeSlots[target].activate()
      editInformativeSlot(target)
    }
    const editFreeSlot = () => buildFreeSlot(activeSlotTarget)
    const renderComplement = (slotKind: MobileInformativeSlotTarget) => {
      const draft = getMobileSectionInformativeSlot(drafts, slotKind)
      // Superior is a free slot. Retain old card data without rendering it there.
      const legacySuperior = slotKind === 'control-panel-above' && superiorNeedsConstruction
      const slot = legacySuperior ? { ...draft, construction: 'free-slot' as const, configured: false } : draft
      const sectionKind = slotSection(slotKind)
      if (!slot.enabled) return null
      const parts = freeSlots[slotKind]
      const freePreview = legacySuperior ? undefined : parts.preview
      const placeholder = slot.construction === 'free-slot' ? !freePreview : !slot.configured
      const embedded = slotKind === 'control-panel-top'
      return <div className={`mobile-section-complement${embedded ? ' mobile-section-complement--reputation' : ''}`} role="group" aria-label={`${embedded ? 'Slot' : 'Complemento independiente'}: ${slotNames[slotKind]}`} data-mobile-slot={slotKind} data-builder-only={placeholder ? '' : undefined}>
        {!placeholder && <button type="button" className="mobile-section-complement__edit-target" aria-label={`Editar slot ${slotNames[slotKind]}`} data-builder-only onClick={() => editInformativeSlot(slotKind)} />}
        <MobileInformativeSlot slot={slot} placement={embedded ? 'reputation' : 'standalone'} sectionName={sectionNames[sectionKind]} freePreview={freePreview} onAdd={() => {
          if (slot.construction === 'free-slot') buildFreeSlot(slotKind)
          else editInformativeSlot(slotKind)
        }} />
      </div>
    }
    return <section className="reputation-demo reputation-demo--mobile-section" aria-labelledby="mobile-section-builder-title">
    <header className="reputation-demo__intro">
      <div><p className="eyebrow">Builder · Mobile</p><h1 id="mobile-section-builder-title">Construye una sección agrupadora</h1><p>Reúne elementos relacionados en una sección con estructura propia.</p></div>
      <div className="reputation-demo__actions">
        <button type="button" className="reputation-demo__reset" onClick={resetSection}><RotateCcw size={14} aria-hidden="true" />Reiniciar sección</button>
        <span className="reputation-demo__session-status">{saveFailed ? 'No se pudo guardar el borrador en este navegador' : 'Guardado local en este navegador'}</span>
        <button type="button" className="button button--primary" onClick={() => exportSection(canExport)} disabled={!canExport}><Download size={15} aria-hidden="true" />Descargar sección</button>
      </div>
    </header>
    <div className="reputation-demo__layout">
      <aside className="reputation-demo__panel reputation-demo__palette" aria-labelledby="mobile-sections-title">
        <BuilderElementSelector value="mobile-section" onChange={onElementChange} />
        <div className="reputation-demo__panel-heading"><p className="eyebrow">1. Elige la sección</p><h2 id="mobile-sections-title">Secciones agrupadoras</h2><p>En mobile, la anatomía de cada sección es fija y reúne sus propios elementos.</p></div>
        <div className="mobile-section-options">
          <label htmlFor="mobile-section-kind">Sección a construir</label>
          <div className="mobile-section-options__select">
            <select id="mobile-section-kind" value={kind} onChange={(event) => selectSection(event.target.value === 'pending-tasks' ? 'pending-tasks' : 'control-panel')}>
              <option value="control-panel">Panel de control</option>
              <option value="pending-tasks">Tareas pendientes</option>
            </select>
            <ChevronDown size={16} aria-hidden="true" focusable="false" />
          </div>
        </div>
        <div className="mobile-informative-slot-editor">
          <strong>Slots opcionales</strong>
          <p>Activa cada ubicación para construir su contenido.</p>
          <div className="mobile-informative-slot-editor__locations">
            {slotOrder.filter((target) => slotSection(target) === kind).map((target) => {
              const slot = getMobileSectionInformativeSlot(drafts, target)
              return <div className="mobile-informative-slot-editor__location" data-slot-control={target} data-selected={target === activeSlotTarget || undefined} key={target}>
                <label className="mobile-informative-slot-editor__toggle">
                  <span>{slotNames[target]}</span>
                  <input type="checkbox" role="switch" aria-label={`Slot ${slotNames[target]}`} checked={slot.enabled} onChange={(event) => {
                    updateInformativeSlot({ enabled: event.target.checked }, target)
                    setActiveSlotTarget(target)
                    const sectionKind = slotSection(target)
                    if (sectionKind !== kind) updateSession({ ...sessionRef.current, kind: sectionKind })
                    setSelectedElement('section')
                  }} />
                  <span className="mobile-informative-slot-editor__track" aria-hidden="true"><span /></span>
                  <small aria-hidden="true">{slot.enabled ? 'On' : 'Off'}</small>
                </label>
              </div>
            })}
          </div>
          {kind === 'control-panel' && <>
            <label className="mobile-informative-slot-editor__context"><input type="checkbox" checked={showTasksContext} onChange={(event) => setShowTasksContext(event.target.checked)} />Ver junto a Tareas pendientes</label>
            {showTasksContext && <p>Las tareas y su slot se muestran como contexto y no se incluyen en esta descarga.</p>}
          </>}
        </div>
      </aside>
      <section className="reputation-demo__canvas reputation-demo__panel" aria-labelledby="mobile-section-preview-title">
        <div className="reputation-demo__canvas-heading"><div><p className="eyebrow">Vista previa · Sección agrupadora</p><h2 id="mobile-section-preview-title">{sectionNames[kind]}</h2></div>
          <fieldset className="reputation-demo__device-options"><legend className="visually-hidden">Tamaño de vista previa</legend><label><input type="radio" name="mobile-section-device" checked={false} onChange={onDesktop} /><span>Desktop</span></label><label><input type="radio" name="mobile-section-device" checked readOnly /><span>Mobile</span></label></fieldset>
        </div>
        <div className="reputation-demo__stage" data-device="mobile"><div className={`mobile-section-preview-root mobile-section-preview-root--${kind}`} ref={previewRef}>
          {kind === 'control-panel' && renderComplement('control-panel-above')}
          <MobileSectionPreview section={section} reputationSlot={kind === 'control-panel' ? renderComplement('control-panel-top') : undefined} />
          {renderComplement(kind)}
          {kind === 'control-panel' && showTasksContext && <div className="mobile-informative-slot__tasks-context" data-builder-only>
            <MobileSectionPreview section={drafts['pending-tasks']} />
            {renderComplement('pending-tasks')}
          </div>}
        </div></div>
        <p className="reputation-demo__canvas-hint">{sectionNames[kind]} · Referencia de la Librería Summary en Figma. Los valores iniciales son de ejemplo.</p>
      </section>
      <aside className="reputation-demo__panel reputation-demo__inspector" aria-labelledby="mobile-section-properties-title">
        <div className="reputation-demo__panel-heading"><p className="eyebrow">2. Completa el contenido</p><h2 id="mobile-section-properties-title">{selectedElement === 'informative-slot' ? 'Propiedades del slot informativo' : 'Propiedades de la sección'}</h2><p>{selectedElement === 'informative-slot' ? activeSlotTarget === 'control-panel-top' ? 'Slot dentro de la card de reputación' : `Bloque independiente · ${slotNames[activeSlotTarget]}` : sectionNames[kind]}</p></div>
        <div className="reputation-demo__fields">
          {selectedElement !== 'informative-slot' && <label>Nombre de la sección<input value={section.name} onChange={(event) => setDrafts((current) => ({ ...current, [kind]: { ...current[kind], name: event.target.value } }))} /></label>}
          <label>Elemento a editar<span className="mobile-section-inspector-select"><select value={selectedElement === 'informative-slot' ? 'section' : selectedElement} onChange={(event) => setSelectedElement(event.target.value)}><option value="section">Selecciona un elemento</option>{kind === 'control-panel' ? <optgroup label="Panel de control"><option value="reputation">Reputación</option><option value="sales">Ventas brutas</option><option value="money">Tu dinero</option></optgroup> : <optgroup label="Tareas pendientes">{drafts['pending-tasks'].items.map((item, index) => <option key={item.id} value={item.id}>{index + 1}. {item.label || 'Tarea sin nombre'}</option>)}</optgroup>}</select><ChevronDown size={16} aria-hidden="true" focusable="false" /></span></label>
          {selectedElement === 'informative-slot' && <>
            <p className="mobile-section-editor-note">{slotDescriptions[activeSlotTarget]}</p>
            {!informativeSlot.enabled && <p className="mobile-section-editor-note">Activa el toggle de esta ubicación en el panel izquierdo para incluirlo. El contenido guardado se conserva al apagarlo.</p>}
            {informativeSlot.enabled && informativeSlot.construction === 'free-slot' && (activeSlotTarget === 'control-panel-above' && superiorNeedsConstruction
              ? <button type="button" className="mobile-informative-slot-editor__button" onClick={editFreeSlot}>Construir en el slot rosado</button>
              : freeSlot.editor)}
            {informativeSlot.enabled && informativeSlot.construction === 'informative-card' && !informativeSlot.configured && <button type="button" className="mobile-informative-slot-editor__button" onClick={() => editInformativeSlot()}>Configurar contenido</button>}
            {informativeSlot.enabled && informativeSlot.construction === 'informative-card' && informativeSlot.configured && <>
              <label>Título<input id="mobile-informative-label" value={informativeSlot.label} onChange={(event) => updateInformativeSlot({ label: event.target.value })} /></label>
              <label>Informativo<input id="mobile-informative-title" value={informativeSlot.title} onChange={(event) => updateInformativeSlot({ title: event.target.value })} /></label>
              <label>Ícono de estado<select id="mobile-informative-status" value={informativeSlot.status} onChange={(event) => {
                const status = informativeSlotStatuses.find((option) => option.value === event.target.value)
                if (status) updateInformativeSlot({ status: status.value })
              }}>{informativeSlotStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
              <label>Tipo de texto<select id="mobile-informative-description-kind" value={informativeSlot.descriptionKind} onChange={(event) => {
                const descriptionKind = event.target.value === 'link' ? 'link' : 'text'
                const usesDefaultText = informativeSlot.description === 'Text link' || informativeSlot.description === 'Text description'
                updateInformativeSlot({ descriptionKind, ...(usesDefaultText ? { description: descriptionKind === 'link' ? 'Text link' : 'Text description' } : {}) })
              }}><option value="text">Text description</option><option value="link">Text link</option></select></label>
              <label>{informativeSlot.descriptionKind === 'link' ? 'Text link' : 'Text description'}<input id="mobile-informative-description" value={informativeSlot.description} onChange={(event) => updateInformativeSlot({ description: event.target.value })} /></label>
              {informativeSlot.descriptionKind === 'link' && <>
                <label>URL del enlace · Opcional<input id="mobile-informative-href" type="url" placeholder="https://…" value={informativeSlot.href} aria-invalid={invalidSlotHref || undefined} aria-describedby="mobile-informative-href-help" onChange={(event) => updateInformativeSlot({ href: event.target.value })} /></label>
                <p id="mobile-informative-href-help" className="mobile-section-editor-note">{invalidSlotHref ? 'Ingresa una URL completa que empiece con https:// o http://.' : 'Sin URL, la bajada es una referencia visual. Agrega una URL para que el enlace funcione al descargar el HTML.'}</p>
              </>}
            </>}
          </>}
          {kind === 'control-panel' && selectedElement === 'reputation' && <>
            <label>Variante de reputación<select id="mobile-reputation-variant" value={reputationVariant?.value ?? ''} onChange={(event) => {
              const variant = mobileReputationVariants.find((option) => option.value === event.target.value)
              if (variant) updatePanel('reputation', { variant: variant.value, value: variant.label })
            }}>{!reputationVariant && <option value="" disabled>Selecciona una variante</option>}{mobileReputationVariants.map((variant) => <option key={variant.value} value={variant.value}>{variant.label}</option>)}</select></label>
            <label>Etiqueta<input value={panel.reputation.label} onChange={(event) => updatePanel('reputation', { label: event.target.value })} /></label>
            <label>Texto de apoyo<input value={panel.reputation.description} onChange={(event) => updatePanel('reputation', { description: event.target.value })} /></label>
          </>}
          {kind === 'control-panel' && selectedElement === 'sales' && <>
            <label>Variante de pill<select id="mobile-sales-pill-variant" value={salesPillVariant.value} onChange={(event) => {
              const variant = mobileSalesPillVariants.find((option) => option.value === event.target.value)
              if (variant) updatePanel('sales', { pillVariant: variant.value })
            }}>{mobileSalesPillVariants.map((variant) => <option key={variant.value} value={variant.value}>{variant.label}</option>)}</select></label>
            <label>Etiqueta<input value={panel.sales.label} onChange={(event) => updatePanel('sales', { label: event.target.value })} /></label>
            <label>Valor<input value={panel.sales.value} onChange={(event) => updatePanel('sales', { value: event.target.value })} /></label>
            <label>Período<input value={panel.sales.period} onChange={(event) => updatePanel('sales', { period: event.target.value })} /></label>
            <p className="mobile-section-editor-note">Porcentaje de referencia: {salesPillVariant.value === 'No Change' ? '0%' : panel.sales.change}.</p>
          </>}
          {kind === 'control-panel' && selectedElement === 'money' && <>
            <label>Etiqueta<input value={panel.money.label} onChange={(event) => updatePanel('money', { label: event.target.value })} /></label>
            <label>Valor<input value={panel.money.value} onChange={(event) => updatePanel('money', { value: event.target.value })} /></label>
            <label>Acción del indicador<input value={panel.money.action} onChange={(event) => updatePanel('money', { action: event.target.value })} /></label>
          </>}
          {selectedTask && <>
            <label>Nombre de la tarea<input value={selectedTask.label} onChange={(event) => updateTask({ label: event.target.value })} /></label>
            <label>Cantidad<input value={selectedTask.value} onChange={(event) => updateTask({ value: event.target.value })} /></label>
            <label className="mobile-section-attention-field"><input type="checkbox" checked={selectedTask.attention} onChange={(event) => updateTask({ attention: event.target.checked })} />Mostrar indicador de atención</label>
          </>}
          {selectedElement === 'section' && <p className="mobile-section-editor-note">Elige un elemento para editar su contenido. La sección conserva la composición de referencia.</p>}
          {!canExport && <p className="mobile-section-editor-note">Completa los nombres y valores de la sección y de sus slots visibles, y revisa las URLs si agregaste alguna para descargar.</p>}
        </div>
      </aside>
    </div>
    <p className="reputation-demo__notice" role="status">{notice}</p>
  </section>
  }

  return <FreeSlotBuilder draft={aboveInformativeSlot.freeDraft} onChange={(draft) => updateInformativeSlot({ freeDraft: draft }, 'control-panel-above')}>
    {(aboveFreeSlot) => <FreeSlotBuilder draft={topInformativeSlot.freeDraft} onChange={(draft) => updateInformativeSlot({ freeDraft: draft }, 'control-panel-top')}>
      {(topFreeSlot) => <FreeSlotBuilder draft={panelInformativeSlot.freeDraft} onChange={(draft) => updateInformativeSlot({ freeDraft: draft }, 'control-panel')}>
        {(panelFreeSlot) => <FreeSlotBuilder draft={tasksInformativeSlot.freeDraft} onChange={(draft) => updateInformativeSlot({ freeDraft: draft }, 'pending-tasks')}>
          {(tasksFreeSlot) => renderBuilder({ 'control-panel-above': aboveFreeSlot, 'control-panel-top': topFreeSlot, 'control-panel': panelFreeSlot, 'pending-tasks': tasksFreeSlot })}
        </FreeSlotBuilder>}
      </FreeSlotBuilder>}
    </FreeSlotBuilder>}
  </FreeSlotBuilder>
}
