interface Props {
  progress: number
  showLabel?: boolean
  height?: 'sm' | 'md'
}

export default function ProgressBar({ progress, showLabel = true, height = 'md' }: Props) {
  const h = height === 'sm' ? 'h-[3px]' : 'h-[4px]'

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-white/10 overflow-hidden ${h}`}>
        <div
          className={`${h} bg-brutaal-yellow transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-bold tracking-[0.08em] text-white/50 w-8 text-right tabular-nums">
          {progress}%
        </span>
      )}
    </div>
  )
}
