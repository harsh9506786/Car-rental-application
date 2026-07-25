"use client";

import { Bot } from "lucide-react";
import useScrollVisibility from "@/hooks/useScrollVisibility";



interface Props {
  onClick: () => void;
}

export default function AIButton({ onClick }: Props) {
  const scrollVisible = useScrollVisibility();
  return (
    <button
      onClick={onClick}
      className={`
fixed
right-8
z-50
flex
h-14
w-14
items-center
justify-center
cursor-pointer
rounded-full
bg-orange-500
shadow-2xl
transition-all
duration-300
hover:scale-110
hover:bg-orange-600
${scrollVisible ? "bottom-28" : "bottom-8"}
`}
    >
      <Bot size={30} className="text-white" />
    </button>
  );
}
