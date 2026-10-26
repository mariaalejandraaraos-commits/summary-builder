import type { ControlPanelSection } from '../../domain/mobile-sections'
import { resolveMobileSalesPill } from '../../domain/mobile-sales'
import salesTrend from '../../assets/mobile-sections/sales-trend.svg?inline'
import salesTrendNegative from '../../assets/mobile-sections/sales-trend-negative.svg?inline'

export function MobileSalesPill({ sales }: { sales: ControlPanelSection['sales'] }) {
  const variant = resolveMobileSalesPill(sales.pillVariant)
  const neutral = variant.value === 'No Change'
  if (!sales.change && !neutral) return null
  return <span className="mobile-control-panel__delta" data-pill-variant={variant.value}>
    {!neutral && <span className="mobile-control-panel__delta-icon" aria-hidden="true"><img src={variant.value === 'Red' ? salesTrendNegative : salesTrend} alt="" /></span>}
    <span className="mobile-control-panel__delta-label"><span className="visually-hidden">{variant.direction}</span>{neutral ? '0%' : sales.change}</span>
  </span>
}
