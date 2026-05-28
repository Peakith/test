import ProjectDetail from '@/components/projects/ProjectDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  return <ProjectDetail projectId={id} />
}
