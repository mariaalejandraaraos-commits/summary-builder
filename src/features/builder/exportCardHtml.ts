type CardMode = 'demo' | 'visual'

type ExportOptions = {
  card: HTMLElement | null
  title: string
  device: 'desktop' | 'mobile'
  mode: CardMode
  styles: string
}

type ContextExportOptions = {
  context: HTMLElement | null
  title: string
  styles: string
  scope?: 'card-context' | 'mobile-section' | 'mobile-card'
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)
}

function staticCardMarkup(card: HTMLElement) {
  const clone = card.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.reputation-demo__delete-slot').forEach((button) => button.remove())
  clone.querySelectorAll('.reputation-demo__edit-figma').forEach((button) => button.remove())
  clone.querySelectorAll('input').forEach((input) => {
    const text = document.createElement('span')
    text.className = input.className || 'review-card-title'
    text.textContent = input.value || input.placeholder || 'Título'
    input.replaceWith(text)
  })
  clone.querySelectorAll('button').forEach((button) => {
    const content = document.createElement('div')
    content.className = button.className
    for (const attribute of button.attributes) {
      if (attribute.name.startsWith('data-')) content.setAttribute(attribute.name, attribute.value)
    }
    while (button.firstChild) content.appendChild(button.firstChild)
    button.replaceWith(content)
  })
  clone.querySelectorAll('label.visually-hidden').forEach((label) => label.remove())
  clone.querySelectorAll('.is-selected, .is-over').forEach((element) => element.classList.remove('is-selected', 'is-over'))
  clone.querySelectorAll('.reputation-demo__empty-slot').forEach((element) => { element.textContent = 'Slot sin configurar' })
  return clone.outerHTML
}

export function downloadCardHtml({ card, title, device, mode, styles }: ExportOptions) {
  if (!card) return false
  const displayTitle = title.trim() || 'Nueva card'
  const hasPromptSketch = Boolean(card.querySelector('.reputation-demo__prompt-preview'))
  const hasFigmaPreview = Boolean(card.querySelector('.reputation-demo__figma-render img'))
  const hasUploadedFigmaPreview = Boolean(card.querySelector('[data-preview-source="upload"]'))
  const rootClass = mode === 'visual' ? `visual-card-editor visual-card-editor--${device} review-visual-root` : 'review-demo-root'
  const stageClass = mode === 'demo' ? 'reputation-demo__stage review-stage' : 'review-stage'
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(displayTitle)} · Propuesta de card</title>
<style>
:root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; color: #202124; background: #f7f8fa; }
${styles}
.review-page { width: min(100% - 32px, 900px); margin: 40px auto; }
.review-heading { margin-bottom: 20px; }
.review-heading p { margin: 0 0 5px; color: #69717c; font-size: 12px; }
.review-heading h1 { margin: 0; font-size: 24px; line-height: 1.25; }
.review-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.review-toolbar span { color: #69717c; font-size: 12px; }
.review-device { display: inline-flex; gap: 3px; padding: 3px; background: #e9edf2; border-radius: 8px; }
.review-device button { min-height: 32px; padding: 0 12px; border: 0; border-radius: 6px; color: #424a55; background: transparent; cursor: pointer; font: inherit; font-size: 12px; }
.review-device button[aria-pressed="true"] { color: #202124; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / 12%); font-weight: 700; }
.review-device button:focus-visible { outline: 2px solid #3483fa; outline-offset: 2px; }
.review-visual-root { display: block; min-height: 0; }
.review-stage { min-height: 450px; display: grid; place-items: start center; padding: 55px 16px; border: 1px solid #e1e5ea; background-color: #f1f2f4; background-image: radial-gradient(circle, #b8bec8 1.1px, transparent 1.2px); background-size: 17px 17px; border-radius: 10px; }
.review-stage .reputation-demo__card { flex: none; }
.review-stage[data-device="mobile"] .reputation-demo__card { width: min(320px, 100%); }
.review-visual-root .visual-card { width: min(270px, 100%); }
.review-visual-root.visual-card-editor--mobile .visual-card { width: min(320px, 100%); }
.reputation-demo__card-header .review-card-title { display: block; width: 100%; color: #191919; font-size: 14px; font-weight: 600; }
.visual-card__header .visual-card__title { display: block; min-height: 0; border: 0; }
.review-stage .reputation-demo__empty-slot { cursor: default; }
.review-note { margin: 12px 0 0; color: #69717c; font-size: 11px; line-height: 1.45; }
@media (max-width: 600px) { .review-page { margin: 22px auto; } .review-toolbar { align-items: start; flex-direction: column; } .review-stage { min-height: 320px; padding-top: 30px; } }
</style>
</head>
<body>
<main class="review-page">
  <header class="review-heading"><p>Summary Builder · Propuesta para revisión</p><h1>${escapeHtml(displayTitle)}</h1></header>
  <div class="review-toolbar"><span>Vista previa de la card</span><div class="review-device" role="group" aria-label="Tamaño de vista previa"><button type="button" data-view="desktop" aria-pressed="${device === 'desktop'}">Desktop</button><button type="button" data-view="mobile" aria-pressed="${device === 'mobile'}">Mobile</button></div></div>
  <div id="review-root" class="${rootClass}"><div id="review-stage" class="${stageClass}" data-device="${device}">${staticCardMarkup(card)}</div></div>
  <p class="review-note">Propuesta visual para compartir y comentar. Abre este archivo en un navegador; no necesita el Builder.${hasUploadedFigmaPreview ? ' La imagen de Figma se cargó manualmente para la demo y no se actualiza desde el enlace.' : hasFigmaPreview ? ' La preview de Figma queda incluida en esta propuesta.' : ''}${hasPromptSketch ? ' Verifica los datos antes de usarla; los campos sin cifras se muestran como pendientes. Este borrador no certifica cumplimiento de Summary o Andes X.' : ''}</p>
</main>
<script>
  var stage = document.getElementById('review-stage');
  var root = document.getElementById('review-root');
  document.querySelectorAll('[data-view]').forEach(function(button) {
    button.addEventListener('click', function() {
      var view = button.getAttribute('data-view');
      stage.setAttribute('data-device', view);
      root.classList.toggle('visual-card-editor--mobile', view === 'mobile');
      root.classList.toggle('visual-card-editor--desktop', view === 'desktop');
      document.querySelectorAll('[data-view]').forEach(function(item) { item.setAttribute('aria-pressed', String(item === button)); });
    });
  });
</script>
</body>
</html>`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${displayTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || 'nueva-card'}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

export function downloadContextHtml({ context, title, styles, scope = 'card-context' }: ContextExportOptions) {
  if (!context) return false
  const displayTitle = title.trim() || (scope === 'mobile-section' ? 'Nueva sección' : 'Nueva card')
  const clone = context.cloneNode(true) as HTMLElement
  clone.querySelectorAll('input, label.visually-hidden, [data-builder-only]').forEach((element) => element.remove())
  clone.querySelectorAll('.is-selected, .is-over').forEach((element) => element.classList.remove('is-selected', 'is-over'))
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(displayTitle)} · ${scope !== 'card-context' ? 'Revisión en mobile' : 'Revisión en contexto'}</title>
<style>
:root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; color: #202124; background: #f7f8fa; }
${styles}
.review-context-page { width: min(100% - 32px, 1180px); margin: 40px auto; }
.review-context-heading { margin-bottom: 22px; }
.review-context-heading p { margin: 0 0 5px; color: #69717c; font-size: 12px; }
.review-context-heading h1 { margin: 0; font-size: 24px; line-height: 1.25; }
.review-context-note { margin: 16px 0 0; color: #69717c; font-size: 12px; line-height: 1.5; }
.review-context-page button { cursor: default; }
@media (max-width: 600px) { .review-context-page { margin: 22px auto; } }
</style>
</head>
<body>
<main class="review-context-page">
  <header class="review-context-heading"><p>Summary Builder · Propuesta para revisión</p><h1>${escapeHtml(displayTitle)}</h1></header>
  ${clone.outerHTML}
  <p class="review-context-note">${scope === 'mobile-card' ? 'Propuesta de card para mobile con contenido de ejemplo editable. Verifica los datos antes de usarla.' : scope === 'mobile-section' ? 'Propuesta de sección agrupadora para mobile. Verifica los datos y las condiciones de cada elemento antes de usarla.' : 'La propuesta incluye la revisión de la card dentro del Template desktop y su adaptación a mobile. Verifica los datos antes de usarla; esta demo no certifica cumplimiento de Summary o Andes X.'}</p>
</main>
</body>
</html>`
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${displayTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || (scope === 'mobile-section' ? 'nueva-seccion' : 'nueva-card')}-${scope !== 'card-context' ? 'mobile' : 'contexto'}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
