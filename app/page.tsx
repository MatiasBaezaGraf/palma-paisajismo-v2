import { HomeScreen } from "./components/palma/home-screen";
import { SiteShell } from "./components/palma/site-shell";
import { getHomeImages, getProjectTypes } from "./lib/content";

export default async function Home() {
  const [homeImages, projectTypes] = await Promise.all([getHomeImages(), getProjectTypes()]);

  return (
    <SiteShell>
      <HomeScreen homeImages={homeImages} projectTypes={projectTypes} />
    </SiteShell>
  );
}
