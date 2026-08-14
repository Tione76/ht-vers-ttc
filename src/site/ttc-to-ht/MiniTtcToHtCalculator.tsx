"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VatRatePct } from "../ht-to-ttc/ht-to-ttc-calc";
import { calculateTtcToHt, formatEuro2 } from "../ht-to-ttc/ht-to-ttc-calc";
import { PRIMARY_VAT_RATE, VAT_RATE_PRESETS, vatRatePctToNumber } from "../ht-to-ttc/ht-to-ttc-rates";

function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

export function MiniTtcToHtCalculator({
  initialAmountTtc,
  mainCalculatorPath,
}: {
  initialAmountTtc: number;
  mainCalculatorPath: string;
}) {
  const [amountRaw, setAmountRaw] = useState(String(initialAmountTtc));
  const [vatRate, setVatRate] = useState<VatRatePct>(PRIMARY_VAT_RATE);

  const result = useMemo(() => {
    const parsed = parseAmount(amountRaw);
    if (parsed === null) {
      return { ht: null as number | null, vatAmount: null as number | null };
    }
    const { ht, vatAmount } = calculateTtcToHt(parsed, vatRatePctToNumber(vatRate));
    return { ht, vatAmount };
  }, [amountRaw, vatRate]);

  return (
    <section
      id="calculateur-ttc-ht"
      className="ht-mini"
      aria-labelledby="calculateur-ttc-ht-title"
    >
      <h2 id="calculateur-ttc-ht-title" className="ht-mini__title">
        Calculer un autre montant TTC
      </h2>

      <div className="ht-mini__grid">
        <div className="ht-mini__controls">
          <div>
            <label className="ht-mini__label" htmlFor="mini-ttc-ht-amount">
              Montant TTC
            </label>
            <input
              id="mini-ttc-ht-amount"
              className="ht-mini__input"
              type="text"
              inputMode="decimal"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div>
            <div className="ht-mini__label" id="mini-ttc-ht-rate-label">
              Taux de TVA
            </div>
            <div
              className="ht-mini__rates"
              role="radiogroup"
              aria-labelledby="mini-ttc-ht-rate-label"
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
          <div className="ht-mini__result-label">Montant HT</div>
          <div className="ht-mini__ttc">
            {result.ht === null ? "-" : formatEuro2(result.ht)}
          </div>
          <div className="ht-mini__vat-row">
            <span className="ht-mini__result-label">TVA</span>
            <span className="ht-mini__vat">
              {result.vatAmount === null ? "-" : formatEuro2(result.vatAmount)}
            </span>
          </div>
          <p className="ht-mini__link">
            <Link href={mainCalculatorPath}>Ouvrir le calculateur complet (mode TTC vers HT)</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
