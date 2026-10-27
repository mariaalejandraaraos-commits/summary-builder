import { useRef, useState } from 'react'
import { createMobileCardDraft, isMobileCardSelection, mobileCardDefinitions, mobileCardFieldLabels, mobileCardKinds, type MobileCardDraft, type MobileCardKind, type MobileCardSelection } from '../../domain/mobile-cards'
import type { BuilderElementKind } from '../../domain/mobile-sections'
import { BuilderElementSelector } from './BuilderElementSelector'
import { MobileCardPreview } from './MobileCardPreview'
import { downloadContextHtml } from './exportCardHtml'
import cardStyles from './mobile-cards.css?inline'

export function MobileCardSelector({ value, onChange }: { value: MobileCardSelection; onChange: (value: MobileCardSelection) => void }) {
  return <div className="mobile-section-options"><label htmlFor="mobile-card-kind">Card a construir</label><select id="mobile-card-kind" value={value} onChange={(event) => { if (isMobileCardSelection(event.target.value)) onChange(event.target.value) }}><option value="free">Construcción libre · por slots</option>{mobileCardKinds.map((kind) => <option value={kind} key={kind}>{mobileCardDefinitions[kind].name}</option>)}</select></div>
}

export function MobileCardBuilder({ kind, draft, onSelect, onChange, onElementChange, onDesktop, exportStyles, saveFailed }: {
  kind: MobileCardKind
  draft: MobileCardDraft
  onSelect: (kind: MobileCardSelection) => void
  onChange: (draft: MobileCardDraft) => void
  onElementChange: (kind: BuilderElementKind) => void
  onDesktop: () => void
  exportStyles: string
  saveFailed: boolean
}) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [notice, setNotice] = useState('')
  const definition = mobileCardDefinitions[kind]
  const activeFields = Object.entries(draft.fields).filter(([field]) =>
    (!field.startsWith('recommendation') || draft.showRecommendation)
    && (!field.startsWith('benefit') || draft.showBenefits)
    && (field !== 'badge' || draft.showBadge))
  const canExport = activeFields.every(([, text]) => text.trim())
  const exportCard = () => {
    const downloaded = downloadContextHtml({ context: previewRef.current, title: draft.fields.title, styles: `${exportStyles}\n${cardStyles}`, scope: 'mobile-card' })
    setNotice(downloaded ? 'Se descargó la card mobile con sus recursos incluidos.' : 'No se pudo preparar la descarga.')
  }
  const toggle = (field: 'showRecommendation' | 'showBenefits' | 'showBadge', label: string) => <label className="mobile-section-attention-field"><input type="checkbox" checked={draft[field]} onChange={(event) => onChange({ ...draft, [field]: event.target.checked })} />{label}</label>
  return <section className="reputation-demo reputation-demo--mobile-card" aria-labelledby="mobile-card-heading">
    <header className="reputation-demo__intro"><div><p className="eyebrow">Builder · Card mobile</p><h1 id="mobile-card-heading">Crea una card mobile</h1><p>Elige una card de la Librería Summary y edita su contenido.</p></div><div className="reputation-demo__actions"><span role="status">{saveFailed ? 'No se pudo guardar. Descarga tu card para conservarla.' : 'Guardado local en este navegador'}</span><button type="button" className="button button--primary" disabled={!canExport} onClick={exportCard}>Descargar card mobile</button></div></header>
    <div className="reputation-demo__layout">
      <aside className="reputation-demo__panel reputation-demo__palette" aria-label="Construcción de card mobile"><BuilderElementSelector value="card" onChange={onElementChange} cardDescription="Elige una card mobile y personaliza su contenido." /><MobileCardSelector value={kind} onChange={onSelect} /><p className="mobile-card-builder__note">Cada card conserva su borrador al cambiar de opción.</p><p className="mobile-card-builder__note"><a href={`https://www.figma.com/design/iii7kL3u0TlRYTzMqpJgNB/?node-id=${definition.nodeId.replace(':', '-')}`} target="_blank" rel="noreferrer">Ver referencia en Figma</a></p></aside>
      <section className="reputation-demo__canvas reputation-demo__panel" aria-labelledby="mobile-card-preview-title"><div className="reputation-demo__canvas-heading"><div><p className="eyebrow">Vista previa · 320 px</p><h2 id="mobile-card-preview-title">{definition.name}</h2></div><fieldset className="reputation-demo__device-options"><legend className="visually-hidden">Tamaño de vista previa</legend><label><input type="radio" name="reputation-demo-device" checked={false} onChange={onDesktop} /><span>Desktop</span></label><label><input type="radio" name="reputation-demo-device" checked readOnly /><span>Mobile</span></label></fieldset></div><div className="reputation-demo__stage" data-device="mobile"><div className="mobile-card-preview-root" ref={previewRef}><MobileCardPreview key={kind} kind={kind} draft={draft} onAction={(label) => setNotice(`Acción de ejemplo: ${label}.`)} onHideRecommendation={() => onChange({ ...draft, showRecommendation: false })} /></div></div></section>
      <aside className="reputation-demo__panel reputation-demo__inspector" aria-labelledby="mobile-card-inspector-title"><div className="reputation-demo__panel-heading"><p className="eyebrow">Contenido</p><h2 id="mobile-card-inspector-title">Editar {definition.name}</h2></div><div className="reputation-demo__fields">
        {'recommendation' in draft.fields && toggle('showRecommendation', 'Mostrar recomendación')}
        {'benefitsTitle' in draft.fields && toggle('showBenefits', 'Mostrar beneficios')}
        {'badge' in draft.fields && toggle('showBadge', 'Mostrar etiqueta')}
        {activeFields.map(([field, value]) => <label key={field}>{mobileCardFieldLabels[field]}<textarea rows={value.length > 65 ? 3 : 1} value={value} aria-required="true" aria-invalid={!value.trim()} aria-describedby={!value.trim() ? 'mobile-card-incomplete' : undefined} onChange={(event) => onChange({ ...draft, fields: { ...draft.fields, [field]: event.target.value } })} /></label>)}
        <p id="mobile-card-incomplete" role="status">{!canExport ? 'Completa los textos vacíos antes de descargar.' : ''}</p>
        <button className="reputation-demo__reset" type="button" onClick={() => { onChange(createMobileCardDraft(kind)); setNotice('Se restauró únicamente esta card con el ejemplo de Figma.') }}>Restaurar esta card</button>
      </div></aside>
    </div><p className="builder-notice" role="status" aria-live="polite">{notice}</p>
  </section>
}
