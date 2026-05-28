'use client'

import { useState, useMemo } from 'react'
import { Phase, PHASES } from '@/types'
import { useProjects } from '@/context/ProjectContext'
import ProjectCard from './ProjectCard'
import ProjectTable from './ProjectTable'
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'

type ViewMode = 'grid' | 'table'

export default function ProjectOverview() {
  const { projects } = useProjects()
  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<Phase | 'all'>('all')

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase())
      const matchesPhase = phaseFilter === 'all' || p.currentPhase === phaseFilter
      return matchesSearch && matchesPhase
    })
  }, [projects, search, phaseFilter])

  const phaseCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length }
    for (const phase of PHASES) {
      counts[phase] = projects.filter((p) => p.currentPhase === phase).length
    }
    return counts
  }, [projects])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projecten</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} projecten in totaal</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            aria-label="Kaartweergave"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            aria-label="Tabelweergave"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Zoek op projectnaam of klant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value as Phase | 'all')}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
          >
            <option value="all">Alle fases ({phaseCounts.all})</option>
            {PHASES.map((phase) => (
              <option key={phase} value={phase}>
                {phase} ({phaseCounts[phase] ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Phase pill filter (desktop) */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...PHASES] as const).map((phase) => {
          const count = phase === 'all' ? phaseCounts.all : (phaseCounts[phase] ?? 0)
          if (count === 0 && phase !== 'all') return null
          return (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${
                phaseFilter === phase
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {phase === 'all' ? 'Alles' : phase}
              <span className="ml-1.5 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">Geen projecten gevonden</p>
          <p className="text-sm mt-1">Pas je zoekopdracht of filter aan</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={filtered} />
      )}
    </div>
  )
}
