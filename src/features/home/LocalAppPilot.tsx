type Props = {
  onCreateCard: () => void
  onOpenLibrary: () => void
  onExit: () => void
}

export function LocalAppPilot({ onCreateCard, onOpenLibrary, onExit }: Props) {
  return (
    <main className="local-app-pilot" aria-labelledby="local-app-pilot-title">
      <section className="local-app-pilot__window">
        <div className="local-app-pilot__bar" aria-hidden="true">
          <span /><span /><span />
          <strong><i>S</i> Summary Builder</strong>
        </div>
        <div className="local-app-pilot__content">
          <p className="eyebrow">Prueba de experiencia · App local</p>
          <h1 id="local-app-pilot-title">Ya puedes crear tu Summary</h1>
          <p className="local-app-pilot__lead">Así se abriría Summary Builder después de instalarlo en tu computadora: haces clic en su ícono y llegas directo a tu espacio de trabajo.</p>

          <ol className="local-app-pilot__steps" aria-label="Cómo funcionaría la app local">
            <li><span>1</span><div><strong>Descargas e instalas una vez</strong><small>Desde el canal interno del equipo.</small></div></li>
            <li><span>2</span><div><strong>Abres Summary Builder</strong><small>Desde el ícono de tu computadora.</small></div></li>
            <li><span>3</span><div><strong>Empiezas a trabajar</strong><small>Tus borradores se conservan en este equipo.</small></div></li>
          </ol>

          <div className="local-app-pilot__actions">
            <button className="local-app-pilot__primary" type="button" onClick={onCreateCard}>Crear una card</button>
            <button className="local-app-pilot__secondary" type="button" onClick={onOpenLibrary}>Explorar la Librería</button>
          </div>
          <p className="local-app-pilot__note">Esta pantalla no instala ni descarga nada: sirve para probar el inicio de la experiencia.</p>
        </div>
      </section>
      <button className="local-app-pilot__exit" type="button" onClick={onExit}>Volver al prototipo</button>
    </main>
  )
}
