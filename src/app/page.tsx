"use client";

import Link from "next/link";
import { useLikes } from "@/lib/useLikes";
import styles from "./page.module.css";

const sections = [
  {
    title: "Projects",
    caption: "Verify tech stack with real projects.",
    links: [{ label: "NewsFeed", href: "https://newsfeed.chengzhang.wiki" }],
  },
  {
    title: "System Design",
    caption: "Design scalable systems from scratch.",
    links: [],
  },
  {
    title: "Coding",
    caption: "Data structure and algorithm is foundation.",
    links: [],
  },
];

const emailAddress = "pro.zhangcheng@gmail.com";

export default function Home() {
  const { counters, toggle, pending } = useLikes();

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
          <p>Collected notes, shipped work, and reference links for fast recall.</p>
        </section>

        <section aria-label="Directory">
          <ul className={styles.list}>
            {sections.map((section) => (
              <li key={section.title}>
                <span className={styles.entryTitle}>{section.title}</span>
                <p className={styles.entryCaption}>{section.caption}</p>
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

        <section className={styles.stats} aria-label="Likes">
          {counters.map((counter) => {
            const heartClass = counter.active
              ? `${styles.statIcon} ${styles.statIconActive}`
              : styles.statIcon;

            return (
              <button
                key={counter.id}
                type="button"
                className={styles.statCard}
                aria-pressed={counter.active}
                onClick={() => void toggle(counter.id)}
                disabled={pending && !counter.active}
              >
                <span className={styles.statIconWrap} aria-hidden="true">
                  <svg
                    className={heartClass}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21s-5.45-4.35-8.36-7.26C1.28 11.38 1 8.44 3.07 6.36a4.33 4.33 0 0 1 6.12 0L12 9.18l2.81-2.82a4.33 4.33 0 0 1 6.12 0c2.07 2.08 1.79 5.02-.57 7.38C17.45 16.65 12 21 12 21Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className={styles.statValue}>{counter.display}</span>
                <span className={styles.statLabel}>{counter.label}</span>
              </button>
            );
          })}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Chengzhang Wiki</p>
      </footer>
    </div>
  );
}
