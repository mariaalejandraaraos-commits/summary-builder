import type { CSSProperties, DragEvent } from 'react'
import { useState } from 'react'
import type { SummaryComponent } from '../../domain/summary-builder'

export type SlotId = 'data-1' | 'data-2' | 'data-3' | 'data-4' | 'data-5' | 'data-6' | 'contextual-recommendation' | 'challenge'
export type SlotKind = 'metric' | 'news' | 'recommendation' | 'challenge'

export type CardSlot = {
  id: SlotId
  kind: SlotKind
  enabled: boolean
}

export type VisualCardConfig = {
  name: string
  slots: CardSlot[]
  text: string
  textLink: string
  showTextLink: boolean
  metricLabel: string
  metricValue: number
  badge: string
  promoTitle: string
  promoDescription: string
  promoCta: string
  promoImage: string
  footerCta: string
  optionalData: Partial<Record<SlotId, { title: string; value: string }>>
}

type Props = {
  components: SummaryComponent[]
  config: VisualCardConfig
  device: 'desktop' | 'mobile'
  onChange: (config: VisualCardConfig) => void
  onDeviceChange: (device: 'desktop' | 'mobile') => void
}

type SlotDefinition = {
  id: SlotId
  name: string
  detail: string
  kind: SlotKind
}

const slotDefinitions: SlotDefinition[] = [
  { id: 'data-1', name: 'Texto + link + tacómetro', detail: 'Datos 1 · patrón de métricas', kind: 'metric' },
  { id: 'data-2', name: 'Novedad destacada', detail: 'Datos 2 · contenido e imagen', kind: 'news' },
  { id: 'data-3', name: 'Métrica adicional 3', detail: 'Datos 3 · slot opcional', kind: 'metric' },
  { id: 'data-4', name: 'Métrica adicional 4', detail: 'Datos 4 · slot opcional', kind: 'metric' },
  { id: 'data-5', name: 'Métrica adicional 5', detail: 'Datos 5 · slot opcional', kind: 'metric' },
  { id: 'data-6', name: 'Métrica adicional 6', detail: 'Datos 6 · slot opcional', kind: 'metric' },
  { id: 'contextual-recommendation', name: 'Recomendación contextual', detail: 'Slot opcional', kind: 'recommendation' },
  { id: 'challenge', name: 'Desafío', detail: 'Slot opcional', kind: 'challenge' },
]

function MetricGauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="slot-gauge" aria-label={`${label}, ${value}%`}>
      <div className="slot-gauge__arc" style={{ '--gauge-fill': `${Math.max(0, Math.min(value, 100)) * 1.8}deg` } as CSSProperties} />
      <strong>{label}</strong>
    </div>
  )
}

export function VisualCardBuilder({ components, config, device, onChange, onDeviceChange }: Props) {
  const [selectedSlotId, setSelectedSlotId] = useState<SlotId | 'header' | 'footer' | null>(null)
  const [draggingSlotId, setDraggingSlotId] = useState<SlotId | null>(null)
  const [dragOverSlotId, setDragOverSlotId] = useState<SlotId | null>(null)
  const optionalSlots = slotDefinitions.slice(2)
  const getSlot = (id: SlotId) => config.slots.find((slot) => slot.id === id)!
  const update = (partial: Partial<VisualCardConfig>) => onChange({ ...config, ...partial })

  const setSlotEnabled = (id: SlotId, enabled: boolean) => {
    onChange({ ...config, slots: config.slots.map((slot) => slot.id === id ? { ...slot, enabled } : slot) })
    setSelectedSlotId(id)
  }

  const readDraggedSlot = (event: DragEvent): SlotId | null => {
    const id = event.dataTransfer.getData('text/plain') as SlotId
    return slotDefinitions.some((slot) => slot.id === id) ? id : null
  }

  const beginDrag = (event: DragEvent, id: SlotId) => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'copy'
    setDraggingSlotId(id)
  }

  const applyDrop = (event: DragEvent, targetId: SlotId) => {
    event.preventDefault()
    event.stopPropagation()
    setDragOverSlotId(null)
    const droppedId = readDraggedSlot(event)
    setDraggingSlotId(null)
    if (!droppedId) return
    const droppedDefinition = slotDefinitions.find((slot) => slot.id === droppedId)!
    const targetDefinition = slotDefinitions.find((slot) => slot.id === targetId)!
    if (droppedDefinition.kind !== targetDefinition.kind) return
    onChange({
      ...config,
      slots: config.slots.map((slot) => ({
        ...slot,
        enabled: slot.id === targetId ? true : slot.id === droppedId && droppedId !== targetId && droppedId !== 'data-1' && droppedId !== 'data-2' ? false : slot.enabled,
      })),
    })
    setSelectedSlotId(targetId)
  }

  const selectSlot = (id: SlotId) => setSelectedSlotId(id)
  const selectedDefinition = selectedSlotId && selectedSlotId !== 'header' && selectedSlotId !== 'footer'
    ? slotDefinitions.find((slot) => slot.id === selectedSlotId)
    : null
  const activeOptionalSlots = optionalSlots.filter((slot) => getSlot(slot.id).enabled)

  const renderDropTarget = (definition: SlotDefinition) => {
    const active = getSlot(definition.id).enabled
    const isOver = dragOverSlotId === definition.id
    return (
      <button
        key={definition.id}
        className={`template-slot${active ? ' template-slot--active' : ''}${isOver ? ' template-slot--over' : ''}${draggingSlotId && slotDefinitions.find((slot) => slot.id === draggingSlotId)?.kind !== definition.kind ? ' template-slot--disabled' : ''}`}
        type="button"
        draggable={active}
        onClick={() => active ? selectSlot(definition.id) : setSlotEnabled(definition.id, true)}
        onDragStart={(event) => beginDrag(event, definition.id)}
        onDragOver={(event) => { event.preventDefault(); setDragOverSlotId(definition.id) }}
        onDragLeave={() => setDragOverSlotId(null)}
        onDrop={(event) => applyDrop(event, definition.id)}
        aria-label={active ? `Editar ${definition.name}` : `Agregar ${definition.name}`}
      >
        {active ? <span className="template-slot__grip" aria-hidden="true">⠿</span> : <span className="template-slot__plus" aria-hidden="true">＋</span>}
        <span className="template-slot__copy"><strong>{definition.name}</strong><small>{active ? 'Slot agregado · haz clic para editar' : definition.detail}</small></span>
        <span className="template-slot__action" aria-hidden="true">{active ? '↗' : '＋'}</span>
      </button>
    )
  }

  return (
    <div className={`visual-card-editor visual-card-editor--${device}`}>
      <aside className="section-library" aria-labelledby="section-library-title">
        <header className="section-library__header">
          <p className="eyebrow">Slots de Figma · 1216:12003</p>
          <h2 id="section-library-title">Estructura de la card</h2>
          <p>Arrastra un slot a la card. El orden y los espacios siguen la librería original. Catálogo conectado: {components.length} cards de Seller Home.</p>
        </header>
        <div className="section-library__list">
          <section className="section-library__group">
            <h3>Fijos</h3>
            <button className="template-slot template-slot--fixed" type="button" onClick={() => setSelectedSlotId('header')}>
              <span className="template-slot__fixed-mark">T</span><span className="template-slot__copy"><strong>Header de la card</strong><small>Título editable · 269 px</small></span><span className="template-slot__action">Editar</span>
            </button>
            {renderDropTarget(slotDefinitions[0])}
            {renderDropTarget(slotDefinitions[1])}
            <button className="template-slot template-slot--fixed" type="button" onClick={() => setSelectedSlotId('footer')}>
              <span className="template-slot__fixed-mark">↗</span><span className="template-slot__copy"><strong>Footer desktop</strong><small>Call to action + chevron</small></span><span className="template-slot__action">Editar</span>
            </button>
          </section>
          <section className="section-library__group">
            <h3>Opcionales · aparecen en el orden original</h3>
            {activeOptionalSlots.length > 0 && <div className="template-slot-list">{activeOptionalSlots.map((slot) => renderDropTarget(slot))}</div>}
            <ul>
              {optionalSlots.filter((slot) => !getSlot(slot.id).enabled).map((slot) => (
                <li className="section-library__item" key={slot.id} draggable onDragStart={(event) => beginDrag(event, slot.id)} onDoubleClick={() => setSlotEnabled(slot.id, true)}>
                  <span className="section-library__grip" aria-hidden="true">⠿</span><span className="section-library__item-name">{slot.name}</span>
                  <button type="button" className="section-library__add" onClick={() => setSlotEnabled(slot.id, true)} aria-label={`Agregar ${slot.name}`}>+</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>

      <section className="card-canvas-panel" aria-labelledby="card-canvas-title">
        <header className="card-canvas-panel__header">
          <div><p className="eyebrow">Vista previa · {device === 'desktop' ? 'Desktop' : 'Mobile'}</p><h2 id="card-canvas-title">Crea una card desde cero</h2></div>
          <div className="builder-device-control" role="group" aria-label="Tamaño de vista previa">
            <button type="button" aria-pressed={device === 'desktop'} onClick={() => onDeviceChange('desktop')}>Desktop</button>
            <button type="button" aria-pressed={device === 'mobile'} onClick={() => onDeviceChange('mobile')}>Mobile</button>
          </div>
        </header>
        <p className="card-canvas-panel__note">Selecciona un slot vacío para agregarlo. Haz clic en un slot agregado para editar sus propiedades.</p>
        <div className="card-canvas-panel__surface">
          <article className="visual-card" aria-label="Previsualización de la card">
            <header className={`visual-card__header${selectedSlotId === 'header' ? ' is-selected' : ''}`}>
              <label className="visually-hidden" htmlFor="visual-card-title">Título de la card</label>
              <input id="visual-card-title" className="visual-card__title" value={config.name} onFocus={() => setSelectedSlotId('header')} onChange={(event) => update({ name: event.target.value })} placeholder="Título" />
            </header>
            <div className="visual-card__content" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
              event.preventDefault()
              const id = readDraggedSlot(event)
              if (id && id !== 'data-1' && id !== 'data-2') setSlotEnabled(id, true)
            }}>
              {getSlot('data-1').enabled ? (
                <button className={`card-data-metric${selectedSlotId === 'data-1' ? ' is-selected' : ''}`} type="button" onClick={() => selectSlot('data-1')}>
                  <span className="card-data-metric__copy"><span>{config.text}</span>{config.showTextLink && <small>{config.textLink}</small>}</span>
                  <MetricGauge value={config.metricValue} label={config.metricLabel} />
                </button>
              ) : renderDropTarget(slotDefinitions[0])}
              {getSlot('data-2').enabled ? (
                <button className={`card-data-news${selectedSlotId === 'data-2' ? ' is-selected' : ''}`} type="button" onClick={() => selectSlot('data-2')}>
                  <span className="card-data-news__badge">{config.badge}</span>
                  <span className="card-data-news__close" aria-hidden="true">×</span>
                  <span className="card-data-news__art" aria-hidden="true">
                    {config.promoImage ? <img src={config.promoImage} alt="" /> : <span className="card-data-news__art-shape"><i /><i /><i /></span>}
                  </span>
                  <strong>{config.promoTitle}</strong><span className="card-data-news__description">{config.promoDescription}</span>
                  <span className="card-data-news__link">{config.promoCta}</span>
                </button>
              ) : renderDropTarget(slotDefinitions[1])}
              {activeOptionalSlots.map((slot) => (
                <button className={`card-data-optional${selectedSlotId === slot.id ? ' is-selected' : ''}`} type="button" key={slot.id} onClick={() => selectSlot(slot.id)}>
                  <span className="card-data-optional__mark">{slot.kind === 'metric' ? 'M' : slot.kind === 'challenge' ? '✓' : '✦'}</span><span><strong>{config.optionalData[slot.id]?.title || slot.name}</strong><small>{config.optionalData[slot.id]?.value || 'Slot activo · componente de la librería'}</small></span>
                </button>
              ))}
            </div>
            <button className={`visual-card__footer${selectedSlotId === 'footer' ? ' is-selected' : ''}`} type="button" onClick={() => setSelectedSlotId('footer')}>
              <span>{config.footerCta || 'Agregar llamada a la acción'}</span><span aria-hidden="true">›</span>
            </button>
          </article>
        </div>
      </section>

      <aside className="section-inspector" aria-labelledby="section-inspector-title">
        <header className="section-inspector__header"><p className="eyebrow">Propiedades</p><h2 id="section-inspector-title">{selectedDefinition ? selectedDefinition.name : selectedSlotId === 'footer' ? 'Footer desktop' : selectedSlotId === 'header' ? 'Header de la card' : 'Personaliza la card'}</h2></header>
        {!selectedSlotId ? (
          <div className="section-inspector__empty"><span aria-hidden="true">↖</span><p>Selecciona el título, el footer o un slot para editarlo.</p><small>Los nombres, campos y orden reflejan el componente de la librería.</small></div>
        ) : selectedSlotId === 'header' ? (
          <div className="section-inspector__fields"><label className="slot-field" htmlFor="card-name-field">Nombre de la card<input id="card-name-field" value={config.name} onChange={(event) => update({ name: event.target.value })} placeholder="Title" /></label><p className="card-slot-inspector__hint">Header card · ancho desktop: 269 px (270 px en el builder).</p></div>
        ) : selectedSlotId === 'footer' ? (
          <div className="section-inspector__fields"><label className="slot-field" htmlFor="footer-cta-field">Texto del CTA<input id="footer-cta-field" value={config.footerCta} onChange={(event) => update({ footerCta: event.target.value })} placeholder="Call to action" /></label><p className="card-slot-inspector__hint">Footer desktop · incluye divisor superior y chevron.</p></div>
        ) : selectedSlotId === 'data-1' ? (
          <div className="section-inspector__fields">
            <label className="slot-field" htmlFor="metric-text">Texto<input id="metric-text" value={config.text} onChange={(event) => update({ text: event.target.value })} /></label>
            <label className="slot-field" htmlFor="metric-link">Text link<input id="metric-link" value={config.textLink} onChange={(event) => update({ textLink: event.target.value })} /></label>
            <label className="slot-field" htmlFor="metric-label">Etiqueta del tacómetro<input id="metric-label" value={config.metricLabel} onChange={(event) => update({ metricLabel: event.target.value })} /></label>
            <label className="slot-field" htmlFor="metric-value">Valor · {config.metricValue}%<input id="metric-value" type="range" min="0" max="100" value={config.metricValue} onChange={(event) => update({ metricValue: Number(event.target.value) })} /></label>
            <label className="slot-check"><input type="checkbox" checked={config.showTextLink} onChange={(event) => update({ showTextLink: event.target.checked })} />Mostrar Text link</label>
            <button className="section-inspector__remove" type="button" onClick={() => setSlotEnabled('data-1', false)}>Quitar slot</button>
          </div>
        ) : selectedSlotId === 'data-2' ? (
          <div className="section-inspector__fields">
            <label className="slot-field" htmlFor="news-badge">Pill / badge<input id="news-badge" value={config.badge} onChange={(event) => update({ badge: event.target.value })} /></label>
            <label className="slot-field" htmlFor="news-title">Título<input id="news-title" value={config.promoTitle} onChange={(event) => update({ promoTitle: event.target.value })} /></label>
            <label className="slot-field" htmlFor="news-description">Descripción<textarea id="news-description" rows={4} value={config.promoDescription} onChange={(event) => update({ promoDescription: event.target.value })} /></label>
            <label className="slot-field" htmlFor="news-cta">CTA interno<input id="news-cta" value={config.promoCta} onChange={(event) => update({ promoCta: event.target.value })} /></label>
            <label className="slot-field" htmlFor="news-image">URL de imagen<input id="news-image" type="url" value={config.promoImage} onChange={(event) => update({ promoImage: event.target.value })} placeholder="https://…" /></label>
            <button className="section-inspector__remove" type="button" onClick={() => setSlotEnabled('data-2', false)}>Quitar slot</button>
          </div>
        ) : selectedDefinition ? (
          <div className="section-inspector__fields">
            <label className="slot-field" htmlFor="optional-slot-title">Título del slot<input id="optional-slot-title" value={config.optionalData[selectedDefinition.id]?.title ?? ''} onChange={(event) => update({ optionalData: { ...config.optionalData, [selectedDefinition.id]: { title: event.target.value, value: config.optionalData[selectedDefinition.id]?.value ?? '' } } })} placeholder={selectedDefinition.name} /></label>
            <label className="slot-field" htmlFor="optional-slot-value">Valor o descripción<input id="optional-slot-value" value={config.optionalData[selectedDefinition.id]?.value ?? ''} onChange={(event) => update({ optionalData: { ...config.optionalData, [selectedDefinition.id]: { title: config.optionalData[selectedDefinition.id]?.title ?? '', value: event.target.value } } })} placeholder="Agrega el contenido" /></label>
            <p className="card-slot-inspector__hint">Este espacio corresponde al slot <strong>{selectedDefinition.id}</strong> del componente Figma. Su posición está reservada en la estructura original.</p>
            <button className="section-inspector__remove" type="button" onClick={() => setSlotEnabled(selectedDefinition.id, false)}>Quitar slot</button>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
