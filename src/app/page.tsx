import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { HeroTitle } from "@/components/sections/HeroTitle";
import { createPageMetadata } from "@/lib/seo/metadata";
import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "우은식 · UI/프론트엔드 포트폴리오",
  description:
    "UI 및 프론트엔드 개발자 우은식의 포트폴리오. 프로젝트, 활동, 블로그, 연락을 한곳에서 확인할 수 있습니다.",
  path: "/",
});

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <HeroMarquee />
        <div className={styles.heroTitle}>
          <HeroTitle />
        </div>
      </section>
    </main>
  );
}
