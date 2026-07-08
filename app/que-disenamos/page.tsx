import { SiteShell } from "../components/palma/site-shell";
import { TypesScreen } from "../components/palma/types-screen";
import { getProjectTypes } from "../lib/content";

export default async function QueDisenamosPage() {
  const projectTypes = await getProjectTypes();

  return (
    <SiteShell>
      <TypesScreen projectTypes={projectTypes} />
    </SiteShell>
  );
}
