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
      const q = search.toLowerCase()
      const matchesSearch = p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
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
    <div className="space-y-8">
      {/* ─── Page header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-2">
            Overzicht
          </p>
          <h1 className="text-4xl font-black uppercase tracking-[0.04em] text-white leading-none">
            Projecten
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35 mt-2">
            {projects.length} projecten · Studio Brutaal
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 border border-white/15 p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 transition-colors ${view === 'grid' ? 'bg-brutaal-yellow text-brutaal-black' : 'text-white/40 hover:text-white'}`}
            aria-label="Kaartweergave"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 transition-colors ${view === 'table' ? 'bg-brutaal-yellow text-brutaal-black' : 'text-white/40 hover:text-white'}`}
            aria-label="Tabelweergave"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── Search + filter ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Zoek op project of klant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-brutaal-surface border border-white/10 text-white text-sm
              placeholder:text-white/25 placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-[11px]
              focus:outline-none focus:border-brutaal-yellow/60 transition-colors"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 z-10" />
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value as Phase | 'all')}
            className="pl-9 pr-8 py-2.5 bg-brutaal-surface border border-white/10 text-white text-[11px] font-bold
              uppercase tracking-[0.1em] focus:outline-none focus:border-brutaal-yellow/60 transition-colors
              appearance-none cursor-pointer"
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

      {/* ─── Phase pills ─── */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...PHASES] as const).map((phase) => {
          const count = phase === 'all' ? phaseCounts.all : (phaseCounts[phase] ?? 0)
          if (count === 0 && phase !== 'all') return null
          const isActive = phaseFilter === phase
          return (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`text-[10px] font-black uppercase tracking-[0.14em] px-3 py-1.5 border transition-all duration-100 ${
                isActive
                  ? 'bg-brutaal-yellow text-brutaal-black border-brutaal-yellow'
                  : 'bg-transparent text-white/40 border-white/15 hover:border-white/35 hover:text-white/70'
              }`}
            >
              {phase === 'all' ? 'Alles' : phase}
              <span className={`ml-1.5 ${isActive ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ─── Results ─── */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border border-white/8">
          <p className="text-2xl font-black uppercase tracking-[0.08em] text-white/20">Geen resultaten</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/20 mt-2">Pas je filter aan</p>
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
