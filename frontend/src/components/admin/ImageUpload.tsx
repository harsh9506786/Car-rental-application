"use client";

import Image from "next/image";

interface Props {
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ preview, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-300">Car Image</label>

      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-[#0B1120]
          p-3
          text-white
        "
      />

      {preview && (
        <div className="relative h-72 w-full overflow-hidden rounded-xl border border-slate-700">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
