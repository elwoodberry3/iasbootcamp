import { LegalShell } from "@/components/LegalShell";

export const metadata = { title: "Terms & Conditions — IAS" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions">
      <p>
        These terms govern your use of this site and any IAS programs or products. This is
        placeholder copy to be replaced with counsel-reviewed terms before running paid traffic.
      </p>
      <h2>Use of this site</h2>
      <p>
        The training and materials are provided for your personal, non-commercial use. You agree
        not to redistribute paid materials without permission.
      </p>
      <h2>Purchases</h2>
      <p>
        Any future paid programs will list their own pricing, access, and refund terms at the
        point of purchase.
      </p>
    </LegalShell>
  );
}
