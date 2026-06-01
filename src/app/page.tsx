import { Header } from "@/components/layout/Header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main} />
    </div>
  );
}
