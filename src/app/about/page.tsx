import { PanelPager } from "@/components/layout/PanelPager";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutAffiliation } from "@/components/sections/AboutAffiliation";
import { AboutSkills } from "@/components/sections/AboutSkills";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "우은식의 소개, 기술 스택, 소속 및 대외 활동을 확인할 수 있는 About 페이지입니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PanelPager showDots>
      <AboutIntro />
      <AboutSkills />
      <AboutAffiliation />
    </PanelPager>
  );
}
