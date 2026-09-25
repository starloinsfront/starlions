import type { ReactNode } from "react"

import s from "./LegalDocument.module.css"

export type LegalSectionLink = {
  id: string
  title: string
}

type LegalDocumentProps = {
  actions?: ReactNode
  children: ReactNode
  intro: string
  lastUpdated: string
  relatedLinks?: ReactNode
  sections: readonly LegalSectionLink[]
  title: string
}

type LegalSectionProps = {
  children: ReactNode
  id: string
  title: string
}

export const LegalDocument = ({
  actions,
  children,
  intro,
  lastUpdated,
  relatedLinks,
  sections,
  title,
}: LegalDocumentProps) => {
  return (
    <article className={s.document}>
      {actions ? <div className={s.actions}>{actions}</div> : null}

      <header className={s.header}>
        <p className={s.eyebrow}>Inctagram legal</p>
        <h1 className={s.title}>{title}</h1>
        <p className={s.updated}>Last updated: {lastUpdated}</p>
        <p className={s.intro}>{intro}</p>
      </header>

      <nav aria-label={`${title} contents`} className={s.contents}>
        <h2 className={s.contentsTitle}>Contents</h2>
        <ol className={s.contentsList}>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={s.sections}>{children}</div>

      {relatedLinks ? <footer className={s.footer}>{relatedLinks}</footer> : null}
    </article>
  )
}

export const LegalSection = ({ children, id, title }: LegalSectionProps) => {
  return (
    <section className={s.section} id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
