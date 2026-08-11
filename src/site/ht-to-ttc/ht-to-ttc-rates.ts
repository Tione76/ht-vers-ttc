import type { VatRatePct } from "./ht-to-ttc-calc";

export const VAT_RATE_PRESETS: { value: VatRatePct; label: string }[] = [
  { value: "20", label: "20 %" },
  { value: "10", label: "10 %" },
  { value: "5.5", label: "5,5 %" },
  { value: "2.1", label: "2,1 %" },
];

export const PRIMARY_VAT_RATE: VatRatePct = "20";
export const SECONDARY_VAT_RATES: VatRatePct[] = ["10", "5.5", "2.1"];

export function vatRatePctToNumber(rate: VatRatePct) {
  return Number.parseFloat(rate);
}
