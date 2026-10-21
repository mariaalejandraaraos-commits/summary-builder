import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AppShell } from './components/shell/AppShell'
import { ReputationDemoPage } from './features/builder/ReputationDemoPage'
import { monthlyPrompt, type MonthlyFrame } from './monthly-sequence'
import './index.css'
import './App.css'
import './features/builder/builder.css'
import './monthly.css'

const duration = 34
const chapters = [
  { at: 0, name: 'Card vacía' },
  { at: 1.8, name: 'Título' },
  { at: 4.6, name: 'Librería' },
  { at: 7.1, name: 'Slot configurado' },
  { at: 9.2, name: 'Mi idea' },
  { at: 13.6, name: 'Generando' },
  { at: 17.4, name: 'Propuesta' },
  { at: 21, name: 'Desktop' },
  { at: 25.2, name: 'Mobile' },
  { at: 29.2, name: 'Exportar' },
  { at: 30.6, name: 'Resultado exportado' },
]
const cues = [
  { at: 0, selector: '.reputation-demo__card', click: -1 },
  { at: 1, selector: '.reputation-demo__card-header', click: 1.8 },
  { at: 3.8, selector: '.reputation-demo__palette-slot:first-child button', click: 4.6 },
  { at: 4.75, selector: '.reputation-demo__fields select', click: 5.25 },
  { at: 5.7, selector: '.monthly-menu b', click: 7 },
  { at: 7.3, selector: '.reputation-demo__filled-slot', click: -1 },
  { at: 8.4, selector: '.reputation-demo__palette-slot:nth-child(2) button', click: 9.2 },
  { at: 9.3, selector: '.reputation-demo__source-options label:last-child', click: 9.85 },
  { at: 10, selector: '.reputation-demo__fields textarea', click: 10.65 },
  { at: 12.75, selector: '.reputation-demo__apply-idea', click: 13.6 },
  { at: 14.2, selector: '.monthly-generating', click: -1 },
  { at: 18, selector: '.reputation-demo__card', click: -1 },
  { at: 20.15, selector: '.reputation-demo__actions .button--primary', click: 21 },
  { at: 22.4, selector: '.template-context__candidate', click: -1 },
  { at: 24.4, selector: '.reputation-demo__actions .button--primary', click: 25.2 },
  { at: 26.4, selector: '.mobile-context__device', click: -1 },
  { at: 28.35, selector: '.builder-review__layout--mobile .button--primary', click: 29.2 },
]
const phaseAt = (time: number) => chapters.reduce((phase, chapter, index) => time >= chapter.at ? index : phase, 0)
const Builder = memo(ReputationDemoPage)

export function Monthly() {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [capture, setCapture] = useState(false)
  const [scale, setScale] = useState(1)
  const clock = useRef(0)
  const view = useRef<HTMLDivElement>(null)
  const pointer = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const flightLayer = useRef<HTMLDivElement>(null)
  const flight = useRef<{ element: HTMLElement; transform: string; width: number; height: number } | null>(null)
  const destination = useRef<HTMLElement | null>(null)
  const previousPhase = useRef(0)
  const cueIndex = cues.reduce((index, cue, next) => time >= cue.at ? next : index, 0)
  const cue = cues[cueIndex]
  const menuOpen = time >= 5.35 && time < 7.1
  const clicking = cue.click >= 0 && time >= cue.click && time < cue.click + .38
  const phase = phaseAt(time)
  const title = 'Mi página'.slice(0, Math.floor(Math.max(0, time - 2.8) * 11))
  const prompt = monthlyPrompt.slice(0, Math.floor(Math.max(0, time - 10.7) * 50))
  const frame: MonthlyFrame = useMemo(() => ({ phase, title, prompt }), [phase, title, prompt])

  const clearFlight = useCallback(() => {
    if (destination.current) destination.current.style.opacity = ''
    destination.current = null
    flight.current?.element.remove()
    flight.current = null
  }, [])

  const captureFlight = useCallback((nextPhase: number) => {
    clearFlight()
    if (!view.current || !flightLayer.current || ![7, 8].includes(nextPhase)) return
    const selector = nextPhase === 7 ? '.reputation-demo__stage .reputation-demo__card' : '.template-context__candidate .reputation-demo__context-card'
    const source = view.current.querySelector<HTMLElement>(selector)
    if (!source) return
    const rect = source.getBoundingClientRect()
    const base = view.current.getBoundingClientRect()
    const ratio = base.width / 1600
    const width = source.offsetWidth
    const height = source.offsetHeight
    const clone = source.cloneNode(true) as HTMLElement
    clone.querySelectorAll('input').forEach(input => {
      const text = document.createElement('strong')
      text.textContent = input.value
      input.replaceWith(text)
    })
    clone.querySelectorAll('.is-selected').forEach(node => node.classList.remove('is-selected'))
    clone.querySelectorAll('.reputation-demo__delete-slot, label.visually-hidden').forEach(node => node.remove())
    const shell = document.createElement('div')
    shell.className = 'monthly-flight sa-theme'
    shell.dataset.saTheme = 'dark'
    shell.style.width = width + 'px'
    clone.style.width = width + 'px'
    shell.append(clone)
    const transform = 'translate(' + (rect.left - base.left) / ratio + 'px,' + (rect.top - base.top) / ratio + 'px) scale(' + rect.width / ratio / width + ',' + rect.height / ratio / height + ')'
    shell.style.transform = transform
    flightLayer.current.append(shell)
    flight.current = { element: shell, transform, width, height }
  }, [clearFlight])

  useLayoutEffect(() => {
    const pending = flight.current
    if (!pending || !view.current) return
    const target = view.current.querySelector<HTMLElement>(phase === 7 ? '.template-context__candidate .reputation-demo__context-card' : '.mobile-context__device .reputation-demo__context-card')
    if (!target) { clearFlight(); return }
    const rect = target.getBoundingClientRect()
    const base = view.current.getBoundingClientRect()
    const ratio = base.width / 1600
    const transform = 'translate(' + (rect.left - base.left) / ratio + 'px,' + (rect.top - base.top) / ratio + 'px) scale(' + rect.width / ratio / pending.width + ',' + rect.height / ratio / pending.height + ')'
    target.style.opacity = '0'
    destination.current = target
    pending.element.animate([
      { transform: pending.transform, opacity: 1, offset: 0 },
      { transform, opacity: 1, offset: .82 },
      { transform, opacity: 0, offset: 1 },
    ], { duration: 1300, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).onfinish = clearFlight
  }, [phase, clearFlight])

  useEffect(() => {
    const resize = () => setScale(Math.min(window.innerWidth / 1600, (window.innerHeight - (capture ? 0 : 84)) / 900))
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [capture])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      clock.current = (clock.current + (now - last) / 1000) % duration
      last = now
      const nextPhase = phaseAt(clock.current)
      if (previousPhase.current !== nextPhase) {
        captureFlight(nextPhase)
        previousPhase.current = nextPhase
      }
      setTime(clock.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, captureFlight])

  useLayoutEffect(() => {
    const timer = window.setTimeout(() => {
      const target = view.current?.querySelector(cues[cueIndex].selector)
      const select = view.current?.querySelector('.reputation-demo__fields select')
      if (menuOpen && select && menu.current && view.current) {
        const rect = select.getBoundingClientRect()
        const base = view.current.getBoundingClientRect()
        Object.assign(menu.current.style, { right: 'auto', left: ((rect.left - base.left) / scale) + 'px', top: ((rect.bottom - base.top) / scale + 4) + 'px', width: (rect.width / scale) + 'px' })
      }
      if (target && pointer.current && view.current) {
        const rect = target.getBoundingClientRect()
        const base = view.current.getBoundingClientRect()
        pointer.current.style.transform = 'translate(' + ((rect.left - base.left + rect.width * .68) / scale) + 'px,' + ((rect.top - base.top + Math.min(rect.height * .55, 140 * scale)) / scale) + 'px)'
      }
    }, 50)
    return () => window.clearTimeout(timer)
  }, [cueIndex, phase, scale, menuOpen])

  const seek = (next: number) => { clearFlight(); previousPhase.current = phaseAt(next); clock.current = next; setTime(next); setPlaying(false) }
  const restart = () => { clearFlight(); previousPhase.current = 0; clock.current = 0; setTime(0); setPlaying(true) }

  return <main className={'monthly-player' + (capture ? ' is-capturing' : '')}>
    <div className="monthly-frame" style={{ width: 1600 * scale, height: 900 * scale }}>
      <div ref={view} className={'monthly-view' + (playing ? '' : ' is-paused')} data-phase={phase} style={{ transform: 'scale(' + scale + ')', opacity: time > duration - .4 ? (duration - time) / .4 : Math.min(1, time / .3) }}>
        <AppShell route={{ name: 'builder-editor' }} onNavigate={() => undefined}>
          <Builder monthlyFrame={frame} />
        </AppShell>
        {menuOpen && <div className="monthly-menu" ref={menu}><span>Data Graphic</span><span>Value basic</span><b>✓ Data gauge</b><span>Fallback</span><span>State description</span><span>News</span><span>Reputation</span><span>Card de recomendaciones</span></div>}
        <div className="monthly-flight-layer" ref={flightLayer} aria-hidden="true" />
        <div className={'monthly-pointer' + (clicking ? ' is-clicking' : '')} ref={pointer} aria-hidden="true"><i /><svg viewBox="0 0 36 44"><path d="M4 3 L4 32 L12 25 L20 39 L27 35 L19 22 L31 22 Z" fill="white" stroke="#131626" strokeWidth="2.5" strokeLinejoin="round" /></svg><span /></div>
        {phase >= 9 && <div className="monthly-export"><span>{phase === 9 ? '↓' : '✓'}</span><div><strong>{phase === 9 ? 'Preparando revisión…' : 'mi-pagina.html'}</strong><small>{phase === 9 ? 'Desktop + mobile' : 'Lista para compartir'}</small></div></div>}
        <span className="monthly-wip">Demo ilustrativa · Mi idea en refinamiento</span>
      </div>
    </div>
    <div className="monthly-controls">
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pausar' : 'Reproducir'}</button>
      <button onClick={restart}>Reiniciar</button>
      <input aria-label="Momento de la animación" type="range" min="0" max={duration - .1} step=".1" value={time} onChange={event => seek(Number(event.target.value))} />
      <span>{Math.floor(time).toString().padStart(2, '0')} / {duration} s</span>
      <select aria-label="Ir a una escena" value={phase} onChange={event => seek(chapters[Number(event.target.value)].at + .45)}>
        {chapters.map((chapter, index) => <option value={index} key={chapter.at}>{index + 1}. {chapter.name}</option>)}
      </select>
      <button onClick={() => setCapture(!capture)}>{capture ? 'Mostrar controles' : 'Modo grabación'}</button>
    </div>
    {capture && <button className="monthly-exit" onClick={() => setCapture(false)}>Salir de grabación</button>}
  </main>
}

createRoot(document.getElementById('root')!).render(<Monthly />)
