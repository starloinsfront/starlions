import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { ROUTES } from "@/common/constants/route"
import {
  LegalDocument,
  LegalSection,
  type LegalSectionLink,
} from "@/features/legal/ui/LegalDocument/LegalDocument"
import { LegalReturnLink } from "@/features/legal/ui/LegalReturnLink/LegalReturnLink"

export const metadata: Metadata = {
  title: "Privacy Policy | Inctagram",
  description:
    "Learn what personal data Inctagram collects, how it is used, and what privacy choices are available to you.",
}

const LAST_UPDATED = "September 23, 2026"

const SECTIONS = [
  { id: "scope", title: "Scope and who we are" },
  { id: "data-we-collect", title: "Data we collect" },
  { id: "how-we-use-data", title: "How we use data" },
  { id: "legal-bases", title: "Legal bases" },
  { id: "public-content", title: "Public profiles and content" },
  { id: "sharing", title: "How data is shared" },
  { id: "retention", title: "Data retention" },
  { id: "security", title: "Security" },
  { id: "children", title: "Children's privacy" },
  { id: "rights", title: "Your privacy rights" },
  { id: "cookies", title: "Cookies and similar technologies" },
  { id: "international", title: "International data transfers" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contacting us" },
] as const satisfies readonly LegalSectionLink[]

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      actions={
        <Suspense fallback={null}>
          <LegalReturnLink />
        </Suspense>
      }
      intro="This Privacy Policy explains how Inctagram collects, uses, stores, and shares information when you create an account, publish content, interact with other people, or otherwise use the Inctagram website and related services."
      lastUpdated={LAST_UPDATED}
      relatedLinks={
        <p>
          For the rules governing use of the Service, read our{" "}
          <Link href={ROUTES.termsOfService}>Terms of Service</Link>.
        </p>
      }
      sections={SECTIONS}
      title="Privacy Policy"
    >
      <LegalSection id="scope" title="1. Scope and who we are">
        <p>
          This Policy applies to the Inctagram photo-sharing and social networking service,
          including its website, account features, public profiles, publications, comments, and
          related user interactions (collectively, the “Service”). In this Policy, “Inctagram,”
          “we,” “us,” and “our” refer to the operator of the Service.
        </p>
        <p>
          This Policy does not apply to third-party websites, applications, or services that may be
          linked from Inctagram. Those services process information under their own terms and
          privacy policies.
        </p>
      </LegalSection>

      <LegalSection id="data-we-collect" title="2. Data we collect">
        <h3>Information you provide</h3>
        <ul>
          <li>
            <strong>Account information:</strong> email address, username, authentication details,
            and information used to confirm or recover your account.
          </li>
          <li>
            <strong>Profile information:</strong> first and last name, date of birth, country, city,
            profile description, and profile photo.
          </li>
          <li>
            <strong>User content:</strong> photos, captions, comments, messages, and other material
            you choose to publish or send through the Service.
          </li>
          <li>
            <strong>Communications:</strong> information included when you contact support, report
            content, or communicate with us about the Service.
          </li>
        </ul>

        <h3>Information generated when you use the Service</h3>
        <ul>
          <li>
            <strong>Activity information:</strong> publications viewed, accounts followed,
            reactions, comments, saved items, and other interactions with Service features.
          </li>
          <li>
            <strong>Technical information:</strong> IP address, device and browser type, operating
            system, language, approximate location derived from IP, timestamps, and diagnostic logs.
          </li>
          <li>
            <strong>Security information:</strong> login events, session identifiers, failed access
            attempts, and signals used to detect fraud, abuse, or unauthorized access.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use-data" title="3. How we use data">
        <p>We use information to:</p>
        <ul>
          <li>create, authenticate, maintain, and recover user accounts;</li>
          <li>display profiles, publications, comments, and other requested content;</li>
          <li>provide social features such as follows, reactions, sharing, and messaging;</li>
          <li>remember preferences and improve accessibility and usability;</li>
          <li>operate, troubleshoot, test, analyze, and improve the Service;</li>
          <li>
            protect users, investigate abuse, and prevent spam, fraud, and security incidents;
          </li>
          <li>enforce our Terms of Service and comply with legal obligations;</li>
          <li>communicate service notices, security alerts, and responses to support requests.</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-bases" title="4. Legal bases">
        <p>
          Where data protection law requires a legal basis, we process personal data as necessary to
          perform our contract with you, comply with law, protect our legitimate interests and those
          of our users, or act with your consent. Legitimate interests include maintaining a safe
          and reliable Service, preventing abuse, understanding feature performance, and improving
          the user experience.
        </p>
        <p>
          When processing is based on consent, you may withdraw that consent at any time. This does
          not affect processing that occurred before withdrawal or processing supported by another
          lawful basis.
        </p>
      </LegalSection>

      <LegalSection id="public-content" title="5. Public profiles and content">
        <p>
          Inctagram is designed for sharing. Your username, profile photo, profile description,
          follower and publication counts, and content posted to a public profile may be visible to
          anyone, including people who are not signed in. Other users may copy links to public
          content or share it outside the Service.
        </p>
        <p>
          Do not publish information that you want to keep confidential. Removing content from your
          account does not necessarily remove copies previously saved or shared by other people,
          search engines, or third-party services.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="6. How data is shared">
        <p>We may share information in the following limited circumstances:</p>
        <ul>
          <li>
            <strong>With other users and the public</strong> when you publish content or use social
            features.
          </li>
          <li>
            <strong>With service providers</strong> that support hosting, storage, authentication,
            content delivery, analytics, security, and customer support, subject to appropriate
            contractual safeguards.
          </li>
          <li>
            <strong>For legal and safety reasons</strong> when reasonably necessary to comply with
            law, respond to lawful requests, protect rights and safety, or investigate misuse.
          </li>
          <li>
            <strong>As part of a business transaction</strong> such as a merger, reorganization,
            financing, or transfer of assets, subject to applicable confidentiality requirements.
          </li>
          <li>
            <strong>With your direction or consent</strong> when you ask us to connect with or send
            information to another service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="retention" title="7. Data retention">
        <p>
          We retain information for as long as needed to provide the Service, maintain account and
          security records, resolve disputes, enforce agreements, and meet legal obligations.
          Retention periods depend on the type of information, why it was collected, and applicable
          legal requirements.
        </p>
        <p>
          When you delete information or close your account, it may remain for a limited period in
          backups, security logs, or records that must be preserved by law. We may also retain
          de-identified or aggregated information that can no longer reasonably identify you.
        </p>
      </LegalSection>

      <LegalSection id="security" title="8. Security">
        <p>
          We use administrative, technical, and organizational measures intended to protect
          information against unauthorized access, loss, misuse, alteration, and disclosure. These
          measures may include access controls, encrypted transport, monitoring, and restricted
          access to production systems.
        </p>
        <p>
          No online service can guarantee absolute security. You are responsible for using a strong
          password, keeping account credentials confidential, signing out on shared devices, and
          notifying us if you believe your account has been compromised.
        </p>
      </LegalSection>

      <LegalSection id="children" title="9. Children's privacy">
        <p>
          The Service is not intended for children under 13, and users must be at least 13 years old
          to create an account. If we learn that personal data was collected from a child under 13
          without legally valid authorization, we will take reasonable steps to delete the account
          and associated information.
        </p>
        <p>
          A parent or guardian who believes that a child has provided personal data may contact us
          using the method described in the “Contacting us” section.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="10. Your privacy rights">
        <p>
          Depending on where you live, you may have the right to request access to, correction of,
          deletion of, or a copy of your personal data. You may also have rights to restrict or
          object to certain processing, withdraw consent, or request data portability.
        </p>
        <p>
          You can update many profile fields directly in General Information. For other requests,
          use the contact method described below. We may need to verify your identity before acting
          on a request. Some information may be retained where required by law or necessary to
          protect the rights and safety of users.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="11. Cookies and similar technologies">
        <p>
          The Service may use cookies, local storage, and similar technologies to keep you signed
          in, protect sessions, remember settings, measure reliability, and understand how features
          are used. Some of these technologies are necessary for the Service to function.
        </p>
        <p>
          Browser controls may allow you to block or delete cookies. Blocking necessary storage may
          prevent sign-in, saved preferences, or other parts of the Service from working correctly.
        </p>
      </LegalSection>

      <LegalSection id="international" title="12. International data transfers">
        <p>
          Inctagram and its service providers may process information in countries other than the
          country where you live. Where required, we use recognized safeguards for international
          transfers, such as adequacy decisions, contractual protections, or another lawful transfer
          mechanism.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="13. Changes to this policy">
        <p>
          We may update this Policy to reflect changes in the Service, our practices, or applicable
          law. The “Last updated” date shows when the latest version took effect. If a change
          materially affects user rights, we will provide additional notice when required.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="14. Contacting us">
        <p>
          To ask a privacy question, report a concern, or exercise a privacy right, use the official
          support or account-contact method made available in the Service. Include enough detail for
          us to understand the request, but do not send passwords or other authentication secrets.
        </p>
      </LegalSection>
    </LegalDocument>
  )
}
