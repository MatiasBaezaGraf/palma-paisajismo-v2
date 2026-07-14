import { NuestraMiradaScreen } from "../components/palma/nuestra-mirada-screen";
import { SiteShell } from "../components/palma/site-shell";
import { getPageImage } from "../lib/content";

export default async function NuestraMiradaPage() {
  const [heroImage, heidiImage] = await Promise.all([
    getPageImage("nuestra-mirada-hero"),
    getPageImage("nuestra-mirada-heidi"),
  ]);

  return (
    <SiteShell>
      <NuestraMiradaScreen heroImage={heroImage} heidiImage={heidiImage} />
    </SiteShell>
  );
}
