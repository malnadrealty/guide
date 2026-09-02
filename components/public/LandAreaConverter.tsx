"use client";
import { useState, useCallback, useEffect, useRef } from "react";

const UNITS = ["Square Feet", "Gunta", "Acre", "Square Metre", "Cent"] as const;
type Unit = (typeof UNITS)[number];

const TO_SQFT: Record<Unit, number> = {
  "Square Feet": 1,
  Gunta: 1089,
  Acre: 43560,
  "Square Metre": 10.7639104167,
  Cent: 435.6,
};

const SHORT: Record<Unit, string> = {
  "Square Feet": "sq ft",
  Gunta: "Gunta",
  Acre: "Acre",
  "Square Metre": "sq m",
  Cent: "Cent",
};

const PLOT_PRESETS = [
  { label: "20×30", l: 20, w: 30 },
  { label: "30×40", l: 30, w: 40 },
  { label: "40×60", l: 40, w: 60 },
  { label: "50×80", l: 50, w: 80 },
  { label: "60×80", l: 60, w: 80 },
  { label: "50×100", l: 50, w: 100 },
];

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 100000) return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  if (abs >= 10000) return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  if (abs >= 100) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(4);
  if (abs >= 0.001) return n.toFixed(5);
  return n.toFixed(6);
}

function fmtInt(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const CopyIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// Shared focus ring style — consistent across all interactive elements
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7242A] focus-visible:ring-offset-1";

export function LandAreaConverter() {
  const [mode, setMode] = useState<"single" | "plot">("single");
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState<Unit>("Square Feet");
  const [plotL, setPlotL] = useState("");
  const [plotW, setPlotW] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [copied, setCopied] = useState<Unit | null>(null);
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!">("Share");
  const initialized = useRef(false);

  // Restore state from URL on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get("mode") === "plot") {
        const l = p.get("l") ?? "";
        const w = p.get("w") ?? "";
        setMode("plot");
        setPlotL(l);
        setPlotW(w);
        const match = PLOT_PRESETS.find((pr) => String(pr.l) === l && String(pr.w) === w);
        if (match) setActivePreset(match.label);
      } else {
        const v = p.get("value") ?? "";
        const u = p.get("from") ?? "";
        if (v) setInputValue(v);
        if (UNITS.includes(u as Unit)) setInputUnit(u as Unit);
      }
    } catch { /* ignore */ }
  }, []);

  const syncUrl = useCallback((
    m: "single" | "plot",
    vals: { value?: string; from?: Unit; l?: string; w?: string }
  ) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", m);
      if (m === "single") {
        if (vals.value) url.searchParams.set("value", vals.value);
        else url.searchParams.delete("value");
        if (vals.from) url.searchParams.set("from", vals.from);
        else url.searchParams.delete("from");
        url.searchParams.delete("l");
        url.searchParams.delete("w");
      } else {
        if (vals.l) url.searchParams.set("l", vals.l);
        else url.searchParams.delete("l");
        if (vals.w) url.searchParams.set("w", vals.w);
        else url.searchParams.delete("w");
        url.searchParams.delete("value");
        url.searchParams.delete("from");
      }
      window.history.replaceState({}, "", url.toString());
    } catch { /* ignore */ }
  }, []);

  // Derived values
  const rawSingle = parseFloat(inputValue);
  const rawL = parseFloat(plotL);
  const rawW = parseFloat(plotW);

  const isNegative =
    mode === "single"
      ? inputValue !== "" && !isNaN(rawSingle) && rawSingle < 0
      : (plotL !== "" && !isNaN(rawL) && rawL < 0) || (plotW !== "" && !isNaN(rawW) && rawW < 0);

  const isValid =
    mode === "single"
      ? inputValue !== "" && !isNaN(rawSingle) && rawSingle >= 0
      : plotL !== "" && plotW !== "" && !isNaN(rawL) && !isNaN(rawW) && rawL > 0 && rawW > 0;

  const sqft = isValid
    ? mode === "single" ? rawSingle * TO_SQFT[inputUnit] : rawL * rawW
    : NaN;

  const resultUnits = mode === "plot" ? UNITS : UNITS.filter((u) => u !== inputUnit);

  const resultLabel =
    mode === "plot"
      ? `${rawL}×${rawW} ft equals`
      : `${fmt(rawSingle)} ${inputUnit} equals`;

  const handleCopy = useCallback(async (unit: Unit, text: string) => {
    try {
      await navigator.clipboard.writeText(`${text} ${SHORT[unit]}`);
      setCopied(unit);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* ignore */ }
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Copied!");
      setTimeout(() => setShareLabel("Share"), 2000);
    } catch { /* ignore */ }
  }, []);

  const handleModeSwitch = (m: "single" | "plot") => {
    setMode(m);
    setActivePreset(null);
    syncUrl(m, m === "single" ? { value: inputValue, from: inputUnit } : { l: plotL, w: plotW });
  };

  const handlePreset = (l: number, w: number, label: string) => {
    setPlotL(String(l));
    setPlotW(String(w));
    setActivePreset(label);
    syncUrl("plot", { l: String(l), w: String(w) });
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
    >
      {/* ── Mode tabs — proper ARIA tab pattern ── */}
      <div role="tablist" aria-label="Conversion mode" className="flex border-b border-[#F0EDE8]">
        {(["single", "plot"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            id={`lac-tab-${m}`}
            aria-selected={mode === m}
            aria-controls={`lac-panel-${m}`}
            onClick={() => handleModeSwitch(m)}
            className={`relative flex-1 py-4 text-[13px] font-semibold transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
            style={{ color: mode === m ? "#D7242A" : "#9A9A9A" }}
          >
            {m === "single" ? "Single Value" : "Plot Dimensions"}
            {/* Active underline */}
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-150 motion-reduce:transition-none"
              style={{
                backgroundColor: "#D7242A",
                opacity: mode === m ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {/* ── Input panel ── */}
      <div
        role="tabpanel"
        id={`lac-panel-${mode}`}
        aria-labelledby={`lac-tab-${mode}`}
        className="p-5 md:p-8 border-b border-[#F0EDE8]"
      >
        {mode === "single" ? (
          // Single value mode
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-4">
              Enter a value
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label
                  htmlFor="lac-value"
                  className="block text-[12px] font-semibold text-[#6A6A6A] mb-1.5"
                >
                  Amount
                </label>
                <input
                  id="lac-value"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    syncUrl("single", { value: e.target.value, from: inputUnit });
                  }}
                  placeholder="e.g. 1000"
                  className={`w-full h-14 px-4 rounded-xl border border-[#E8E4DF] text-[#0F0F0F] font-semibold transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                  style={{ fontSize: "1.15rem" }}
                  aria-invalid={isNegative}
                  aria-describedby={isNegative ? "lac-single-error" : undefined}
                />
              </div>
              <div className="sm:flex-shrink-0">
                <label
                  htmlFor="lac-unit"
                  className="block text-[12px] font-semibold text-[#6A6A6A] mb-1.5"
                >
                  Unit
                </label>
                <select
                  id="lac-unit"
                  value={inputUnit}
                  onChange={(e) => {
                    const u = e.target.value as Unit;
                    setInputUnit(u);
                    syncUrl("single", { value: inputValue, from: u });
                  }}
                  className={`w-full sm:w-auto h-14 px-4 pr-10 rounded-xl border border-[#E8E4DF] bg-white text-[#0F0F0F] font-semibold cursor-pointer transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                  style={{
                    fontSize: "1rem",
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23555' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            {isNegative && (
              <p id="lac-single-error" role="alert" className="mt-2 text-[13px]" style={{ color: "#D7242A" }}>
                Please enter 0 or a positive value.
              </p>
            )}
          </>
        ) : (
          // Plot dimensions mode
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3">
              Common plot sizes
            </p>

            {/* Preset chips — min 44px touch target */}
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Common Karnataka plot sizes">
              {PLOT_PRESETS.map(({ label, l, w }) => {
                const isActive = activePreset === label;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handlePreset(l, w, label)}
                    className={`min-h-[44px] px-4 py-2 rounded-lg text-[13px] font-semibold border transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                    style={{
                      backgroundColor: isActive ? "#D7242A" : "#F8F6F3",
                      color: isActive ? "white" : "#0F0F0F",
                      borderColor: isActive ? "#D7242A" : "#E8E4DF",
                    }}
                  >
                    {label} ft
                  </button>
                );
              })}
            </div>

            {/* L × W inputs with visible labels */}
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3">
              Or enter custom dimensions
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label
                  htmlFor="lac-length"
                  className="block text-[12px] font-semibold text-[#6A6A6A] mb-1.5"
                >
                  Length (ft)
                </label>
                <input
                  id="lac-length"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={plotL}
                  onChange={(e) => {
                    setPlotL(e.target.value);
                    setActivePreset(null);
                    syncUrl("plot", { l: e.target.value, w: plotW });
                  }}
                  placeholder="e.g. 40"
                  className={`w-full h-14 px-4 rounded-xl border border-[#E8E4DF] text-[#0F0F0F] font-semibold text-center transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                  style={{ fontSize: "1.1rem" }}
                  aria-invalid={plotL !== "" && !isNaN(rawL) && rawL < 0}
                />
              </div>
              <span className="text-[#9A9A9A] font-bold text-2xl pb-3.5 select-none" aria-hidden="true">×</span>
              <div className="flex-1">
                <label
                  htmlFor="lac-width"
                  className="block text-[12px] font-semibold text-[#6A6A6A] mb-1.5"
                >
                  Width (ft)
                </label>
                <input
                  id="lac-width"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={plotW}
                  onChange={(e) => {
                    setPlotW(e.target.value);
                    setActivePreset(null);
                    syncUrl("plot", { l: plotL, w: e.target.value });
                  }}
                  placeholder="e.g. 60"
                  className={`w-full h-14 px-4 rounded-xl border border-[#E8E4DF] text-[#0F0F0F] font-semibold text-center transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                  style={{ fontSize: "1.1rem" }}
                  aria-invalid={plotW !== "" && !isNaN(rawW) && rawW < 0}
                />
              </div>
            </div>

            {/* Computed area confirmation */}
            {isValid && (
              <p className="mt-3 text-[14px] text-[#555]">
                Total area:{" "}
                <span className="font-bold text-[#0F0F0F]">{fmtInt(sqft)} sq ft</span>
              </p>
            )}
            {isNegative && (
              <p role="alert" className="mt-2 text-[13px]" style={{ color: "#D7242A" }}>
                Please enter positive values.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Results ── */}
      {/* aria-live so screen readers announce new conversion results */}
      <div className="p-5 md:p-8" aria-live="polite" aria-atomic="false">
        {!isValid ? (
          <div className="flex items-center gap-3 py-2">
            <svg width="20" height="20" fill="none" stroke="#C8C4BF" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p className="text-[#9A9A9A] text-[14px]">
              {mode === "single"
                ? "Enter a value above to see all conversions."
                : "Select a plot size or enter dimensions above."}
            </p>
          </div>
        ) : (
          <>
            {/* Result header + share */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9A9A9A]">
                {resultLabel}
              </p>
              <button
                type="button"
                onClick={handleShare}
                className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                style={{
                  color: shareLabel === "Copied!" ? "#D7242A" : "#9A9A9A",
                  borderColor: shareLabel === "Copied!" ? "#D7242A" : "#E8E4DF",
                }}
                aria-label="Copy shareable link to this conversion"
              >
                <ShareIcon />
                {shareLabel}
              </button>
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resultUnits.map((unit) => {
                const result = sqft / TO_SQFT[unit];
                const formatted = fmt(result);
                const isCopied = copied === unit;
                return (
                  <div
                    key={unit}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#F0EDE8]"
                    style={{ backgroundColor: "#F8F6F3" }}
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#9A9A9A] uppercase tracking-wide leading-none mb-1.5">
                        {unit}
                      </p>
                      {/* tabular-nums keeps digits stable width as they change */}
                      <p
                        className="font-bold text-[#0F0F0F] leading-tight tabular-nums"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {formatted}
                      </p>
                    </div>
                    {/* Copy button — 44px touch target via p-3 */}
                    <button
                      type="button"
                      onClick={() => handleCopy(unit, formatted)}
                      aria-label={isCopied ? `Copied ${formatted} ${SHORT[unit]}` : `Copy ${formatted} ${SHORT[unit]}`}
                      aria-pressed={isCopied}
                      className={`ml-3 flex-shrink-0 p-3 rounded-lg transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING}`}
                      style={{ color: isCopied ? "#D7242A" : "#9A9A9A" }}
                    >
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
