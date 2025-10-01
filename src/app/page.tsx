import Link from "next/link";
import styles from "./page.module.css";

const sections = [
  {
    title: "Projects",
    links: [{ label: "NewsFeed", href: "https://newsfeed.chengzhang.wiki" }],
  },
  {
    title: "System Design",
    links: [],
  },
  {
    title: "Coding",
    links: [],
  },
];

const emailAddress = "pro.zhangcheng@gmail.com";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <span className={styles.brand}>Chengzhang Wiki</span>
        <Link className={styles.contactLink} href={`mailto:${emailAddress}`}>
          Contact · {emailAddress}
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Projects · System Design · Coding</h1>
          <p>Collected notes,shipped work, and reference links for fast recall.</p>
        </section>

        <section aria-label="Directory">
          <ul className={styles.list}>
            {sections.map((section) => (
              <li key={section.title}>
                <span className={styles.entryTitle}>{section.title}</span>
                {section.links?.length ? (
                  <ul className={styles.entryLinks}>
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Chengzhang Wiki</p>
      </footer>
    </div>
  );
}
