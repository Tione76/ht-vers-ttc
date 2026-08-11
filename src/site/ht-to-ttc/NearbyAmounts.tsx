import { getNearbyHtToTtcAmounts, htToTtcPath } from "./ht-to-ttc-paths";
import { formatHtEditorial } from "./ht-to-ttc-calc";
import Link from "next/link";

/**
 * Affiche les montants proches uniquement s'ils sont publiés.
 * Masqué tant qu'aucune autre fiche indexable n'existe.
 */
export function NearbyAmounts({ amountHt }: { amountHt: number }) {
  const nearby = getNearbyHtToTtcAmounts(amountHt);
  if (nearby.length === 0) return null;

  return (
    <section className="ht-nearby" aria-labelledby="ht-nearby-title">
      <h2 id="ht-nearby-title">Montants proches</h2>
      <ul className="ht-nearby__list">
        {nearby.map((value) => (
          <li key={value}>
            <Link href={htToTtcPath(value)}>{formatHtEditorial(value)} HT en TTC</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
