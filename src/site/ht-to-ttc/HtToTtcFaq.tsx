import Link from "next/link";
import type { HtToTtcFaqAnswerSegment, HtToTtcFaqItem } from "./ht-to-ttc-content";

function renderAnswerSegments(segments: HtToTtcFaqAnswerSegment[]) {
  return segments.map((seg, idx) => {
    if (typeof seg === "string") return <span key={idx}>{seg}</span>;

    if (seg.href.startsWith("#")) {
      return (
        <a key={idx} href={seg.href}>
          {seg.text}
        </a>
      );
    }

    return (
      <Link key={idx} href={seg.href}>
        {seg.text}
      </Link>
    );
  });
}

export function HtToTtcFaq({ items }: { items: HtToTtcFaqItem[] }) {
  return (
    <section className="ht-faq" aria-labelledby="ht-to-ttc-faq-title">
      <h2 id="ht-to-ttc-faq-title">FAQ</h2>
      <div className="faq-list faq-list--flush">
        {items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary className="faq-item__summary">
              <h3 className="faq-item__question">{item.question}</h3>
              <span className="faq-chevron" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="faq-item__body">
              <p>{renderAnswerSegments(item.answer)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
