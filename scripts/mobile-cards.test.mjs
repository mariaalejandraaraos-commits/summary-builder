import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createMobileCardDraft, mobileCardKinds, restoreMobileCardsSession } from '../src/domain/mobile-cards.ts'

test('restores independently edited card drafts, empty fields and hidden blocks', () => {
  const session = restoreMobileCardsSession(null)
  session.kind = 'my-page'
  session.drafts.billing.fields.balance = '$ 42.000'
  session.drafts['my-page'].fields.title = 'Mi comunidad'
  session.drafts['my-page'].fields.recommendation = ''
  session.drafts['my-page'].showRecommendation = false
  const restored = restoreMobileCardsSession(JSON.parse(JSON.stringify(session)))
  assert.deepEqual(restored, session)
  assert.equal(restored.drafts.competitiveness.fields.title, 'Competitividad de precios')
  assert.equal(restoreMobileCardsSession(null).drafts.billing.fields.balance, '$ 15.000')
})

test('recovers missing or invalid fields without replacing valid user edits', () => {
  const restored = restoreMobileCardsSession({ version: 1, kind: 'unknown', drafts: {
    billing: { fields: { balance: '$ 42.000', title: 123, unexpected: '<script>' }, showRecommendation: 'false' },
    credits: null,
  } })
  assert.equal(restored.kind, 'free')
  assert.equal(restored.drafts.billing.fields.balance, '$ 42.000')
  assert.equal(restored.drafts.billing.fields.title, 'Facturación')
  assert.equal(restored.drafts.billing.fields.unexpected, undefined)
  for (const kind of mobileCardKinds) assert.ok(restored.drafts[kind].fields.title)
})

test('resetting one reference leaves other cards intact', () => {
  const session = restoreMobileCardsSession(null)
  session.drafts.billing.fields.title = 'Mis facturas'
  session.drafts.credits.fields.title = 'Mi crédito'
  session.drafts.billing = createMobileCardDraft('billing')
  assert.equal(session.drafts.billing.fields.title, 'Facturación')
  assert.equal(session.drafts.credits.fields.title, 'Mi crédito')
  for (const invalid of [null, [], 'bad data', { version: 99, kind: 'billing' }]) {
    assert.equal(restoreMobileCardsSession(invalid).kind, 'free')
  }
})
