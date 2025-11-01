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
    links: [
      { label: "Deep Dive · ZooKeeper", href: "https://link.excalidraw.com/readonly/ggP7RIPSsIH6P6MLkxGN" },
      { label: "Deep Dive · Flink", href: "https://link.excalidraw.com/readonly/SVBcWIs8FMw0fIl48Ak0" },
      { label: "Design · Ad Click Aggregator", href: "https://link.excalidraw.com/readonly/aiVo6ny8IaXNKGY5S5JI" },
      { label: "Design · Google Docs", href: "https://link.excalidraw.com/readonly/XT0MRyKkGzVYd5uUh9lh" },
      { label: "Design · YouTube", href: "https://link.excalidraw.com/readonly/ta8aFaiZhtXm7XtT0gh7" },
      { label: "Design · Job Scheduler", href: "https://link.excalidraw.com/readonly/drczAAXLFOSpiYyuK4VN" },
      { label: "Design · Payment Service", href: "https://link.excalidraw.com/readonly/Ef5yJYOpmWJE71hbleQD" },
      { label: "Design · Web Crawler", href: "https://link.excalidraw.com/readonly/DCOBjcYrLBawSZSguRGL" },
      { label: "Design · Distributed Cache", href: "https://link.excalidraw.com/readonly/UwZPV9ewJqDtD9guCYj4" },
      { label: "Design · Rate Limiter", href: "https://link.excalidraw.com/readonly/7oqRhxJFtFRZioyPyhKi" },
    ],
  },
  {
    title: "Coding",
    caption: "Data structure and algorithm is foundation.",
    links: [],
  },
];

const emailAddress = "cztech0x3f@gmail.com";

const touchChannels = [
  {
    icon: "💼",
    title: "Connect on LinkedIn",
    caption: "Reach out for collaborations, mentorship, or open opportunities.",
    actionLabel: "Visit LinkedIn Profile",
    href: "https://www.linkedin.com/in/cheng-zhang-27b66379/",
    external: true,
  },
  {
    icon: "✉️",
    title: "Email to Me",
    caption: "Send details and we'll follow up within one business day.",
    actionLabel: "Email CZ Tech",
    href: `mailto:${emailAddress}`,
  },
];

export default function Home() {
  const { counters, toggle, pending, loaded } = useLikes();

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <span className={styles.brand}>CZ Tech</span>
        <Link className={styles.contactLink} href="#get-in-touch">
          Contact · {emailAddress}
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>I'm CZ</h1>
          <h2>Software Engineer & Tech Instructor</h2>
          <p>Specializing in scalable systems , full-stack development, and career growth.</p>
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
                disabled={pending || !loaded}
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

        <section className={styles.directory} aria-label="Directory">
          {sections.map((section) => (
            <section key={section.title} className={styles.directorySection}>
              <header className={styles.directoryHeader}>
                <h2 className={styles.entryTitle}>{section.title}</h2>
                <p className={styles.entryCaption}>{section.caption}</p>
              </header>
              {section.links?.length ? (
                <ul className={styles.entryLinks}>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </section>

        <section id="get-in-touch" className={styles.connect} aria-label="Get in touch">
          <div className={styles.connectInner}>
            <h2>Get in Touch</h2>
            <p>Choose the channel that fits best and we&apos;ll coordinate next steps.</p>
            <div className={styles.connectGrid}>
              {touchChannels.map((channel) => (
                <article key={channel.title} className={styles.connectCard}>
                  <span className={styles.connectIcon} aria-hidden="true">
                    {channel.icon}
                  </span>
                  <h3>{channel.title}</h3>
                  <p>{channel.caption}</p>
                  <Link
                    href={channel.href}
                    className={styles.connectAction}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noreferrer" : undefined}
                  >
                    {channel.actionLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CZ Tech</p>
      </footer>
    </div>
  );
}
