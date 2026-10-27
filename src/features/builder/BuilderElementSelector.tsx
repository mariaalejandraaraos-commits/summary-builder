import type { BuilderElementKind } from '../../domain/mobile-sections'
import './mobile-sections.css'

export function BuilderElementSelector({ value, onChange, cardDescription = 'Construye una card con slots en su interior.' }: {
  value: BuilderElementKind
  onChange: (value: BuilderElementKind) => void
  cardDescription?: string
}) {
  return <fieldset className="builder-element-selector">
    <legend>Tipo de elemento</legend>
    <div>
      <label><input type="radio" name="builder-element-kind" value="card" checked={value === 'card'} onChange={() => onChange('card')} /><span>Card</span></label>
      <label><input type="radio" name="builder-element-kind" value="mobile-section" checked={value === 'mobile-section'} onChange={() => onChange('mobile-section')} /><span>Sección agrupadora</span></label>
    </div>
    {value === 'card' && <p>{cardDescription}</p>}
  </fieldset>
}
