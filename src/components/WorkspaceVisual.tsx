import { motion } from "framer-motion";
import Image from "next/image";

export default function WorkspaceVisual() {
  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto relative select-none flex items-center justify-center">
      {/* Clean User Portrait Photo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-fit max-w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-[#F0E3D6] bg-white"
      >
        <Image
          src="/aditya_photo.png"
          alt="Aditya Yadav standing at the Paytm office"
          width={720}
          height={1280}
          quality={90}
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 480px"
          preload
          className="block h-auto w-auto max-h-[min(86vh,780px)] max-w-full object-contain"
        />
      </motion.div>
    </div>
  );
}
