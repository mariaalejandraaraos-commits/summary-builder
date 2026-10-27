import { useState } from 'react'
import { mobileCardDefinitions, type MobileCardDraft, type MobileCardKind } from '../../domain/mobile-cards'
import padlock from '../../assets/mobile-cards/padlock.svg?inline'
import chevron from '../../assets/price-competitiveness/chevron-up.svg?inline'
import newsChevron from '../../assets/mobile-cards/news-chevron.svg?inline'
import check from '../../assets/mobile-sections/reputation-check.svg?inline'
import checkSmall from '../../assets/mobile-cards/check-small.svg?inline'
import gaugeBase from '../../assets/mobile-cards/gauge-base.svg?inline'
import gaugeHigh from '../../assets/mobile-cards/gauge-high.svg?inline'
import gaugeStrong from '../../assets/mobile-cards/gauge-strong.svg?inline'
import sparkle from '../../assets/mobile-cards/sparkle.svg?inline'
import overflow from '../../assets/mobile-cards/overflow.svg?inline'
import trendUp from '../../assets/mobile-sections/sales-trend.svg?inline'
import trendDown from '../../assets/mobile-sections/sales-trend-negative.svg?inline'
import iphone17 from '../../assets/mobile-cards/iphone-17.png?inline'
import iphone16 from '../../assets/mobile-cards/iphone-16.png?inline'
import iphone11 from '../../assets/mobile-cards/iphone-11.png?inline'
import './mobile-cards.css'

function Check({ small = false }: { small?: boolean }) {
  return <span className={`mobile-card__check${small ? ' mobile-card__check--small' : ''}`} role="img" aria-label="Indicador positivo"><img src={small ? checkSmall : check} alt="" /></span>
}

function Gauge({ label, high = false }: { label: string; high?: boolean }) {
  return <div className="mobile-card__gauge" role="img" aria-label={`Indicador: ${label}`}><img className="mobile-card__gauge-base" src={gaugeBase} alt="" /><img className="mobile-card__gauge-progress" src={high ? gaugeHigh : gaugeStrong} alt="" /><strong>{label}</strong></div>
}

function Benefits({ fields: f }: { fields: MobileCardDraft['fields'] }) {
  return <section className="mobile-card__benefits"><strong>{f.benefitsTitle}</strong><div>{[f.benefit1, f.benefit2].map((text, index) => <p key={index}><Check small /><span>{text}</span></p>)}</div></section>
}

function Recommendation({ fields: f, onAction, onHide }: { fields: MobileCardDraft['fields']; onAction: (label: string) => void; onHide?: () => void }) {
  const [open, setOpen] = useState(false)
  return <section className="mobile-card__recommendation"><div className="mobile-card__recommendation-title"><strong><img src={sparkle} alt="" />{f.recommendation}</strong><span className="mobile-card__recommendation-options"><img src={overflow} alt="" /><button type="button" aria-label="Opciones de recomendación" aria-expanded={open} onClick={() => setOpen((current) => !current)} data-builder-only /></span></div>{open && <div className="mobile-card__menu" data-builder-only><button type="button" onClick={() => { setOpen(false); onHide?.() }}>Ocultar recomendación</button></div>}<p>{f.recommendationDescription}</p><button type="button" className="mobile-card__link" onClick={() => onAction(f.recommendationAction)}>{f.recommendationAction}</button></section>
}

export function MobileCardPreview({ kind, draft, onAction = () => {}, onHideRecommendation }: {
  kind: MobileCardKind
  draft: MobileCardDraft
  onAction?: (label: string) => void
  onHideRecommendation?: () => void
}) {
  const f = draft.fields
  return <article className={`mobile-card mobile-card--${kind}`} aria-label={f.title} data-node-id={mobileCardDefinitions[kind].nodeId}>
    <header className="mobile-card__header">{kind === 'blocked' && <img src={padlock} alt="Card bloqueada" />}<h3>{f.title}</h3>{kind === 'competitiveness' && draft.showBadge && <span className="mobile-card__badge">{f.badge}</span>}</header>
    {kind === 'blocked' ? <p className="mobile-card__blocked-description">{f.description}</p> : <>
      <div className="mobile-card__content">
        {kind === 'billing' && <><section className="mobile-card__metric"><div><strong>{f.balance}</strong><Check /></div><small>{f.balanceLabel}</small></section><section className="mobile-card__status"><div><strong>{f.closing}</strong><i data-tone="negative" role="img" aria-label="Indicador negativo" /></div><small>{f.closingLabel}</small></section><section className="mobile-card__status"><div><strong>{f.pending}</strong><i data-tone="positive" role="img" aria-label="Indicador positivo" /></div><small>{f.dueDate}</small></section></>}
        {kind === 'advertising' && <>{[['sales', 'salesLabel', 'salesChange'], ['clicks', 'clicksLabel', 'clicksChange']].map(([value, label, delta], index) => <section className="mobile-card__metric" key={value}><div><strong>{f[value]}</strong><span className="mobile-card__delta" data-tone={index === 0 ? 'positive' : 'negative'}><span className="visually-hidden">{index === 0 ? 'Sube ' : 'Baja '}</span><span className="mobile-card__trend"><img src={index === 0 ? trendUp : trendDown} alt="" /></span>{f[delta]}</span></div><small>{f[label]}</small></section>)}</>}
        {kind === 'credits' && <><section className="mobile-card__score"><div><p>{f.description}</p><Gauge label={f.gauge} high /></div><button type="button" className="mobile-card__link" onClick={() => onAction(f.scoreAction)}>{f.scoreAction}</button></section>{draft.showRecommendation && <Recommendation fields={f} onAction={onAction} onHide={onHideRecommendation} />}</>}
        {kind === 'news' && <>{[1, 2].map((index) => <button type="button" className="mobile-card__news" key={index} onClick={() => onAction(f[`news${index}`])}><span><span className="mobile-card__news-badge">{f[`newsBadge${index}`]}</span><span className="mobile-card__news-copy">{f[`news${index}`]}</span></span><img src={newsChevron} alt="" /></button>)}</>}
        {(kind === 'my-page' || kind === 'competitiveness') && <><section className="mobile-card__followers"><Gauge label={f.gauge} /><div><div><strong>{f.followers}</strong><Check small /></div><p>{f.followersDescription}</p></div></section>{draft.showBenefits && <Benefits fields={f} />}{kind === 'my-page' && draft.showRecommendation && <Recommendation fields={f} onAction={onAction} onHide={onHideRecommendation} />}{kind === 'competitiveness' && <section className="mobile-card__products"><strong>{f.productsTitle}</strong><div>{[iphone17, iphone16, iphone11].map((src, index) => <button type="button" key={src} onClick={() => onAction(f[`product${index + 1}`])}><span className="mobile-card__thumbnail"><img src={src} alt="" /></span><span>{f[`product${index + 1}`]}</span></button>)}</div></section>}</>}
      </div>
      <footer className="mobile-card__footer"><button type="button" onClick={() => onAction(f.footer)}><span>{f.footer}</span><img src={chevron} alt="" /></button></footer>
    </>}
  </article>
}
