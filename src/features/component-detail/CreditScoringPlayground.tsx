import { useState } from 'react'
import { CreditScoringCard, type CreditIndicatorMode } from './CreditScoringCard'
import type { ReferenceState } from './RemainingCards'

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="playground-toggle"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="playground-toggle__track" aria-hidden="true"><span /></span></label>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="playground-field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

export function CreditScoringPlayground() {
  const [title, setTitle] = useState('Empréstimos para seu negócio')
  const [score, setScore] = useState('399')
  const [description, setDescription] = useState('Um bom score é o que pode te ajudar a ter crédito.')
  const [infoLink, setInfoLink] = useState('Text link')
  const [recommendation, setRecommendation] = useState('Conecte dados de outros bancos e melhore seu score.')
  const [recommendationAction, setRecommendationAction] = useState('Conectar bancos')
  const [footer, setFooter] = useState('Ir para Empréstimos')
  const [showTitle, setShowTitle] = useState(true)
  const [showNewBadge, setShowNewBadge] = useState(true)
  const [showRecommendation, setShowRecommendation] = useState(true)
  const [indicatorMode, setIndicatorMode] = useState<CreditIndicatorMode>('legacy')
  const [state, setState] = useState<ReferenceState>('Normal')
  const [darkMode, setDarkMode] = useState(false)
  const [interaction, setInteraction] = useState('Prueba las variantes y los accesos del componente.')
  const navigate = (destination: string) => setInteraction(`Se abriría ${destination}.`)

  return <div className="playground-layout">
    <aside className="playground-controls" aria-label="Propiedades del componente">
      <section><h2>Propiedades</h2><Switch label="Título del componente" checked={showTitle} onChange={setShowTitle} /><Switch label="Etiqueta NOVA" checked={showNewBadge} onChange={setShowNewBadge} /><Switch label="Recomendación" checked={showRecommendation} onChange={setShowRecommendation} /></section>
      <section><h2>Contenido</h2><Field label="Título" value={title} onChange={setTitle} /><Field label="Score" value={score} onChange={setScore} /><Field label="Descripción" value={description} onChange={setDescription} /><Field label="Link informativo" value={infoLink} onChange={setInfoLink} /><Field label="Recomendación" value={recommendation} onChange={setRecommendation} /><Field label="Acción de recomendación" value={recommendationAction} onChange={setRecommendationAction} /><Field label="Acceso principal" value={footer} onChange={setFooter} /></section>
      <section><h2>Variantes</h2><label className="playground-field"><span>Indicador</span><select value={indicatorMode} onChange={(event) => setIndicatorMode(event.target.value as CreditIndicatorMode)}><option value="legacy">Velocímetro · Figma</option><option value="circular">Indicador circular</option><option value="none">Sin score</option></select></label><label className="playground-field"><span>Estado del componente</span><select value={state} onChange={(event) => setState(event.target.value as ReferenceState)}><option>Normal</option><option>Cargando</option><option>Sin datos</option><option>Error</option><option>No disponible</option></select></label></section>
      <section><h2>Tema</h2><Switch label="Modo oscuro" checked={darkMode} onChange={setDarkMode} /></section>
    </aside>
    <section className="playground-stage" aria-label="Vista previa en tiempo real"><strong className="playground-stage__label">Vista previa en tiempo real</strong><div className={`preview-canvas preview-canvas--reference ${darkMode ? 'preview-canvas--dark' : ''}`}><CreditScoringCard title={title} score={score} description={description} infoLink={infoLink} recommendation={recommendation} recommendationAction={recommendationAction} footer={footer} showTitle={showTitle} showNewBadge={showNewBadge} showRecommendation={showRecommendation} indicatorMode={indicatorMode} state={state} onInfoLink={() => navigate(infoLink)} onRecommendationAction={() => navigate(recommendationAction)} onHideRecommendation={() => { setShowRecommendation(false); setInteraction('Recomendación oculta. Puedes restaurarla con el switch.') }} onNavigate={() => navigate(footer)} onRetry={() => { setState('Normal'); setInteraction('Los datos se recuperaron correctamente.') }} /></div><p className="playground-stage__feedback" aria-live="polite">{interaction}</p></section>
  </div>
}
