import { ContactScreen } from "../components/palma/contact-screen";
import { SiteShell } from "../components/palma/site-shell";
import { getPageImage } from "../lib/content";

export default async function ContactoPage() {
  const foundersImage = await getPageImage("contact-founders");

  return (
    <SiteShell>
      <ContactScreen foundersImage={foundersImage} />
    </SiteShell>
  );
}
