import type { ReactNode } from 'react'

export type MobileFreeSlotParts = {
  preview: ReactNode
  editor: ReactNode
  hasContent: boolean
  complete: boolean
  activate: () => void
}

// The existing card editor owns this opaque draft and normalizes it on restore.
export type MobileFreeSlotBuilderProps = {
  draft: unknown
  onChange: (draft: unknown) => void
  children: (parts: MobileFreeSlotParts) => ReactNode
}
