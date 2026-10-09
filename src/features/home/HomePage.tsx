import { ArrowUpRight, Blocks, LayoutTemplate } from 'lucide-react'

type HomePageProps = {
  onOpenBuilder: () => void
  onOpenLibrary: () => void
}

export function HomePage({ onOpenBuilder, onOpenLibrary }: HomePageProps) {
  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="home-page__intro">
        <p className="home-page__eyebrow">Tu espacio de trabajo</p>
        <h1 id="home-title">¿Qué necesitas?</h1>
        <p>Elige cómo quieres empezar. Puedes crear una card o explorar los componentes disponibles.</p>
      </div>

      <div className="home-page__choices">
        <button className="home-choice home-choice--builder" type="button" onClick={onOpenBuilder}>
          <span className="home-choice__top"><span className="home-choice__icon" aria-hidden="true"><LayoutTemplate size={25} strokeWidth={1.7} /></span><ArrowUpRight className="home-choice__arrow" size={22} aria-hidden="true" /></span>
          <span className="home-choice__content"><strong>Builder</strong><span>Revisa si necesitas una card nueva y arma una primera propuesta o empieza desde cero.</span></span>
          <span className="home-choice__action">Crear una card <span aria-hidden="true">→</span></span>
        </button>

        <button className="home-choice home-choice--library" type="button" onClick={onOpenLibrary}>
          <span className="home-choice__top"><span className="home-choice__icon" aria-hidden="true"><Blocks size={25} strokeWidth={1.7} /></span><ArrowUpRight className="home-choice__arrow" size={22} aria-hidden="true" /></span>
          <span className="home-choice__content"><strong>Librería</strong><span>Explora las cards, sus guías, variantes y casos de uso.</span></span>
          <span className="home-choice__action">Explorar la librería <span aria-hidden="true">→</span></span>
        </button>
      </div>
    </section>
  )
}
