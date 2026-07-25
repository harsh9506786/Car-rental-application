"use client";

import AIButton from "./AIButton";
import AIChatModal from "./AIChatModal";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AIAssistant({
  open,
  setOpen,
}: Props) {
  return (
    <>
      <AIButton onClick={() => setOpen(true)} />

      <AIChatModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}