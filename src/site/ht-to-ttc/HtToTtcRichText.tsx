import type { HtToTtcRichTextSegment } from "./ht-to-ttc-content";
import Link from "next/link";

export function renderHtToTtcRichText(segments: HtToTtcRichTextSegment[]) {
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
