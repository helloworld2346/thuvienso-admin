import { FiMinus, FiPlus } from "react-icons/fi";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  invalid?: boolean;
  "aria-label"?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  invalid = false,
  "aria-label": ariaLabel,
}: NumberStepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const dec = () =>
    onChange(clamp((Number.isFinite(value) ? value : min) - step));
  const inc = () =>
    onChange(clamp((Number.isFinite(value) ? value : min) + step));

  const btn =
    "flex h-9 w-9 shrink-0 items-center justify-center text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:text-gray-400";

  return (
    <div
      className={`flex items-center overflow-hidden rounded-lg border transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary dark:bg-surface-3 ${
        invalid
          ? "border-red-500 dark:border-red-400"
          : "border-gray-300 dark:border-app-border"
      }`}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Giảm"
        className={btn}
      >
        <FiMinus size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const n = e.target.valueAsNumber;
          onChange(Number.isNaN(n) ? min : clamp(n));
        }}
        className="w-full min-w-0 border-x border-gray-300 bg-transparent px-2 py-2 text-center text-sm text-gray-900 outline-none [appearance:textfield] dark:border-app-border dark:text-gray-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Tăng"
        className={btn}
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
}
