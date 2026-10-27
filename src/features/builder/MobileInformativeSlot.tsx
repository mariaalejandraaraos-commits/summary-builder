import { informativeSlotHref, informativeSlotStatuses, type MobileInformativeSlot as InformativeSlot } from '../../domain/mobile-informative-slot'
import { MobileStatusIcon } from './MobileStatusIcon'
import slotIcon from '../../assets/mobile-sections/informative-slot-icon.svg?inline'
import reputationSlotIcon from '../../assets/mobile-sections/reputation-slot-icon.svg?inline'
import type { ReactNode } from 'react'

export function MobileInformativeSlot({ slot, onAdd, freePreview, sectionName = 'Panel de control', placement = 'standalone' }: { slot: InformativeSlot; onAdd: () => void; freePreview?: ReactNode; sectionName?: string; placement?: 'standalone' | 'reputation' }) {
  if (!slot.enabled) return null
  if (slot.construction === 'free-slot' && freePreview) return freePreview
  if (slot.construction === 'free-slot' || !slot.configured) {
    return <button type="button" className="mobile-informative-slot__placeholder" data-builder-only onClick={onAdd}>
      <span className="mobile-informative-slot__sort" aria-hidden="true"><img src={placement === 'reputation' ? reputationSlotIcon : slotIcon} alt="" /></span>
      <span>{placement === 'reputation' ? 'Agregar contenido a reputación' : 'Agregar información complementaria'}</span>
      {placement === 'standalone' && <small>Bloque independiente · {sectionName}</small>}
    </button>
  }
  const href = slot.descriptionKind === 'link' ? informativeSlotHref(slot.href) : undefined
  return <section className="mobile-group-preview mobile-informative-slot mobile-control-panel__tile" aria-label={`Información complementaria: ${slot.label || 'Sin título'}`}>
    <p>{slot.label || 'Título'}</p>
    <div className="mobile-control-panel__status">
      <strong>{slot.title || 'Informativo'}</strong>
      {slot.status !== 'none' && <MobileStatusIcon status={slot.status} label={informativeSlotStatuses.find((status) => status.value === slot.status)?.label} />}
    </div>
    {slot.descriptionKind === 'text'
      ? <p className="mobile-control-panel__secondary">{slot.description}</p>
      : href ? <a className="mobile-informative-slot__link" href={href}>{slot.description}</a>
        : <p className="mobile-informative-slot__link">{slot.description}</p>}
  </section>
}
