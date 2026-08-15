interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
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
