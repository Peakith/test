'use client'

import React, { createContext, useContext, useReducer } from 'react'
import { Project, Task, Phase } from '@/types'
import { INITIAL_PROJECTS } from '@/data/projects'
import { computePhase } from '@/lib/phase'

type Action =
  | { type: 'TOGGLE_TASK'; projectId: string; taskId: string }
  | { type: 'ADD_TASK'; projectId: string; task: Task }
  | { type: 'DELETE_TASK'; projectId: string; taskId: string }

function reducer(state: Project[], action: Action): Project[] {
  switch (action.type) {
    case 'TOGGLE_TASK': {
      return state.map((project) => {
        if (project.id !== action.projectId) return project
        const updatedTasks = project.tasks.map((task) =>
          task.id === action.taskId ? { ...task, completed: !task.completed } : task
        )
        return { ...project, tasks: updatedTasks, currentPhase: computePhase(updatedTasks) }
      })
    }
    case 'ADD_TASK': {
      return state.map((project) => {
        if (project.id !== action.projectId) return project
        const updatedTasks = [...project.tasks, action.task]
        return { ...project, tasks: updatedTasks, currentPhase: computePhase(updatedTasks) }
      })
    }
    case 'DELETE_TASK': {
      return state.map((project) => {
        if (project.id !== action.projectId) return project
        const updatedTasks = project.tasks.filter((t) => t.id !== action.taskId)
        return { ...project, tasks: updatedTasks, currentPhase: computePhase(updatedTasks) }
      })
    }
    default:
      return state
  }
}

interface ProjectContextValue {
  projects: Project[]
  toggleTask: (projectId: string, taskId: string) => void
  addTask: (projectId: string, title: string, phase: Phase) => void
  deleteTask: (projectId: string, taskId: string) => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, dispatch] = useReducer(reducer, INITIAL_PROJECTS)

  const toggleTask = (projectId: string, taskId: string) =>
    dispatch({ type: 'TOGGLE_TASK', projectId, taskId })

  const addTask = (projectId: string, title: string, phase: Phase) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return
    const phaseTasks = project.tasks.filter((t) => t.phase === phase)
    const task: Task = {
      id: `t-${Date.now()}`,
      title,
      phase,
      completed: false,
      order: phaseTasks.length + 1,
    }
    dispatch({ type: 'ADD_TASK', projectId, task })
  }

  const deleteTask = (projectId: string, taskId: string) =>
    dispatch({ type: 'DELETE_TASK', projectId, taskId })

  return (
    <ProjectContext.Provider value={{ projects, toggleTask, addTask, deleteTask }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider')
  return ctx
}
