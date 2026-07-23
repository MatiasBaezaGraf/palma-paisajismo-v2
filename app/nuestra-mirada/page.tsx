import { NuestraMiradaScreen } from "../components/palma/nuestra-mirada-screen";
import { SiteShell } from "../components/palma/site-shell";
import { getPageImage } from "../lib/content";

export default async function NuestraMiradaPage() {
  const [heroImage, heidiImage, isabellaImage] = await Promise.all([
    getPageImage("nuestra-mirada-hero"),
    getPageImage("nuestra-mirada-heidi"),
    getPageImage("nuestra-mirada-isabella"),
  ]);

  return (
    <SiteShell>
      <NuestraMiradaScreen heroImage={heroImage} heidiImage={heidiImage} isabellaImage={isabellaImage} />
    </SiteShell>
  );
}
