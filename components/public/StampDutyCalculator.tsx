"use client";
import { useState, useCallback, useEffect, useRef, useId } from "react";

// ─── Rate Configuration ────────────────────────────────────────────────────
// All rates sourced from publicly available information.
// Stamp duty slabs: Karnataka Stamp Act, 1957.
// Registration fee: 2% effective 31 August 2025 (revised from 1%).
// Cess: 10% of stamp duty — applies uniformly.
// Surcharge (2% BBMP / 3% rural) varies by property location and is noted
// in the disclaimer but not included here to avoid jurisdiction errors.
// Rates verified September 2026 from multiple corroborating sources.
const RATES = {
  stampDutySlabs: [
    { maxValue: 2_000_000, rate: 0.02, label: "2%" },  // up to ₹20 lakh
    { maxValue: 4_500_000, rate: 0.03, label: "3%" },  // ₹20 lakh – ₹45 lakh
    { maxValue: Infinity,  rate: 0.05, label: "5%" },  // above ₹45 lakh
  ],
  cess: 0.10,        // 10% of stamp duty amount
  registration: 0.02, // 2% of property value (from 31 Aug 2025)
  verifiedDate: "September 2026",
  registrationRevisionDate: "31 August 2025",
};

function getStampDutySlab(value: number) {
  return RATES.stampDutySlabs.find((s) => value <= s.maxValue)!;
}

function calculate(value: number) {
  const slab      = getStampDutySlab(value);
  const stampDuty = value * slab.rate;
  const cess      = stampDuty * RATES.cess;
  const regFee    = value * RATES.registration;
  const govtTotal = stampDuty + cess + regFee;
  const totalCost = value + govtTotal;
  return { slab, stampDuty, cess, regFee, govtTotal, totalCost };
}

// ─── Property types ────────────────────────────────────────────────────────
const PROPERTY_TYPES = [
  { id: "residential", label: "Residential Property" },
  { id: "commercial",  label: "Commercial Property" },
  { id: "agricultural",label: "Agricultural Land" },
  { id: "site",        label: "Site / Plot" },
] as const;

type PropertyTypeId = (typeof PROPERTY_TYPES)[number]["id"];

// ─── Formatting helpers ────────────────────────────────────────────────────
function fmtINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function pct(rate: number): string {
  return (rate * 100).toFixed(0) + "%";
}

// ─── Shared UI constants (same as CCC) ────────────────────────────────────
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7242A] focus-visible:ring-offset-1";
const TAP = { WebkitTapHighlightColor: "transparent", touchAction: "manipulation" } as const;

// ─── Icons ─────────────────────────────────────────────────────────────────
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

// ─── Result row ────────────────────────────────────────────────────────────
function ResultRow({
  label, sub, amount, highlight = false,
}: { label: string; sub?: string; amount: number; highlight?: boolean }) {
  return (
    <div
      role="listitem"
      className={`flex items-start justify-between gap-4 py-3 ${highlight ? "border-t border-[#E8E4DF] mt-1 pt-4" : ""}`}
    >
      <div className="min-w-0">
        <p
          className={`text-[14px] leading-snug ${highlight ? "font-bold text-[#0F0F0F]" : "font-medium text-[#555]"}`}
        >
          {label}
        </p>
        {sub && <p className="text-[12px] text-[#9A9A9A] mt-0.5">{sub}</p>}
      </div>
      <p
        className={`tabular-nums flex-shrink-0 text-right leading-snug ${
          highlight ? "font-bold text-[#0F0F0F] text-[16px]" : "font-semibold text-[#0F0F0F] text-[14px]"
        }`}
      >
        {fmtINR(amount)}
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function StampDutyCalculator() {
  const [value, setValue]       = useState("");
  const [propType, setPropType] = useState<PropertyTypeId>("residential");
  const [copied, setCopied]     = useState(false);
  const [shareLabel, setShareLabel] = useState<"Share" | "Copied!">("Share");
  const initialized = useRef(false);
  const chipGroupId = useId();

  // Restore URL state on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const p = new URLSearchParams(window.location.search);
      const v = p.get("value") ?? "";
      const t = p.get("type") as PropertyTypeId | null;
      if (v) setValue(v);
      if (t && PROPERTY_TYPES.some((pt) => pt.id === t)) setPropType(t);
    } catch { /* ignore */ }
  }, []);

  const syncUrl = useCallback((v: string, t: PropertyTypeId) => {
    try {
      const url = new URL(window.location.href);
      if (v) url.searchParams.set("value", v);
      else url.searchParams.delete("value");
      url.searchParams.set("type", t);
      window.history.replaceState({}, "", url.toString());
    } catch { /* ignore */ }
  }, []);

  const handleValueChange = (v: string) => {
    setValue(v);
    syncUrl(v, propType);
  };

  const handleTypeChange = (t: PropertyTypeId) => {
    setPropType(t);
    syncUrl(value, t);
  };

  // Arrow-key navigation within property type chip group (roving focus)
  const handleChipKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
                : e.key === "ArrowLeft"  || e.key === "ArrowUp"   ? -1
                : 0;
      if (!dir) return;
      e.preventDefault();
      const next = (idx + dir + PROPERTY_TYPES.length) % PROPERTY_TYPES.length;
      const nextType = PROPERTY_TYPES[next].id;
      setPropType(nextType);
      syncUrl(value, nextType);
      document.getElementById(`${chipGroupId}-${nextType}`)?.focus();
    },
    [value, chipGroupId, syncUrl],
  );

  // Derived
  const valueNum    = parseFloat(value);
  const isNeg       = value !== "" && !isNaN(valueNum) && valueNum < 0;
  const isValid     = value !== "" && !isNaN(valueNum) && valueNum > 0;
  const result      = isValid ? calculate(valueNum) : null;
  const propLabel   = PROPERTY_TYPES.find((p) => p.id === propType)!.label;

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(fmtINR(result.govtTotal));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }, [result]);

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

        {/* Property value */}
        <div className="mb-7">
          <label
            htmlFor="sdc-value"
            className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3"
          >
            Property value
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[#0F0F0F] font-bold text-[1.2rem] flex-shrink-0 select-none" aria-hidden="true">₹</span>
            <input
              id="sdc-value"
              type="number"
              inputMode="decimal"
              min="0"
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="e.g. 50,00,000"
              className={`flex-1 min-w-0 h-14 px-4 rounded-xl border text-[#0F0F0F] font-semibold transition-colors duration-150 motion-reduce:transition-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${FOCUS_RING}`}
              style={{
                fontSize: "1.15rem",
                borderColor: isNeg ? "#D7242A" : "#E8E4DF",
                ...TAP,
              }}
              aria-invalid={isNeg}
              aria-describedby={isNeg ? "sdc-value-error" : "sdc-value-hint"}
            />
          </div>
          {isNeg ? (
            <p id="sdc-value-error" role="alert" className="mt-2 text-[13px]" style={{ color: "#D7242A" }}>
              Please enter a positive property value.
            </p>
          ) : (
            <p id="sdc-value-hint" className="mt-2 text-[12px] text-[#9A9A9A]">
              Enter the agreed sale price. If guidance value is higher, actual charges will be higher.
            </p>
          )}
        </div>

        {/* Property type */}
        <div className="mb-7">
          <p className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3">
            Property type
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Property type"
          >
            {PROPERTY_TYPES.map((pt, idx) => {
              const isActive = propType === pt.id;
              return (
                <button
                  key={pt.id}
                  id={`${chipGroupId}-${pt.id}`}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTypeChange(pt.id)}
                  onKeyDown={(e) => handleChipKeyDown(e, idx)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors duration-150 motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100 ${FOCUS_RING}`}
                  style={{
                    backgroundColor: isActive ? "#D7242A" : "#F8F6F3",
                    color: isActive ? "white" : "#0F0F0F",
                    borderColor: isActive ? "#D7242A" : "#E8E4DF",
                    ...TAP,
                  }}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-[12px] text-[#9A9A9A]">
            Stamp duty rates are the same for all property types in Karnataka.
          </p>
        </div>

        {/* Transaction type — static, only Sale/Purchase supported */}
        <div>
          <p className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D7242A] mb-3">
            Transaction type
          </p>
          <div className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#D7242A] text-[13px] font-semibold" style={{ backgroundColor: "#D7242A", color: "white" }}>
            Sale / Purchase
          </div>
          <p className="mt-2.5 text-[12px] text-[#9A9A9A]">
            This calculator covers sale deed transactions only.
          </p>
        </div>
      </div>

      {/* Screen-reader live announcement */}
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {result
          ? `Estimated total government charges for ${propLabel}: ${fmtINR(result.govtTotal)}. Total purchase cost: ${fmtINR(result.totalCost)}.`
          : ""}
      </span>

      {/* ── Results ── */}
      <div className="p-5 md:p-8">
        {!isValid ? (
          <div className="flex items-center gap-3 py-2">
            <svg width="20" height="20" fill="none" stroke="#C8C4BF" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
            <p className="text-[#9A9A9A] text-[14px]">
              Enter a property value above to see the estimate.
            </p>
          </div>
        ) : (
          <>
            {/* Primary total — largest figure */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9A9A9A] mb-2">
                Estimated total purchase cost
              </p>
              <p
                className="font-extrabold text-[#0F0F0F] leading-none tabular-nums"
                style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)" }}
              >
                {fmtINR(result!.totalCost)}
              </p>
              <p className="text-[13px] text-[#9A9A9A] mt-1.5">
                Property value + estimated government charges
              </p>
            </div>

            {/* Breakdown */}
            <div role="list" className="rounded-xl border border-[#E8E4DF] px-4 mb-5" aria-label="Cost breakdown">
              <ResultRow
                label="Property value"
                amount={valueNum}
              />
              <div className="border-t border-[#F0EDE8]" />
              <ResultRow
                label="Stamp duty"
                sub={`${result!.slab.label} of property value`}
                amount={result!.stampDuty}
              />
              <ResultRow
                label="Cess"
                sub="10% of stamp duty"
                amount={result!.cess}
              />
              <ResultRow
                label="Registration fee"
                sub={`${pct(RATES.registration)} of property value`}
                amount={result!.regFee}
              />
              <ResultRow
                label="Total government charges"
                sub="Stamp duty + cess + registration"
                amount={result!.govtTotal}
                highlight
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied to clipboard" : `Copy total government charges ${fmtINR(result!.govtTotal)}`}
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

            {/* Agricultural land note */}
            {propType === "agricultural" && (
              <div
                className="flex gap-3 p-4 rounded-xl mb-4 border border-[#E8E4DF]"
                style={{ backgroundColor: "#FFF8F8" }}
                role="note"
              >
                <svg width="16" height="16" fill="none" stroke="#D7242A" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] text-[#555] leading-relaxed">
                  Under the Karnataka Land Reforms Act, agricultural land can only be purchased by persons classified as agriculturists. Verify your eligibility before proceeding.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl border border-[#E8E4DF] p-4" style={{ backgroundColor: "#F8F6F3" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A9A] mb-2">Important</p>
              <ul className="text-[12px] text-[#6A6A6A] leading-relaxed space-y-1.5 list-none">
                <li>• This is an indicative estimate, not the exact amount payable.</li>
                <li>• Charges are calculated on the <strong>higher</strong> of your entered value or the government guidance value (circle rate) for the property. If guidance value exceeds your entered price, actual charges will be higher.</li>
                <li>• An additional surcharge (typically 2% of stamp duty in BBMP/urban areas, 3% in rural areas) may apply depending on your property&apos;s location. This is not included in the estimate above.</li>
                <li>• Rates do not constitute legal or financial advice. Verify actual payable amounts at your Sub-Registrar&apos;s office or via the{" "}
                  <a href="https://kaveri.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: "#D7242A" }}>Kaveri Online Services</a> portal before completing any transaction.</li>
              </ul>
              <p className="mt-3 text-[11px] text-[#9A9A9A]">
                Stamp duty slabs: Karnataka Stamp Act, 1957. Registration fee (2%) effective {RATES.registrationRevisionDate}. Rates verified {RATES.verifiedDate}.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
