import Link from "next/link";
import styles from "./page.module.css";

const focusAreas = [
  {
    title: "Product Craft",
    summary:
      "Map messy, multi-disciplinary ideas into confident roadmaps and intuitive flows.",
    items: [
      "Facilitating discovery workshops and decision frameworks",
      "Designing calm, legible product journeys",
      "Partnering closely with engineering to deliver efficiently",
    ],
  },
  {
    title: "Design Systems",
    summary:
      "Build tooling and component libraries that keep teams aligned without slowing them down.",
    items: [
      "Inclusive, accessible components by default",
      "Documentation that scales with evolving patterns",
      "Governance rituals that encourage contribution",
    ],
  },
  {
    title: "Knowledge Sharing",
    summary:
      "Turn lived experience into reusable playbooks, templates, and hands-on learning.",
    items: [
      "Practical primers distilled from shipping real products",
      "Working notes that expose the why behind decisions",
      "Space for experiments, prototypes, and reflection",
    ],
  },
];

const quickLinks = [
  {
    title: "Working Notes",
    description: "Long-form writing and evolving thinking. Updated regularly.",
    href: "#",
  },
  {
    title: "Playground",
    description: "Lightweight prototypes, visual explorations, and proof-of-concepts.",
    href: "#",
  },
  {
    title: "Resources",
    description: "Templates, facilitation guides, and reference material for collaborators.",
    href: "#",
  },
];

const timeline = [
  {
    label: "Now",
    title: "Evolving Chengzhang Wiki",
    description:
      "Documenting the systems, rituals, and mental models that make product work more thoughtful.",
  },
  {
    label: "Recent",
    title: "Capturing case studies",
    description:
      "Framing lessons from cross-functional partnerships and design system stewardship.",
  },
  {
    label: "Origin",
    title: "Personal knowledge base",
    description:
      "Started as a private notebook; now growing into a shared resource for collaborators.",
  },
];

const contactLinks = [
  {
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/your-handle",
    href: "https://www.linkedin.com",
  },
  {
    label: "Newsletter",
    value: "Get updates when new notes go live",
    href: "#",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.tag}>Chengzhang Wiki</span>
        <h1 className={styles.title}>Crafting thoughtful digital experiences, one note at a time.</h1>
        <p className={styles.lede}>
          A living knowledge base where product strategy, design systems, and front-end craft
          intersect. Built to share process transparently, archive hard-won learnings, and invite
          better conversations.
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href="mailto:hello@example.com">
            Start a conversation
          </a>
          <Link className={styles.secondaryAction} href="#focus">
            Browse highlights
          </Link>
        </div>
        <ul className={styles.pillList} aria-label="Themes">
          <li>Product leadership</li>
          <li>Systems thinking</li>
          <li>Intentional collaboration</li>
        </ul>
      </header>

      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="snapshot">
          <div className={styles.sectionHeader}>
            <h2 id="snapshot">Snapshot</h2>
            <p>What you can expect to find across this space.</p>
          </div>
          <div className={styles.snapshot}>
            <p>
              Chengzhang Wiki curates frameworks, workshop recipes, and shipping stories from across
              product design and development. It balances strong opinions with practical prompts so
              teammates can act quickly without losing nuance.
            </p>
            <ul>
              <li>Opinionated guides for navigating ambiguous product problems.</li>
              <li>Design system ingredients that center accessibility and maintainability.</li>
              <li>Open notes that trade polish for transparency and speed.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section} id="focus" aria-labelledby="focus-heading">
          <div className={styles.sectionHeader}>
            <h2 id="focus-heading">Focus areas</h2>
            <p>Spaces getting the most attention right now.</p>
          </div>
          <div className={styles.cardGrid}>
            {focusAreas.map((area) => (
              <article key={area.title} className={styles.card}>
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <ul>
                  {area.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="timeline-heading">
          <div className={styles.sectionHeader}>
            <h2 id="timeline-heading">Evolution</h2>
            <p>Where the wiki has been and where it is headed next.</p>
          </div>
          <ol className={styles.timeline}>
            {timeline.map((entry) => (
              <li key={entry.label}>
                <span className={styles.timelineLabel}>{entry.label}</span>
                <div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="links-heading">
          <div className={styles.sectionHeader}>
            <h2 id="links-heading">Quick jumps</h2>
            <p>Pick a starting point if you are exploring for the first time.</p>
          </div>
          <div className={styles.linkGrid}>
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className={styles.linkCard}>
                <span>{link.title}</span>
                <p>{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="contact-heading">
          <div className={styles.sectionHeader}>
            <h2 id="contact-heading">Stay in touch</h2>
            <p>Swap ideas, suggest topics, or invite a collaboration.</p>
          </div>
          <ul className={styles.contactList}>
            {contactLinks.map((contact) => (
              <li key={contact.label}>
                <span>{contact.label}</span>
                <a href={contact.href}>{contact.value}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js and deployed on Vercel.</p>
        <p>
          Last updated {new Date().getFullYear()}. Customize the copy to keep your story current.
        </p>
      </footer>
    </div>
  );
}
