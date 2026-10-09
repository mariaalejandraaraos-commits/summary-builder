import { ChevronRight } from 'lucide-react'

type BillingCardProps = {
  title: string
  balance: string
  balanceLabel: string
  pendingPeriod: string
  dueDate: string
  showTitle: boolean
  onNavigate: () => void
}

export function BillingCard({
  title,
  balance,
  balanceLabel,
  pendingPeriod,
  dueDate,
  showTitle,
  onNavigate,
}: BillingCardProps) {
  return (
    <article className="billing-card" aria-label={title}>
      {showTitle && <header className="billing-card__header"><h3>{title || 'Sin título'}</h3></header>}
      <div className="billing-card__content">
        <section className="billing-card__balance">
          <strong>{balance || '$ 0'}</strong>
          <span>{balanceLabel || 'Saldo del periodo'}</span>
        </section>
        <section className="billing-card__pending">
          <div><strong>{pendingPeriod || 'No tienes períodos pendientes'}</strong><i aria-label="Aviso pendiente" /></div>
          <span>{dueDate || 'Sin vencimientos próximos.'}</span>
        </section>
      </div>
      <footer className="billing-card__footer">
        <button type="button" onClick={onNavigate}><span>Ir a Facturación</span><ChevronRight aria-hidden="true" size={20} strokeWidth={2} /></button>
      </footer>
    </article>
  )
}
