import { PanelPager } from "@/components/layout/PanelPager";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutAffiliation } from "@/components/sections/AboutAffiliation";
import { AboutSkills } from "@/components/sections/AboutSkills";

export default function AboutPage() {
  return (
    <PanelPager showDots>
      <AboutIntro />
      <AboutSkills />
      <AboutAffiliation />
    </PanelPager>
  );
}
