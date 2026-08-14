import Link from "next/link";
import { formatHtEditorial } from "../ht-to-ttc/ht-to-ttc-calc";
import { getNearbyTtcToHtAmounts, ttcToHtPath } from "./ttc-to-ht-paths";

export function NearbyTtcToHtAmounts({ amountTtc }: { amountTtc: number }) {
  const nearby = getNearbyTtcToHtAmounts(amountTtc);
  if (nearby.length === 0) return null;

  return (
    <section className="ht-nearby" aria-labelledby="ttc-nearby-title">
      <h2 id="ttc-nearby-title">Montants proches</h2>
      <ul className="ht-nearby__list">
        {nearby.map((value) => (
          <li key={value}>
            <Link href={ttcToHtPath(value)}>{formatHtEditorial(value)} TTC en HT</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
