import { Card, CardContent } from '@/components/ui/card'
import { Markdown } from '@/components/markdown'
import { formatDate } from '@/lib/utils'

export function OutputCard({ content, createdAt }: { content: string; createdAt?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        {createdAt && (
          <p className="mb-3 text-xs text-muted">Gegenereerd op {formatDate(createdAt)}</p>
        )}
        <Markdown content={content} />
      </CardContent>
    </Card>
  )
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
      {text}
    </div>
  )
}
