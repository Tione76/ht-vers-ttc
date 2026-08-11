"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VatRatePct } from "./ht-to-ttc-calc";
import { calculateHtToTtc, formatEuro2 } from "./ht-to-ttc-calc";
import { PRIMARY_VAT_RATE, VAT_RATE_PRESETS, vatRatePctToNumber } from "./ht-to-ttc-rates";

function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

export function MiniHtToTtcCalculator({
  initialAmountHt,
  mainCalculatorPath,
}: {
  initialAmountHt: number;
  mainCalculatorPath: string;
}) {
  const [amountRaw, setAmountRaw] = useState(String(initialAmountHt));
  const [vatRate, setVatRate] = useState<VatRatePct>(PRIMARY_VAT_RATE);

  const result = useMemo(() => {
    const parsed = parseAmount(amountRaw);
    if (parsed === null) {
      return { ttc: null as number | null, vatAmount: null as number | null };
    }
    const { ttc, vatAmount } = calculateHtToTtc(parsed, vatRatePctToNumber(vatRate));
    return { ttc, vatAmount };
  }, [amountRaw, vatRate]);

  return (
    <section
      id="calculateur-ht-ttc"
      className="ht-mini"
      aria-labelledby="calculateur-ht-ttc-title"
    >
      <h2 id="calculateur-ht-ttc-title" className="ht-mini__title">
        Calculer un autre montant HT
      </h2>

      <div className="ht-mini__grid">
        <div className="ht-mini__controls">
          <div>
            <label className="ht-mini__label" htmlFor="mini-ht-ttc-amount">
              Montant HT
            </label>
            <input
              id="mini-ht-ttc-amount"
              className="ht-mini__input"
              type="text"
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div>
            <div className="ht-mini__label" id="mini-ht-ttc-rate-label">
              Taux de TVA
            </div>
            <div
              className="ht-mini__rates"
              role="radiogroup"
              aria-labelledby="mini-ht-ttc-rate-label"
            >
              {VAT_RATE_PRESETS.map((preset) => {
                const active = vatRate === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    className={`ht-mini__rate${active ? " ht-mini__rate--active" : ""}`}
                    onClick={() => setVatRate(preset.value)}
                    role="radio"
                    aria-checked={active}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ht-mini__result" aria-live="polite">
          <div className="ht-mini__result-label">Montant TTC</div>
          <div className="ht-mini__ttc">
            {result.ttc === null ? "-" : formatEuro2(result.ttc)}
          </div>
          <div className="ht-mini__vat-row">
            <span className="ht-mini__result-label">TVA</span>
            <span className="ht-mini__vat">
              {result.vatAmount === null ? "-" : formatEuro2(result.vatAmount)}
            </span>
          </div>
          <p className="ht-mini__link">
            <Link href={mainCalculatorPath}>Ouvrir le calculateur HT → TTC complet</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
