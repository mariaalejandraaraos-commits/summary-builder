import type { MobileSection } from '../../domain/mobile-sections'
import { MobileReputationPanel } from './MobileReputationPanel'
import { MobileSalesPill } from './MobileSalesPill'
import taskAttention from '../../assets/mobile-sections/task-attention.svg?inline'
import type { ReactNode } from 'react'

export function MobileSectionPreview({ section, reputationSlot }: { section: MobileSection; reputationSlot?: ReactNode }) {
  if (section.kind === 'pending-tasks') {
    return <section className="mobile-group-preview mobile-pending-tasks" aria-label={`Sección agrupadora: ${section.name || 'Tareas pendientes'}`}>
      <h3>{section.name || 'Tareas pendientes'}</h3>
      <ul className="mobile-pending-tasks__grid">
        {section.items.map((item) => <li className="mobile-pending-tasks__item" key={item.id}>
          <div><strong>{item.value || '—'}</strong>{item.attention && <span className="mobile-pending-tasks__attention" role="img" aria-label="Requiere atención"><img src={taskAttention} alt="" /></span>}</div>
          <p>{item.label || 'Tarea sin nombre'}</p>
        </li>)}
      </ul>
    </section>
  }

  // At 156 px per tile, formatted billion amounts span roughly 15–18 characters.
  // Switch early enough to accommodate currency symbols and their spacing.
  const longSalesValue = section.sales.value.trim().length >= 15
  const longMoneyValue = section.money.value.trim().length >= 15
  const moneyAction = section.money.action.match(/^(.*?\S)\s+((?:[A-Z]{0,3}\s*)?\p{Sc}\s*[\d.,\s]+)$/u)

  return <section className="mobile-group-preview mobile-control-panel" aria-label={`Sección agrupadora: ${section.name || 'Panel de control'}`}>
    <MobileReputationPanel reputation={section.reputation} slot={reputationSlot} />
    <div className="mobile-control-panel__metrics" data-long-value={longSalesValue || longMoneyValue || undefined}>
      <div className="mobile-control-panel__tile">
        <p>{section.sales.label || 'Ventas brutas'}</p>
        <strong className="mobile-control-panel__amount" data-long-value={longSalesValue || undefined}>{section.sales.value || '—'}</strong>
        <div className="mobile-control-panel__sales-detail"><p className="mobile-control-panel__secondary">{section.sales.period}</p><MobileSalesPill sales={section.sales} /></div>
      </div>
      <div className="mobile-control-panel__tile">
        <p>{section.money.label || 'Tu dinero'}</p>
        <strong className="mobile-control-panel__amount" data-long-value={longMoneyValue || undefined}>{section.money.value || '—'}</strong>
        <p className="mobile-control-panel__action">{moneyAction ? <>{moneyAction[1]}{' '}<span className="mobile-control-panel__action-amount">{moneyAction[2]}</span></> : section.money.action}</p>
      </div>
    </div>
  </section>
}
