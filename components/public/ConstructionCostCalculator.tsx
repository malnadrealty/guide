"use client";
import { useState, useCallback, useEffect, useRef } from "react";

// Example rates — clearly indicative, not quoted market rates
const QUALITY_OPTIONS = [
  { label: "Basic", exampleRate: 1500, desc: "Simple finishes, standard materials" },
  { label: "Standard", exampleRate: 2000, desc: "Mid-range finishes and quality" },
  { label: "Premium", exampleRate: 3000, desc: "High-quality finishes, better materials" },
] as const;

type Quality = (typeof QUALITY_OPTIONS)[number]["label"];

// ₹ in Indian number format: 3000000 → ₹30,00,000
function fmtINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function fmtArea(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function fmtRate(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7242A] focus-visible:ring-offset-1";

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

const TAP = { WebkitTapHighlightColor: "transparent", touchAction: "manipulation" } as const;

export function ConstructionCostCalculator() {
  const [area, setArea] = useState("");
  const [rate, setRate] = useState("");
  const [activeQuality, setActiveQuality] = useState<Quality | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!">("Share");
  const initialized = useRef(false);

  // Restore state from URL on mount (enables shareable links)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const p = new URLSearchParams(window.location.search);
      const a = p.get("area") ?? "";
      const r = p.get("rate") ?? "";
      if (a) setArea(a);
      if (r) {
        setRate(r);
        const rNum = parseFloat(r);
        const match = QUALITY_OPTIONS.find((q) => q.exampleRate === rNum);
        if (match) setActiveQuality(match.label);
      }
    } catch { /* ignore */ }
  }, []);

  const syncUrl = useCallback((a: string, r: string) => {
    try {
      const url = new URL(window.location.href);
      if (a) url.searchParams.set("area", a);
      else url.searchParams.delete("area");
      if (r) url.searchParams.set("rate", r);
      else url.searchParams.delete("rate");
      window.history.replaceState({}, "", url.toString());
    } catch { /* ignore */ }
  }, []);

  // Derived
  const areaNum = parseFloat(area);
  const rateNum = parseFloat(rate);
  const areaNegative = area !== "" && !isNaN(areaNum) && areaNum < 0;
  const rateNegative = rate !== "" && !isNaN(rateNum) && rateNum < 0;
  const isValid =
    area !== "" && rate !== "" &&
    !isNaN(areaNum) && !isNaN(rateNum) &&
    areaNum > 0 && rateNum > 0;
  const total = isValid ? areaNum * rateNum : NaN;

  const handleAreaChange = (v: string) => {
    setArea(v);
    syncUrl(v, rate);
  };

  const handleRateChange = (v: string) => {
    setRate(v);
    // Deselect preset when user types a custom value
    const rNum = parseFloat(v);
    const match = QUALITY_OPTIONS.find((q) => q.exampleRate === rNum);
    setActiveQuality(match ? match.label : null);
    syncUrl(area, v);
  };

  const handleQualityPreset = (q: (typeof QUALITY_OPTIONS)[number]) => {
    setRate(String(q.exampleRate));
    setActiveQuality(q.label);
    syncUrl(area, String(q.exampleRate));
  };

  const handleCopyResult = useCallback(async () => {
    if (!isValid) return;
    try {
      await navigator.clipboard.writeText(fmtINR(total));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }, [isValid, total]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Copied!");
      setTimeout(() => setShareLabel("Share"), 2000);
    } catch { /* ignore */ }
  }, []);

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
    >
      {/* ── Inputs ── */}
      <div className="p-5 md:p-8 border-b border-[#F0EDE8]">

        {/* Area */}
        <div className="mb-7">
          <label
            htmlFor="ccc-area"
            className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3"
          >
            Built-up area
          </label>
          <div className="flex items-center gap-3">
            <input
              id="ccc-area"
              type="number"
              inputMode="decimal"
              min="0"
              value={area}
              onChange={(e) => handleAreaChange(e.target.value)}
              placeholder="e.g. 1500"
              className={`flex-1 min-w-0 h-14 px-4 rounded-xl border text-[#0F0F0F] font-semibold transition-colors duration-150 motion-reduce:transition-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${FOCUS_RING}`}
              style={{
                fontSize: "1.15rem",
                borderColor: areaNegative ? "#D7242A" : "#E8E4DF",
                ...TAP,
              }}
              aria-invalid={areaNegative}
              aria-describedby={areaNegative ? "ccc-area-error" : "ccc-area-hint"}
            />
            <span className="text-[#6A6A6A] font-semibold text-[15px] flex-shrink-0 select-none">sq ft</span>
          </div>
          {areaNegative ? (
            <p id="ccc-area-error" role="alert" className="mt-2 text-[13px]" style={{ color: "#D7242A" }}>
              Please enter a positive area value.
            </p>
          ) : (
            <p id="ccc-area-hint" className="mt-2 text-[12px] text-[#9A9A9A]">
              Enter the total floor area you plan to build.
            </p>
          )}
        </div>

        {/* Rate */}
        <div>
          <label
            htmlFor="ccc-rate"
            className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3"
          >
            Construction rate
          </label>

          {/* Example quality presets */}
          <div className="mb-4">
            <p className="text-[11px] font-medium text-[#9A9A9A] mb-2.5">
              Example rates — select one or enter your contractor&apos;s quoted rate below
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Example construction rates by finish quality">
              {QUALITY_OPTIONS.map((q) => {
                const isActive = activeQuality === q.label;
                return (
                  <button
                    key={q.label}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${q.label} — example rate ₹${q.exampleRate.toLocaleString("en-IN")} per square foot`}
                    onClick={() => handleQualityPreset(q)}
                    className={`min-h-[44px] px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors duration-150 motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100 ${FOCUS_RING}`}
                    style={{
                      backgroundColor: isActive ? "#D7242A" : "#F8F6F3",
                      color: isActive ? "white" : "#0F0F0F",
                      borderColor: isActive ? "#D7242A" : "#E8E4DF",
                      ...TAP,
                    }}
                  >
                    {q.label}
                    <span
                      className="ml-1.5 text-[11px] font-normal"
                      style={{ color: isActive ? "rgba(255,255,255,0.75)" : "#9A9A9A" }}
                    >
                      ₹{q.exampleRate.toLocaleString("en-IN")}/sqft
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rate input */}
          <div className="flex items-center gap-2">
            <span className="text-[#0F0F0F] font-bold text-[1.2rem] flex-shrink-0 select-none" aria-hidden="true">₹</span>
            <input
              id="ccc-rate"
              type="number"
              inputMode="decimal"
              min="0"
              value={rate}
              onChange={(e) => handleRateChange(e.target.value)}
              placeholder="e.g. 2000"
              className={`flex-1 min-w-0 h-14 px-4 rounded-xl border text-[#0F0F0F] font-semibold transition-colors duration-150 motion-reduce:transition-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${FOCUS_RING}`}
              style={{
                fontSize: "1.15rem",
                borderColor: rateNegative ? "#D7242A" : "#E8E4DF",
                ...TAP,
              }}
              aria-invalid={rateNegative}
              aria-describedby={rateNegative ? "ccc-rate-error" : "ccc-rate-hint"}
            />
            <span className="text-[#6A6A6A] font-semibold text-[13px] flex-shrink-0 select-none">per sq ft</span>
          </div>
          {rateNegative ? (
            <p id="ccc-rate-error" role="alert" className="mt-2 text-[13px]" style={{ color: "#D7242A" }}>
              Please enter a positive rate.
            </p>
          ) : (
            <p id="ccc-rate-hint" className="mt-2 text-[12px] text-[#9A9A9A]">
              Use your contractor&apos;s quoted rate for an accurate estimate.
            </p>
          )}
        </div>
      </div>

      {/* ── Result ── */}
      {/* Hidden live announcement — only the sentence changes, not the whole layout */}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isValid
          ? `Estimated construction cost: ${fmtINR(total)} for ${fmtArea(areaNum)} square feet at ${fmtRate(rateNum)} per square foot.`
          : ""}
      </span>
      <div className="p-5 md:p-8">
        {!isValid ? (
          <div className="flex items-center gap-3 py-2">
            <svg width="20" height="20" fill="none" stroke="#C8C4BF" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p className="text-[#9A9A9A] text-[14px]">
              Enter your built-up area and construction rate above.
            </p>
          </div>
        ) : (
          <>
            {/* Primary result row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9A9A9A] mb-2">
                  Estimated construction cost
                </p>
                <p
                  className="font-extrabold text-[#0F0F0F] leading-none tabular-nums"
                  style={{ fontSize: "clamp(1.8rem, 6vw, 2.4rem)" }}
                >
                  {fmtINR(total)}
                </p>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0 mt-1">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  aria-label={copied ? "Copied" : `Copy ${fmtINR(total)}`}
                  aria-pressed={copied}
                  className={`p-3 rounded-lg border transition-colors duration-150 motion-reduce:transition-none active:opacity-70 motion-reduce:active:opacity-100 ${FOCUS_RING}`}
                  style={{
                    color: copied ? "#D7242A" : "#9A9A9A",
                    borderColor: copied ? "#D7242A" : "#E8E4DF",
                    ...TAP,
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Copy shareable link to this calculation"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[12px] font-semibold transition-colors duration-150 motion-reduce:transition-none active:opacity-70 motion-reduce:active:opacity-100 ${FOCUS_RING}`}
                  style={{
                    color: shareLabel === "Copied!" ? "#D7242A" : "#9A9A9A",
                    borderColor: shareLabel === "Copied!" ? "#D7242A" : "#E8E4DF",
                    ...TAP,
                  }}
                >
                  <ShareIcon />
                  {shareLabel}
                </button>
              </div>
            </div>

            {/* Transparent breakdown */}
            <div
              className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 px-4 rounded-xl mb-5 text-[14px]"
              style={{ backgroundColor: "#F8F6F3" }}
              aria-label="Calculation breakdown"
            >
              <span className="font-semibold text-[#0F0F0F] tabular-nums">{fmtArea(areaNum)} sq ft</span>
              <span className="text-[#9A9A9A]">×</span>
              <span className="font-semibold text-[#0F0F0F] tabular-nums">{fmtRate(rateNum)}/sq ft</span>
              <span className="text-[#9A9A9A]">=</span>
              <span className="font-bold tabular-nums" style={{ color: "#D7242A" }}>{fmtINR(total)}</span>
            </div>

            {/* Disclaimer */}
            <p className="text-[12px] text-[#9A9A9A] leading-relaxed">
              This is an indicative estimate based on the area and rate you entered. Actual construction costs may vary depending on design, materials, labour, site conditions, and other factors. Always get a detailed quote from your contractor before finalising your budget.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
