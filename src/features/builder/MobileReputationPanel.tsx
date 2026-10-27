import type { ControlPanelSection } from '../../domain/mobile-sections'
import { resolveMobileReputation } from '../../domain/mobile-reputation'
import { MobileStatusIcon } from './MobileStatusIcon'
import type { ReactNode } from 'react'

export function MobileReputationPanel({ reputation, slot }: { reputation: ControlPanelSection['reputation']; slot?: ReactNode }) {
  const variant = resolveMobileReputation(reputation.variant, reputation.value)
  return <div className="mobile-control-panel__tile mobile-control-panel__reputation" data-reputation-variant={variant?.value}>
    <p>{reputation.label || 'Tu reputación'}</p>
    <div className="mobile-control-panel__status">
      <strong>{variant?.label ?? (reputation.value || 'Reputación no disponible')}</strong>
      {variant?.status && <MobileStatusIcon status={variant.status} />}
    </div>
    {variant?.scale && <div className="mobile-control-panel__scale" data-tone={variant.scale} aria-hidden="true"><i /><i /><i /><i /><i /></div>}
    <p className="mobile-control-panel__secondary">{reputation.description}</p>
    {slot}
  </div>
}
