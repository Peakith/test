'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'

export function GenerateButton({
  action,
  label,
  loadingLabel,
  variant = 'brand',
}: {
  action: () => Promise<void>
  label: string
  loadingLabel?: string
  variant?: ButtonProps['variant']
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={variant}
        disabled={isPending}
        onClick={() => {
          setError(null)
          startTransition(async () => {
            try {
              await action()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Er ging iets mis.')
            }
          })
        }}
      >
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? (loadingLabel ?? 'Bezig...') : label}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
