import { useState } from 'react'
import { StatusPill } from '../../components/ui/StatusPill'
import type { SummaryComponent } from '../../domain/summary-builder'
import { ComponentPreview } from './ComponentPreview'

type Props = {
  components: SummaryComponent[]
  onOpenComponent: (componentId: string) => void
  onAddToBuilder: (componentId: string) => void
}

export function ComponentsCatalogPage({ components, onOpenComponent, onAddToBuilder }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('')
  const [status, setStatus] = useState('')
  const categories = [...new Set(components.map((component) => component.category))].sort()
  const countries = [...new Set(components.flatMap((component) => component.countries))].sort()
  const statuses = [...new Set(components.map((component) => component.status))].sort()
  const visibleComponents = (() => {
    const search = query.trim().toLocaleLowerCase()
    return components.filter((component) => {
      const matchesSearch = !search || `${component.name} ${component.description} ${component.category}`.toLocaleLowerCase().includes(search)
      return matchesSearch && (!category || component.category === category) && (!country || component.countries.includes(country)) && (!status || component.status === status)
    })
  })()

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catálogo de referencia</p>
          <h1>Librería</h1>
          <p className="lead">
            Encuentra un patrón existente antes de crear una card. Revisa su estado y casos de uso antes de probarlo en el Builder.
          </p>
        </div>
        <span className="library-total">{components.length} componentes</span>
      </header>

      <input className="search" aria-label="Filtrar por nombre" placeholder="Busca por necesidad, card o categoría…" value={query} onChange={(event) => setQuery(event.target.value)} />

      <div className="catalog-toolbar">
        <select aria-label="Categoría" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Categoría</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="País" value={country} onChange={(event) => setCountry(event.target.value)}><option value="">País</option>{countries.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Estado" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Estado</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        <span className="catalog-count">{visibleComponents.length} componentes encontrados</span>
      </div>

      <div className="component-grid">
        {visibleComponents.map((component) => (
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
                Probar este patrón
              </button>
            </div>
          </article>
        ))}
      </div>
      {visibleComponents.length === 0 && <p className="catalog-empty" role="status">No encontramos un patrón con esos filtros. Puedes ajustar la búsqueda o volver al Builder para proponer una card nueva.</p>}
    </section>
  )
}
