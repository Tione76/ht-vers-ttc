export function ResultDisplay({ label, value, details }: { label: string; value: string; details?: string }) {
  return (
    <div className="result-primary">
      <p className="result-primary-label">{label}</p>
      <p className="result-primary-value">{value}</p>
      {details && <p className="result-details">{details}</p>}
    </div>
  );
}
