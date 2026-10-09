import type { ComponentStatus } from '../../domain/summary-builder'

export function StatusPill({ status }: { status: ComponentStatus }) {
  return <span className={`status ${status === 'En revisión' ? 'status--review' : ''}`}>{status}</span>
}
