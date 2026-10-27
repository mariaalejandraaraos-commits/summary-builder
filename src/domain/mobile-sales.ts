// Librería Summary: _ Atoms control panel, component set 107:5304.
export const mobileSalesPillVariants = [
  { value: 'Green', label: 'Positiva (verde)', direction: 'Suba: ' },
  { value: 'Red', label: 'Negativa (roja)', direction: 'Baja: ' },
  { value: 'No Change', label: 'Sin cambios', direction: 'Sin cambios: ' },
] as const

export type MobileSalesPillVariant = typeof mobileSalesPillVariants[number]['value']

export function resolveMobileSalesPill(variant: unknown) {
  return mobileSalesPillVariants.find((option) => option.value === variant) ?? mobileSalesPillVariants[0]
}
