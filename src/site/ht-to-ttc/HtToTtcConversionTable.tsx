import { calculateHtToTtc, formatEuro2 } from "./ht-to-ttc-calc";
import { PRIMARY_VAT_RATE, VAT_RATE_PRESETS, vatRatePctToNumber } from "./ht-to-ttc-rates";

export function HtToTtcConversionTable({ amountHt }: { amountHt: number }) {
  return (
    <div className="ht-table-wrap">
      <figure className="guide-table-wrap ht-table-figure">
        <div className="guide-table-scroll">
          <table className="guide-table ht-table">
            <thead>
              <tr>
                <th scope="col">Taux de TVA</th>
                <th scope="col">Montant HT</th>
                <th scope="col">TVA</th>
                <th scope="col">Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              {VAT_RATE_PRESETS.map((preset) => {
                const rateNumber = vatRatePctToNumber(preset.value);
                const { vatAmount, ttc } = calculateHtToTtc(amountHt, rateNumber);
                const isPrimary = preset.value === PRIMARY_VAT_RATE;
                return (
                  <tr
                    key={preset.value}
                    className={isPrimary ? "ht-table__row--primary" : undefined}
                  >
                    <td>
                      <span className={`ht-table__rate${isPrimary ? " ht-table__rate--primary" : ""}`}>
                        {preset.label}
                      </span>
                    </td>
                    <td>{formatEuro2(amountHt)}</td>
                    <td>{formatEuro2(vatAmount)}</td>
                    <td className="ht-table__ttc">{formatEuro2(ttc)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </figure>
    </div>
  );
}
