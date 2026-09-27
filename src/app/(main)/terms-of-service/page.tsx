import type { Metadata } from "next"
import Link from "next/link"

import { ROUTES } from "@/common/constants/route"
import {
  LegalDocument,
  LegalSection,
  type LegalSectionLink,
} from "@/features/legal/ui/LegalDocument/LegalDocument"

export const metadata: Metadata = {
  title: "Terms of Service | Inctagram",
  description:
    "Read the terms that govern accounts, content, acceptable use, and access to the Inctagram service.",
}

const LAST_UPDATED = "September 23, 2026"

const SECTIONS = [
  { id: "agreement", title: "Agreement to these terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "accounts", title: "Your account" },
  { id: "service", title: "Using the Service" },
  { id: "content", title: "Your content" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "moderation", title: "Moderation and reporting" },
  { id: "our-rights", title: "Inctagram intellectual property" },
  { id: "third-parties", title: "Third-party services" },
  { id: "termination", title: "Suspension and termination" },
  { id: "availability", title: "Service availability and changes" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "liability", title: "Limitation of liability" },
  { id: "general", title: "General terms" },
  { id: "contact", title: "Contacting us" },
] as const satisfies readonly LegalSectionLink[]

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      intro="These Terms of Service govern your access to and use of Inctagram. They are intended to keep the Service safe, respectful, and useful while explaining the rights and responsibilities that apply to every account."
      lastUpdated={LAST_UPDATED}
      relatedLinks={
        <p>
          Information about how we handle personal data is available in our{" "}
          <Link href={ROUTES.privacyPolicy}>Privacy Policy</Link>.
        </p>
      }
      sections={SECTIONS}
      title="Terms of Service"
    >
      <LegalSection id="agreement" title="1. Agreement to these terms">
        <p>
          By creating an account, accessing, or using the Inctagram website and related features
          (collectively, the “Service”), you agree to these Terms and our Privacy Policy. If you do
          not agree, do not use the Service.
        </p>
        <p>
          If you use the Service on behalf of an organization, you confirm that you are authorized
          to accept these Terms for that organization. In that case, “you” includes the
          organization.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>
          You must be at least 13 years old to create an account. If the law where you live requires
          a higher minimum age or permission from a parent or guardian, you must satisfy that
          requirement before using the Service.
        </p>
        <p>
          You may not use the Service if you are legally prohibited from receiving it or if your
          account was previously disabled for a serious or repeated violation, unless we expressly
          authorize your return.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. Your account">
        <p>You agree to:</p>
        <ul>
          <li>provide accurate registration and profile information;</li>
          <li>keep required information reasonably current;</li>
          <li>protect your password, session, and account recovery methods;</li>
          <li>not sell, transfer, rent, or provide unauthorized access to your account;</li>
          <li>notify us if you suspect unauthorized access or another security incident.</li>
        </ul>
        <p>
          You are responsible for activity performed through your account unless applicable law
          provides otherwise. Usernames may not impersonate another person, mislead users about
          affiliation, or violate another party&apos;s rights.
        </p>
      </LegalSection>

      <LegalSection id="service" title="4. Using the Service">
        <p>
          Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable,
          and revocable right to access and use the Service for its intended purposes. You may
          browse public profiles, create and manage your own profile, publish content, and use
          available social features.
        </p>
        <p>
          Features may differ by device, location, account status, or stage of development. A
          visible control does not guarantee that a feature or external integration will always be
          available.
        </p>
      </LegalSection>

      <LegalSection id="content" title="5. Your content">
        <p>
          You retain ownership of photos, captions, comments, profile information, and other content
          you submit to the Service (“User Content”). You are responsible for User Content and must
          have all rights and permissions needed to publish it.
        </p>
        <p>
          To operate the Service, you grant Inctagram a worldwide, non-exclusive, royalty-free
          license to host, store, reproduce, process, display, and distribute your User Content, and
          to create technical modifications such as resizing or format conversion. This license is
          limited to operating, securing, improving, and promoting the Service in accordance with
          your account settings.
        </p>
        <p>
          The license ends when User Content is deleted from our active systems, except where a
          longer period is reasonably necessary for backups, legal compliance, safety, or content
          shared by others under a feature you used.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="6. Acceptable use">
        <p>You may not use the Service to:</p>
        <ul>
          <li>violate law, court orders, sanctions, or another person&apos;s legal rights;</li>
          <li>publish unlawful, threatening, exploitative, or seriously abusive content;</li>
          <li>harass, stalk, intimidate, discriminate against, or endanger another person;</li>
          <li>share intimate content without consent or any sexual content involving minors;</li>
          <li>impersonate another person or misrepresent an affiliation or endorsement;</li>
          <li>
            send spam, manipulate engagement, or operate deceptive accounts or coordinated abuse;
          </li>
          <li>
            upload malware or attempt to bypass authentication, rate limits, or security controls;
          </li>
          <li>scrape, crawl, or collect data through unauthorized automated means;</li>
          <li>
            reverse engineer or interfere with the Service except where law expressly permits it;
          </li>
          <li>infringe copyrights, trademarks, privacy, publicity, or other proprietary rights.</li>
        </ul>
      </LegalSection>

      <LegalSection id="moderation" title="7. Moderation and reporting">
        <p>
          We may review, limit, remove, or restrict access to content or accounts when reasonably
          necessary to enforce these Terms, protect users, comply with law, or maintain Service
          integrity. Moderation decisions may consider context, severity, history, and risk of harm.
        </p>
        <p>
          You may report content or behavior using reporting or support tools made available in the
          Service. We do not guarantee that every report will result in removal, and we may be
          unable to disclose details about actions taken against another account.
        </p>
      </LegalSection>

      <LegalSection id="our-rights" title="8. Inctagram intellectual property">
        <p>
          The Service, including its software, visual design, logos, interface, and original
          materials, is owned by or licensed to Inctagram and is protected by intellectual property
          laws. These Terms do not transfer ownership of the Service or permit use of our branding
          without authorization.
        </p>
        <p>
          Feedback and suggestions are voluntary. You allow us to use feedback without restriction
          or compensation, provided we do not publicly identify you as its source without consent.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="9. Third-party services">
        <p>
          The Service may contain links to or rely on third-party services such as identity
          providers, hosting platforms, or external websites. We do not control third-party services
          and are not responsible for their content, availability, or privacy practices. Your use of
          them may be governed by separate terms.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="10. Suspension and termination">
        <p>
          You may stop using the Service at any time. Where account deletion is available, you may
          request deletion subject to reasonable retention for backups, security, dispute
          resolution, and legal obligations.
        </p>
        <p>
          We may suspend, restrict, or terminate access if you materially or repeatedly violate
          these Terms, create risk or legal exposure, compromise Service security, or if we are
          required to do so by law. Where appropriate, we may provide notice or an opportunity to
          correct the issue.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="11. Service availability and changes">
        <p>
          We continually develop the Service and may add, change, suspend, or discontinue features.
          We may also perform maintenance or impose reasonable technical limits. We will try to
          avoid unnecessary disruption but do not guarantee uninterrupted or error-free operation.
        </p>
        <p>
          You are responsible for maintaining copies of User Content that you need. The Service is
          not intended to be your only backup or permanent archive.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="12. Disclaimers">
        <p>
          To the extent permitted by law, the Service is provided “as is” and “as available.” We
          disclaim implied warranties of merchantability, fitness for a particular purpose,
          non-infringement, and any warranty arising from course of dealing or usage.
        </p>
        <p>
          We do not endorse User Content and cannot guarantee that content is accurate, appropriate,
          lawful, or safe. Nothing in these Terms excludes warranties or consumer rights that cannot
          lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="13. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Inctagram and its service providers will not be
          liable for indirect, incidental, special, consequential, exemplary, or punitive damages,
          or for loss of data, profits, goodwill, or business opportunities arising from use of or
          inability to use the Service.
        </p>
        <p>
          These limitations do not apply where prohibited by law and do not limit liability for
          fraud, willful misconduct, or other liability that cannot legally be limited. Your local
          law may provide additional rights.
        </p>
      </LegalSection>

      <LegalSection id="general" title="14. General terms">
        <p>
          If any provision of these Terms is found unenforceable, the remaining provisions remain
          effective. Failure to enforce a provision is not a waiver. You may not assign your rights
          or obligations under these Terms without our consent; we may assign them as part of a
          merger, reorganization, or transfer of the Service where permitted by law.
        </p>
        <p>
          We may update these Terms when the Service, legal requirements, or our practices change.
          The “Last updated” date identifies the current version. If changes materially affect your
          rights, we will provide additional notice where required. Continued use after the updated
          Terms take effect constitutes acceptance where permitted by law.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contacting us">
        <p>
          Questions about these Terms may be submitted through the official support or
          account-contact method made available in the Service. When reporting an account or
          security issue, do not include passwords or authentication secrets.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
