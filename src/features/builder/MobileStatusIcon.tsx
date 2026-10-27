import reputationCheck from '../../assets/mobile-sections/reputation-check.svg?inline'
import reputationAttention from '../../assets/mobile-sections/reputation-attention.svg?inline'

export function MobileStatusIcon({ status, label }: { status: 'positive' | 'caution' | 'negative'; label?: string }) {
  return <span className="mobile-control-panel__check" data-status={status} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    <img src={status === 'positive' ? reputationCheck : reputationAttention} alt="" />
  </span>
}
