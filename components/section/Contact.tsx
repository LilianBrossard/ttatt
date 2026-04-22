"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Copy, Check } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "djeb56@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 flex flex-col items-center gap-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <h2
          className="text-5xl font-bold mb-8 text-center"
          style={{
            fontFamily: "var(--font-dynaPuff)",
            color: "var(--foreground)",
          }}
        >
          Contactez-nous !
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-xl p-[2px] rounded-[2rem] bg-linear-to-br from-white/40 via-white/10 to-transparent shadow-2xl relative group"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-[2rem] group-hover:bg-primary/30 transition-colors duration-500"></div>
        <div className="bg-background/40 backdrop-blur-2xl rounded-[calc(2rem-2px)] p-8 md:p-12 flex flex-col items-center gap-8 border border-white/10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse"></div>
            <div className="w-24 h-24 rounded-full bg-linear-to-tr from-primary to-primary/50 flex items-center justify-center text-foreground relative z-10 shadow-inner border border-white/20">
              <Mail size={48} />
            </div>
          </div>

          <div className="text-center w-full space-y-2">
            <div className="text-sm uppercase tracking-[0.2em] text-foreground font-semibold">
              Adresse E-mail
            </div>
            <a
              href={`mailto:${email}`}
              className="inline-block text-3xl md:text-5xl font-bold break-all text-foreground hover:text-primary transition-all duration-300 hover:scale-105"
            >
              {email}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-foreground font-semibold transition-all duration-300 active:scale-95 border border-white/10 hover:border-white/30 group/btn"
            >
              {copied ? (
                <>
                  <Check size={22} className="text-green-400" />
                  <span className="text-foreground">Copié !</span>
                </>
              ) : (
                <>
                  <Copy
                    size={22}
                    className="group-hover/btn:scale-110 transition-transform text-foreground"
                  />
                  <span>Copier l'adresse</span>
                </>
              )}
            </button>
            <a
              href={`mailto:${email}`}
              className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white text-primary font-bold hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95 group/btn"
            >
              <Mail
                size={22}
                className="group-hover/btn:-translate-y-1 group-hover/btn:rotate-12 transition-transform"
              />
              <span>M'écrire</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
