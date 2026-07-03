"use client";

import { useState } from "react";
import { ResultDisplay } from "@/framework/CalculatorShell";
import { useCalculatorSlot } from "@/framework/SiteProvider";

export default function Calculator() {
  const { setResult, clearResult } = useCalculatorSlot();
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("a");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(
      <ResultDisplay
        label="Estimation"
        value="—"
        details="Remplacez ce composant par la logique de votre simulateur."
      />,
    );
  }

  function handleReset() {
    setValue("");
    setMode("a");
    clearResult();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="calc-fields">
        <div>
          <label htmlFor="value" className="calc-field-label">
            Valeur
          </label>
          <input
            id="value"
            name="value"
            type="text"
            inputMode="decimal"
            placeholder="Ex. : 100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="calc-input"
            required
          />
        </div>

        <div>
          <label htmlFor="mode" className="calc-field-label">
            Mode
          </label>
          <select
            id="mode"
            name="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="calc-input"
          >
            <option value="a">Mode A</option>
            <option value="b">Mode B</option>
          </select>
        </div>
      </div>

      <div className="calc-col-actions">
        <button type="submit" className="calc-cta">
          Calculer
        </button>
        <button type="button" className="calc-reset" onClick={handleReset}>
          Réinitialiser
        </button>
      </div>
    </form>
  );
}
