import { ChevronRight } from 'lucide-react'

type MoneyCardProps = {
  title: string
  availableAmount: string
  availableLabel: string
  transferLabel: string
  accountAmount: string
  accountLabel: string
  showTitle: boolean
  onTransfer: () => void
  onNavigate: () => void
}

export function MoneyCard({
  title,
  availableAmount,
  availableLabel,
  transferLabel,
  accountAmount,
  accountLabel,
  showTitle,
  onTransfer,
  onNavigate,
}: MoneyCardProps) {
  return (
    <article className="money-card" aria-label={title}>
      {showTitle && <header className="money-card__header"><h3>{title || 'Sin título'}</h3></header>}
      <div className="money-card__content">
        <section className="money-card__metric">
          <strong>{availableAmount || '$ 0'}</strong>
          <span>{availableLabel || 'Disponible'}</span>
          <button type="button" onClick={onTransfer}>{transferLabel || 'Transferir dinero'}</button>
        </section>
        <section className="money-card__metric money-card__metric--secondary">
          <strong>{accountAmount || '$ 0'}</strong>
          <span>{accountLabel || 'En cuenta'}</span>
        </section>
      </div>
      <footer className="money-card__footer">
        <button type="button" onClick={onNavigate}><span>Ir a Mercado Pago</span><ChevronRight aria-hidden="true" size={20} strokeWidth={2} /></button>
      </footer>
    </article>
  )
}
