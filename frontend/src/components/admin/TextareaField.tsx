interface Props {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextareaField({
  label,
  name,
  placeholder,
  rows = 5,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          resize-none
          rounded-xl
          border
          border-slate-700
          bg-[#0B1120]
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-orange-500
        "
      />
    </div>
  );
}
