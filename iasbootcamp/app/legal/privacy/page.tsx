import { LegalShell } from "@/components/LegalShell";

export const metadata = { title: "Privacy Policy — IAS" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        This page explains what information I Automate Shit (&quot;IAS&quot;) collects, how it is
        stored, and how it is used. This is placeholder copy intended to be replaced with a
        counsel-reviewed policy compliant with GDPR and CCPA before running paid traffic.
      </p>
      <h2>What we collect</h2>
      <p>
        Name and email you submit through the training form, plus basic analytics events (which
        pages you view and how much of the video you watch) used to improve the training.
      </p>
      <h2>How we use it</h2>
      <p>
        To send you the training and related emails, and to measure and improve our content and
        ads. You can unsubscribe at any time from any email.
      </p>
      <h2>Contact</h2>
      <p>Questions about your data can be sent to the address listed in our emails.</p>
    </LegalShell>
  );
}
