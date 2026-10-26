// Librería Summary: _Reputación mobile, component set 2019:11410.
export const mobileReputationVariants = [
  { value: 'MercadoLider Platinum', label: 'MercadoLíder Platinum', scale: 'green', status: 'positive' },
  { value: 'MercadoLider Gold', label: 'MercadoLíder Gold', scale: 'green', status: 'positive' },
  { value: 'MercadoLider', label: 'MercadoLíder', scale: 'green', status: 'positive' },
  { value: 'Verde', label: 'Verde', scale: 'green', status: 'positive' },
  { value: 'Verde claro', label: 'Verde claro', scale: 'light-green', status: 'positive' },
  { value: 'Amarillo', label: 'Amarillo', scale: 'yellow', status: 'caution' },
  { value: 'Naranja', label: 'Naranja', scale: 'orange', status: 'caution' },
  { value: 'Rojo', label: 'Rojo', scale: 'red', status: 'negative' },
  { value: 'Aún no tienes color', label: 'Aún no tienes color', scale: null, status: null },
] as const

export type MobileReputationVariant = typeof mobileReputationVariants[number]['value']

export function resolveMobileReputation(variant: unknown, legacyValue: string) {
  return mobileReputationVariants.find((option) => option.value === variant)
    ?? mobileReputationVariants.find((option) => option.label === legacyValue || option.value === legacyValue)
}
