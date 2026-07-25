interface Props {
  text: string;
  isUser: boolean;
}

export default function AIMessage({
  text,
  isUser,
}: Props) {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-orange-500 text-white"
            : "bg-[#1A2332] text-gray-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
}