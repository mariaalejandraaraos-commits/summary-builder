import { ImagePlus, LockKeyhole, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { TasksCard, type PublicationTaskGroup } from './PublicationTasksCard'

const noop = () => undefined

const mlbGroups: PublicationTaskGroup[] = [
  { id: 'mlb-questions', title: 'Perguntas', value: '0', description: 'Por responder', hasNavigation: true, tasks: [] },
  { id: 'mlb-listings', title: 'Anúncios', value: '124', description: 'A melhorar', hasNavigation: true, tasks: [] },
  {
    id: 'mlb-prices',
    title: 'Preços',
    value: '10',
    description: 'Para gerenciar',
    hasNavigation: true,
    tasks: [{ id: 'mlb-price', text: 'Com preço não competitivo', badge: { text: '3', color: 'red' } }],
  },
  { id: 'mlb-advertising', title: 'Publicidade', value: '0', description: 'Sugestões', hasNavigation: true, tasks: [] },
]

const cbtBasicListings: PublicationTaskGroup[] = [
  { id: 'cbt-basic-questions', title: 'Questions', value: '0', description: 'To answer', hasNavigation: true, tasks: [] },
  { id: 'cbt-basic-listings', title: 'Listings', value: '2', description: 'To improve', hasNavigation: true, tasks: [] },
  { id: 'cbt-basic-prices', title: 'Prices', value: '0', description: 'To manage', hasNavigation: true, tasks: [] },
]

const cbtOrders: PublicationTaskGroup[] = [
  { id: 'cbt-orders-shipping', title: 'To be shipped', value: '0', description: 'To manage', hasNavigation: true, tasks: [] },
  { id: 'cbt-orders-after-sales', title: 'After-sales', value: '0', description: 'To manage', hasNavigation: true, tasks: [] },
]

const cbtM4Listings: PublicationTaskGroup[] = [
  { id: 'cbt-m4-questions', title: 'Questions', value: '0', description: 'To answer', hasNavigation: true, tasks: [] },
  { id: 'cbt-m4-listings', title: 'Listings', value: '9', description: 'To improve', hasNavigation: true, tasks: [] },
  {
    id: 'cbt-m4-full',
    title: 'Full products',
    value: '6',
    description: 'To manage',
    summaryBadge: 'red',
    hasNavigation: true,
    tasks: [
      { id: 'cbt-m4-clearance', text: 'About to go on clearance', badge: { text: '1', color: 'red' } },
      { id: 'cbt-m4-replenish', text: 'To replenish urgently', badge: { text: '5', color: 'red' } },
    ],
  },
  { id: 'cbt-m4-prices', title: 'Prices', value: '0', description: 'To manage', hasNavigation: true, tasks: [] },
]

const cbtM6Groups: PublicationTaskGroup[] = [
  {
    id: 'cbt-m6-full',
    title: 'Full products',
    value: '10',
    description: 'To manage',
    summaryBadge: 'red',
    hasNavigation: false,
    defaultExpanded: true,
    tasks: [
      { id: 'cbt-m6-stock', text: 'Stock not up for sale', badge: { text: '7', color: 'red' } },
      { id: 'cbt-m6-slow', text: 'Slow moving listings', badge: { text: '3', color: 'gray' } },
    ],
  },
  {
    id: 'cbt-m6-listings',
    title: 'Listings',
    value: '327',
    description: 'To improve',
    hasNavigation: true,
    defaultExpanded: true,
    tasks: [{ id: 'cbt-m6-inactive', text: 'Inactive out of stock', badge: { text: '327', color: 'gray' } }],
  },
]

const onboardingSummaryGroups: PublicationTaskGroup[] = [
  { id: 'onboarding-questions', title: 'Preguntas', value: '15', description: 'Por responder', summaryBadge: 'red', hasNavigation: true, tasks: [] },
  {
    id: 'onboarding-publications',
    title: 'Publicaciones',
    value: '4',
    description: 'Por mejorar',
    summaryBadge: 'red',
    hasNavigation: true,
    tasks: [
      { id: 'onboarding-stock', text: 'Sin stock', badge: { text: '2', color: 'red' } },
      { id: 'onboarding-policy', text: 'Inactivas por incumplir políticas', badge: { text: '2', color: 'red' } },
    ],
  },
]

function TasksPreview({ title, groups }: { title: string; groups: PublicationTaskGroup[] }) {
  return <TasksCard title={title} groups={groups} showTitle compact={false} shortContainer onNavigate={noop} onRetry={noop} />
}

function UseCaseShowcase({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <article className={`use-case-showcase ${wide ? 'use-case-showcase--wide' : ''}`}>
      <div className="use-case-showcase__preview">{children}</div>
      <span className="use-case-showcase__label">{label}</span>
    </article>
  )
}

function UseCaseSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="use-case-section">
      <header className="use-case-section__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </header>
      <div className="use-case-grid">{children}</div>
    </section>
  )
}

function MyPageContextCard() {
  return (
    <article className="my-page-context-card" aria-label="Card de contexto Mi página">
      <strong>My page</strong>
      <div className="my-page-context-card__metrics">
        <span><b>0</b><small>Visits</small></span>
        <span><b>0</b><small>New followers</small></span>
      </div>
      <p>Last 30 days</p>
      <a href="#use-cases-top" onClick={(event) => event.preventDefault()}>Go to My page <span aria-hidden="true">›</span></a>
    </article>
  )
}

function LockedOnboardingCard() {
  return (
    <article className="onboarding-shell onboarding-shell--locked" aria-label="Pendientes en tus publicaciones bloqueado">
      <header><LockKeyhole aria-hidden="true" size={16} /><strong>Pendientes en tus publicaciones</strong></header>
      <p>Completá la activación y configuración de tu cuenta para desbloquear este acceso.</p>
    </article>
  )
}

function ChallengeCard({ second = false }: { second?: boolean }) {
  return (
    <article className="challenge-card">
      <span className="challenge-card__badge">Listo para vender | Desafío {second ? '2' : '1'} <Sparkles aria-hidden="true" size={12} /></span>
      <div className="challenge-card__body">
        <span className="challenge-card__illustration" aria-hidden="true"><ImagePlus size={38} strokeWidth={1.6} /></span>
        <strong>{second ? 'Mejorá tus fotos con nuestro editor con inteligencia artificial' : 'Creá tu primera publicación'}</strong>
        <p>{second ? 'Creá fondos realistas que destaquen tus productos.' : 'Hacelo fácil y rápido usando nuestras herramientas de IA.'}</p>
        {second && <div className="challenge-card__product"><span aria-hidden="true">📱</span><small>Xiaomi Redmi 9 4g Lte para tu publicación</small></div>}
        <div className="challenge-card__actions">
          <button type="button">{second ? 'Usar editor' : 'Crear publicación'}</button>
          <button className="challenge-card__help" type="button"><Sparkles aria-hidden="true" size={12} /> Quiero ayuda</button>
        </div>
      </div>
    </article>
  )
}

export function PublicationTasksUseCases() {
  return (
    <div className="use-cases-content" id="use-cases-top">
      <header className="use-cases-intro">
        <div>
          <span className="guideline-kicker">Implementaciones relevadas</span>
          <h2>Pendientes en tus publicaciones en contexto</h2>
          <p>Los ejemplos reproducen las variantes registradas en Figma y las presentan como una vitrina de casos, siguiendo la estructura del referente de Grid.</p>
        </div>
        <span className="use-cases-intro__count">7 ejemplos</span>
      </header>

      <UseCaseSection title="MLB" description="Versión localizada para Brasil, con contenido y métricas en portugués.">
        <UseCaseShowcase label="MLB · Venta local · Portugués">
          <TasksPreview title="Pendências nos seus anúncios" groups={mlbGroups} />
        </UseCaseShowcase>
      </UseCaseSection>

      <UseCaseSection title="CBT · T1, T3 y T6" description="Composición compacta que separa los pendientes de publicaciones y pedidos.">
        <UseCaseShowcase label="CBT · T1, T3 y T6 · Listings + Orders" wide>
          <div className="use-case-paired-cards">
            <TasksPreview title="Pending tasks in Listings" groups={cbtBasicListings} />
            <TasksPreview title="Pending tasks in Orders" groups={cbtOrders} />
          </div>
        </UseCaseShowcase>
      </UseCaseSection>

      <UseCaseSection title="CBT · M4 y M6" description="Dos densidades de información: contexto de Summary y categorías desplegadas.">
        <UseCaseShowcase label="CBT · M4 · Pendientes dentro del Summary" wide>
          <div className="use-case-context-stack">
            <TasksPreview title="Pending tasks in Listings" groups={cbtM4Listings} />
            <MyPageContextCard />
          </div>
        </UseCaseShowcase>
        <UseCaseShowcase label="CBT · M6 · Categorías con detalle">
          <TasksPreview title="Pending tasks in Listings" groups={cbtM6Groups} />
        </UseCaseShowcase>
      </UseCaseSection>

      <UseCaseSection title="Onboarding" description="Estados que acompañan la activación: acceso bloqueado, primer desafío y recomendación contextual.">
        <UseCaseShowcase label="Onboarding · Acceso bloqueado">
          <LockedOnboardingCard />
        </UseCaseShowcase>
        <UseCaseShowcase label="Onboarding · Desafío 1">
          <div className="onboarding-shell">
            <header><strong>Pendientes en tus publicaciones</strong></header>
            <ChallengeCard />
          </div>
        </UseCaseShowcase>
        <UseCaseShowcase label="Onboarding · Desafío 2 dentro del Summary" wide>
          <div className="onboarding-combined-preview">
            <TasksPreview title="Pendientes en tus publicaciones" groups={onboardingSummaryGroups} />
            <ChallengeCard second />
          </div>
        </UseCaseShowcase>
      </UseCaseSection>
    </div>
  )
}
