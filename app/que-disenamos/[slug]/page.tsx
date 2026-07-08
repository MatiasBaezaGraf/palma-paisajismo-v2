import { notFound } from "next/navigation";
import { SiteShell } from "../../components/palma/site-shell";
import { TypeDetailScreen } from "../../components/palma/type-detail-screen";
import { getProjectType } from "../../lib/content";

export default async function ProjectTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectType = await getProjectType(slug);

  if (!projectType) {
    notFound();
  }

  return (
    <SiteShell>
      <TypeDetailScreen type={projectType} />
    </SiteShell>
  );
}
