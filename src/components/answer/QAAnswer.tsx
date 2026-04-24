import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, Shield, Info } from "lucide-react";

type ClinicalResponse = {
  query?: string;
  clinical_summary: string;
  first_line_treatment: string;
  alternatives: string[];
  dosage: string;
  contraindications: string[];
  clinical_reasoning: string;
  india_context: string;
  evidence_note: string;
  confidence: "High" | "Moderate" | "Low";
};

const CONFIDENCE_STYLE: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Moderate: "bg-amber-100 text-amber-800 border-amber-300",
  Low: "bg-red-100 text-red-800 border-red-300",
};

const QAAnswer = ({ data }: { data: ClinicalResponse }) => {
  const [reasoningOpen, setReasoningOpen] = useState(false);

  return (
    <article className="prose-clinical animate-fade-up space-y-6">
      {/* Header */}
      <div>
        <p className="text-[13px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-2">
          Clinical Decision Support
        </p>
        {data.query && (
          <h1 className="font-serif text-[28px] md:text-[34px] font-bold leading-[1.15] mb-3 text-foreground">
            {data.query}
          </h1>
        )}
        {/* Confidence badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold border ${CONFIDENCE_STYLE[data.confidence] ?? CONFIDENCE_STYLE.Low}`}
        >
          <Shield className="w-3.5 h-3.5" />
          {data.confidence} confidence
        </span>
      </div>

      {/* Clinical Summary */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
          Clinical Summary
        </h2>
        <p className="text-[15px] leading-relaxed text-foreground">
          {data.clinical_summary}
        </p>
      </section>

      {/* First-line Treatment — highlighted */}
      <section className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-1 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          First-line Treatment
        </h2>
        <p className="text-[15px] font-medium text-foreground">
          {data.first_line_treatment}
        </p>
      </section>

      {/* Dosage */}
      {data.dosage && data.dosage !== "Not available" && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Dosage
          </h2>
          <p className="text-[14px] font-mono text-foreground bg-muted/50 rounded px-3 py-2">
            {data.dosage}
          </p>
        </section>
      )}

      {/* Alternatives */}
      {data.alternatives?.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Alternatives
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[15px] text-foreground">
            {data.alternatives.map((alt, i) => (
              <li key={i}>{alt}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Contraindications — warning style */}
      {data.contraindications?.length > 0 && (
        <section className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Contraindications & Warnings
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[14px] text-destructive/90">
            {data.contraindications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {/* India Context */}
      {data.india_context && data.india_context !== "Not available for this query." && (
        <section className="bg-accent/30 border border-accent/50 rounded-lg p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-foreground mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            India Context
          </h2>
          <p className="text-[14px] text-accent-foreground/90">
            {data.india_context}
          </p>
        </section>
      )}

      {/* Clinical Reasoning — expandable */}
      <section className="border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setReasoningOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          Clinical Reasoning
          {reasoningOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {reasoningOpen && (
          <div className="px-4 pb-4 text-[15px] leading-relaxed text-foreground border-t border-border pt-3">
            {data.clinical_reasoning}
          </div>
        )}
      </section>

      {/* Evidence Note */}
      {data.evidence_note && (
        <section className="text-[13px] text-muted-foreground italic border-t border-border pt-4">
          <strong className="not-italic">Evidence:</strong> {data.evidence_note}
        </section>
      )}
    </article>
  );
};

export default QAAnswer;
