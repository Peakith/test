interface Props {
  progress: number
  showLabel?: boolean
  height?: 'sm' | 'md'
}

export default function ProgressBar({ progress, showLabel = true, height = 'md' }: Props) {
  const heightClass = height === 'sm' ? 'h-1.5' : 'h-2'

  const barColor =
    progress === 100
      ? 'bg-green-500'
      : progress >= 60
        ? 'bg-blue-500'
        : progress >= 30
          ? 'bg-violet-500'
          : 'bg-slate-400'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 w-8 text-right">{progress}%</span>
      )}
    </div>
  )
}
