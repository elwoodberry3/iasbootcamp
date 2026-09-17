import { LegalShell } from "@/components/LegalShell";

export const metadata = { title: "Earnings Disclaimer — IAS" };

export default function DisclaimerPage() {
  return (
    <LegalShell title="Earnings & Results Disclaimer">
      <p>
        This is placeholder copy to be replaced with a counsel-reviewed disclaimer before running
        paid traffic. It exists to state plainly what this training does and does not promise.
      </p>
      <h2>No guaranteed results</h2>
      <p>
        Any examples, case studies, or outcomes shown are illustrative and are not a promise or
        guarantee of any specific result. Your results depend on your own effort, situation, and
        many factors outside our control.
      </p>
      <h2>Not professional advice</h2>
      <p>
        This training is educational. It is not career, financial, or legal advice for your
        specific situation.
      </p>
    </LegalShell>
  );
}
