import { HeroMarquee } from "@/components/sections/HeroMarquee";
import { HeroTitle } from "@/components/sections/HeroTitle";
import styles from "./page.module.css";

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
