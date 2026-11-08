import { createFileRoute } from "@tanstack/react-router";
import { ContributeSection } from "@/components/ContributeSection";

export const Route = createFileRoute("/contribute")({
  head: () => ({
    meta: [
      { title: "Contribute & Sadaqah Jariyah | Shareek (شريك)" },
      {
        name: "description",
        content:
          "Support Shareek through Sadaqah Jariyah (UPI: nafihcc1234-2@okcici), submit verified local Masajid, review Sunnah adhkar, or contribute code.",
      },
    ],
  }),
  component: ContributePage,
});

function ContributePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
      <ContributeSection />
    </main>
  );
}
