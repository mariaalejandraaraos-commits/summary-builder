import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const result = await build({
  root,
  build: { write: false, rollupOptions: { input: resolve(root, 'monthly.html') }, assetsInlineLimit: 10_000_000 },
})
const output = (Array.isArray(result) ? result[0] : result).output
const page = output.find(item => item.type === 'asset' && item.fileName.endsWith('.html'))
let html = String(page.source)
for (const item of output) {
  if (item.type === 'chunk' && item.isEntry) html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/, () => '<script type="module">' + item.code.replace(/<\/script/gi, '<\\/script') + '</script>')
  if (item.type === 'asset' && item.fileName.endsWith('.css')) html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/, () => '<style>' + item.source + '</style>')
}
// Include asset URLs from raw export CSS as well as the normal Vite graph.
for (const [name, mime] of [['regular', 'font/woff2'], ['light', 'font/woff2'], ['semibold', 'font/woff2'], ['bold', 'font/woff2']]) {
  const data = await readFile(resolve(root, 'src/assets/fonts/proximanova-' + name + '.woff2'))
  html = html.replaceAll('./assets/fonts/proximanova-' + name + '.woff2', 'data:' + mime + ';base64,' + data.toString('base64'))
}
await writeFile(resolve(root, 'summary-builder-animation.html'), html)
console.log('Monthly HTML generated from the real Builder UI (' + Math.round(Buffer.byteLength(html) / 1024) + ' KB)')
