"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-[#0B1120] py-2.5 pl-3.5 pr-3 text-left text-sm transition ${
          open
            ? "border-orange-500"
            : "border-gray-800 hover:border-gray-700"
        } ${value ? "text-white" : "text-gray-400"}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180 text-orange-400" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-800 bg-[#0d1420] p-1.5 shadow-xl shadow-black/40">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
              value === ""
                ? "bg-orange-500/10 text-orange-400"
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >
            {placeholder}
            {value === "" && <Check size={14} />}
          </button>

          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                value === opt.value
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-gray-300 hover:bg-slate-800"
              }`}
            >
              {opt.label}
              {value === opt.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}