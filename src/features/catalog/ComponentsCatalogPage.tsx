import { StatusPill } from '../../components/ui/StatusPill'
import type { SummaryComponent } from '../../domain/summary-builder'
import { ComponentPreview } from './ComponentPreview'

type Props = {
  components: SummaryComponent[]
  onOpenComponent: (componentId: string) => void
  onAddToBuilder: (componentId: string) => void
}

export function ComponentsCatalogPage({ components, onOpenComponent, onAddToBuilder }: Props) {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Fuente de verdad</p>
          <h1>Librería</h1>
          <p className="lead">
            Consulta las cards, sus reglas, variantes y casos de uso. Agrega al Builder las que quieras probar.
          </p>
        </div>
        <span className="library-total">{components.length} componentes</span>
      </header>

      <input className="search" aria-label="Filtrar por nombre" placeholder="Filtrar por nombre…" />

      <div className="catalog-toolbar">
        <select aria-label="Categoría"><option>Categoría</option></select>
        <select aria-label="País"><option>País</option></select>
        <select aria-label="Estado"><option>Estado</option></select>
        <select aria-label="Template relacionado"><option>Template relacionado</option></select>
        <span className="catalog-count">{components.length} componentes encontrados</span>
      </div>

      <div className="component-grid">
        {components.map((component) => (
          <article className="component-card" key={component.id}>
            <div className="component-card__preview">
              <ComponentPreview componentId={component.id} />
            </div>
            <div className="component-card__body">
              <h3>
                <button className="component-card__open" type="button" onClick={() => onOpenComponent(component.id)}>
                  {component.name}
                </button>
              </h3>
              <p>{component.description}</p>
              <div className="meta-row">
                <span>{component.category}</span>
                <span>{component.countries.join(', ')}</span>
              </div>
              <div className="meta-row meta-row--spaced">
                <StatusPill status={component.status} />
                <span>{component.templatesCount} templates</span>
              </div>
              <button className="library-add-button" type="button" onClick={() => onAddToBuilder(component.id)}>
                Agregar al Builder
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
