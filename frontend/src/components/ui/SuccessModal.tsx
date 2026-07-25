"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface Props {
  open: boolean;
  type: "success" | "warning" | "error";
  title: string;
  message: string;
}

export default function SuccessModal({ open, type, title, message }: Props) {
  const config: Record<
    Props["type"],
    {
      icon: any;
      iconColor: string;
      bg: string;
      ring: string;
    }
  > = {
    success: {
      icon: CheckCircle2,
      iconColor: "text-green-400",
      bg: "bg-green-500/15",
      ring: "shadow-[0_0_50px_rgba(34,197,94,.35)]",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-orange-400",
      bg: "bg-orange-500/15",
      ring: "shadow-[0_0_50px_rgba(249,115,22,.35)]",
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-400",
      bg: "bg-red-500/15",
      ring: "shadow-[0_0_50px_rgba(239,68,68,.35)]",
    },
  };

  const CurrentConfig = config[type] || config.success;
  const CurrentIcon = CurrentConfig.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              y: 30,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
fixed
left-1/2
top-1/2
z-[9999]
w-[90%]
max-w-md
-translate-x-1/2
-translate-y-1/2
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#08111F]
p-8
text-center
shadow-[0_20px_80px_rgba(0,0,0,.55)]
"
          >
            {/* Glow */}

            <div
              className="
absolute
left-1/2
top-0
h-40
w-40
-translate-x-1/2
rounded-full
bg-orange-500/10
blur-[80px]
"
            />

            {/* Icon */}

            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 180,
              }}
              className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${CurrentConfig.bg} ${CurrentConfig.ring}`}
            >
              <CurrentIcon size={65} className={CurrentConfig.iconColor} />
            </motion.div>

            {/* Title */}

            <h2 className="text-3xl font-bold text-white">{title}</h2>

            {/* Message */}

            <p className="mt-4 leading-7 text-slate-400">{message}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
