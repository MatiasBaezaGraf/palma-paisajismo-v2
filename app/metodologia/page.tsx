import { MethodologyScreen } from "../components/palma/methodology-screen";
import { SiteShell } from "../components/palma/site-shell";
import { getPageImage } from "../lib/content";

export default async function MetodologiaPage() {
  const heroImage = await getPageImage("methodology-hero");

  return (
    <SiteShell>
      <MethodologyScreen heroImage={heroImage} />
    </SiteShell>
  );
}
