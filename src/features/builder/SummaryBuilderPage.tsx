import { useState } from 'react'
import type { SummaryComponent } from '../../domain/summary-builder'
import builderStyles from './builder.css?raw'
import { downloadCardHtml } from './exportCardHtml'
import { VisualCardBuilder, type CardSlot, type VisualCardConfig } from './VisualCardBuilder'

type Props = {
  components: SummaryComponent[]
  initialComponentId: string | null
}

const createEmptyCardConfig = (): VisualCardConfig => ({
  name: '',
  slots: [
    { id: 'data-1', kind: 'metric', enabled: false },
    { id: 'data-2', kind: 'news', enabled: false },
    { id: 'data-3', kind: 'metric', enabled: false },
    { id: 'data-4', kind: 'metric', enabled: false },
    { id: 'data-5', kind: 'metric', enabled: false },
    { id: 'data-6', kind: 'metric', enabled: false },
    { id: 'contextual-recommendation', kind: 'recommendation', enabled: false },
    { id: 'challenge', kind: 'challenge', enabled: false },
  ] satisfies CardSlot[],
  text: 'Texto',
  textLink: 'Text link',
  showTextLink: true,
  metricLabel: 'Alto',
  metricValue: 72,
  badge: 'NOVEDAD',
  promoTitle: 'Explora las herramientas de nuestro editor y transforma imágenes.',
  promoDescription: 'Usaremos inteligencia artificial para transformar tus imágenes y aumentar las ventas de forma automática, garantizando resultados efectivos.',
  promoCta: 'Ir a Publicaciones',
  promoImage: '',
  footerCta: 'Call to action',
  optionalData: {},
})

export function SummaryBuilderPage({ components, initialComponentId }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [notice, setNotice] = useState('')
  const [config, setConfig] = useState<VisualCardConfig>(createEmptyCardConfig)
  void initialComponentId

  const exportCard = () => {
    const card = document.querySelector<HTMLElement>('.builder-editor--visual .visual-card')
    const exported = downloadCardHtml({ card, title: config.name, device, mode: 'visual', styles: builderStyles })
    const hasExternalImage = card?.querySelector('img[src^="http://"], img[src^="https://"]')
    setNotice(exported ? hasExternalImage ? 'Se descargó el HTML. La imagen enlazada necesita conexión para verse.' : 'Se descargó un HTML con la propuesta, listo para compartir.' : 'No se pudo preparar el HTML. Intenta de nuevo.')
  }

  return (
    <section className="builder-editor builder-editor--visual" data-device={device}>
      <header className="builder-editor__topline">
        <div>
          <p className="eyebrow">Builder · Nueva card</p>
          <h1 className="builder-page-title">Arma tu card</h1>
          <p className="builder-page-description">Empieza con una card en blanco y agrega contenido en los slots del diseño original.</p>
        </div>
        <div className="builder-editor__actions">
          <button className="button button--primary" type="button" onClick={exportCard}>Descargar HTML para compartir</button>
        </div>
      </header>

      <VisualCardBuilder
        components={components}
        config={config}
        device={device}
        onChange={setConfig}
        onDeviceChange={setDevice}
      />
      <p className="builder-notice" role="status" aria-live="polite">{notice}</p>
    </section>
  )
}
