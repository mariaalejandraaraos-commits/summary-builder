import { useState } from 'react'
import { ChevronRight, MoreVertical } from 'lucide-react'
import gaugeBase from '../../assets/credits-scoring/gauge-base.svg?raw'
import gaugeProgress from '../../assets/credits-scoring/gauge-progress.svg?raw'
import sparkleShape from '../../assets/recommendation-card/sparkle.svg?raw'
import type { ReferenceState } from './RemainingCards'

const svgUrl = (source: string) => `data:image/svg+xml,${encodeURIComponent(source)}`

export type CreditIndicatorMode = 'legacy' | 'circular' | 'none'

type CreditScoringCardProps = {
  title: string
  score: string
  description: string
  infoLink: string
  recommendation: string
  recommendationAction: string
  footer: string
  showTitle?: boolean
  showNewBadge?: boolean
  showRecommendation?: boolean
  indicatorMode?: CreditIndicatorMode
  state?: ReferenceState
  onInfoLink: () => void
  onRecommendationAction: () => void
  onHideRecommendation: () => void
  onNavigate: () => void
  onRetry?: () => void
}

function ScoreGauge({ score, mode }: { score: string; mode: Exclude<CreditIndicatorMode, 'none'> }) {
  const numericScore = Math.min(1000, Math.max(0, Number.parseInt(score, 10) || 0))
  const progress = numericScore / 1000
  return <div className={`credit-scoring__gauge credit-scoring__gauge--${mode}`} role="img" aria-label={`Score: ${numericScore} de 1000`}>
    {mode === 'legacy' && numericScore === 399 ? <><img src={svgUrl(gaugeBase)} alt="" /><img src={svgUrl(gaugeProgress)} alt="" /></> : mode === 'legacy' ? <svg viewBox="0 0 86 68" aria-hidden="true"><path d="M8.8 66 A40.9 40.9 0 1 1 77.2 66" fill="none" stroke="#d0d4e6" strokeWidth="4" strokeLinecap="round" /><path d="M8.8 66 A40.9 40.9 0 1 1 77.2 66" fill="none" stroke="#3483fa" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${progress * 176} 176`} /></svg> : <svg viewBox="0 0 86 68" aria-hidden="true"><circle cx="43" cy="34" r="30" fill="none" stroke="#d0d4e6" strokeWidth="4" /><circle cx="43" cy="34" r="30" fill="none" stroke="#3483fa" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${progress * 188.5} 188.5`} transform="rotate(-90 43 34)" /></svg>}
    <strong>{score}</strong>
  </div>
}

export function CreditScoringCard({ title, score, description, infoLink, recommendation, recommendationAction, footer, showTitle = true, showNewBadge = true, showRecommendation = true, indicatorMode = 'legacy', state = 'Normal', onInfoLink, onRecommendationAction, onHideRecommendation, onNavigate, onRetry }: CreditScoringCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <article className="credit-scoring-card" aria-label={title}>
    {showTitle && <header className="credit-scoring-card__header"><h3>{title || 'Sin título'}</h3>{showNewBadge && <span>NOVA</span>}</header>}
    <div className="credit-scoring-card__content">
      {state === 'Normal' ? <>
        <div className="credit-scoring__summary"><div className="credit-scoring__description"><p>{description}</p><button type="button" onClick={onInfoLink}>{infoLink}</button></div>{indicatorMode !== 'none' && <ScoreGauge score={score} mode={indicatorMode} />}</div>
        {showRecommendation && <section className="credit-scoring__recommendation"><div className="credit-scoring__recommendation-heading"><img src={svgUrl(sparkleShape)} alt="" /><strong>Recomendação</strong><button type="button" aria-label="Opções da recomendação" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreVertical size={16} /></button></div>{menuOpen && <div className="credit-scoring__recommendation-menu"><button type="button" onClick={() => { setMenuOpen(false); onHideRecommendation() }}>Ocultar recomendação</button></div>}<p>{recommendation}</p><button type="button" onClick={onRecommendationAction}>{recommendationAction}</button></section>}
      </> : state === 'Cargando' ? <div className="credit-scoring__state credit-scoring__state--loading" aria-label="Carregando dados"><i /><i /><i /></div> : <div className="credit-scoring__state"><strong>{state === 'Sin datos' ? 'Ainda não há dados' : state === 'Error' ? 'Não foi possível mostrar os dados' : 'Conteúdo indisponível'}</strong>{state === 'Error' && <button type="button" onClick={onRetry}>Tentar novamente</button>}</div>}
    </div>
    <footer className="credit-scoring-card__footer"><button type="button" onClick={onNavigate}><span>{footer}</span><ChevronRight size={20} strokeWidth={2} aria-hidden="true" /></button></footer>
  </article>
}
