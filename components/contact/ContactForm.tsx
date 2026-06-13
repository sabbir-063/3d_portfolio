"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Field {
  id: "name" | "email" | "message";
  label: string;
  type: string;
  textarea?: boolean;
  focusBorder: string;
  focusShadow: string;
  focusLabel: string;
}

const fields: Field[] = [
  {
    id: "name",
    label: "Your Name",
    type: "text",
    focusBorder: "focus:border-primary/50",
    focusShadow: "focus:shadow-[0_0_0_1px_rgba(199,185,245,0.15),0_0_24px_rgba(199,185,245,0.1)]",
    focusLabel: "peer-focus:text-primary",
  },
  {
    id: "email",
    label: "Your Email",
    type: "email",
    focusBorder: "focus:border-secondary/50",
    focusShadow: "focus:shadow-[0_0_0_1px_rgba(201,232,238,0.15),0_0_24px_rgba(201,232,238,0.1)]",
    focusLabel: "peer-focus:text-secondary",
  },
  {
    id: "message",
    label: "Your Message",
    type: "text",
    textarea: true,
    focusBorder: "focus:border-tertiary/50",
    focusShadow: "focus:shadow-[0_0_0_1px_rgba(244,226,255,0.15),0_0_24px_rgba(244,226,255,0.1)]",
    focusLabel: "peer-focus:text-tertiary",
  },
];

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [trap, setTrap] = useState("");          // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, _trap: trap }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-12 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">check</span>
          </div>
          <p className="text-on-surface font-bold font-headline text-lg">Message Sent!</p>
          <p className="text-on-surface-variant text-sm font-body">
            I&apos;ll get back to you soon.
          </p>
          <button
            onClick={() => { setSubmitted(false); setValues({ name: "", email: "", message: "" }); }}
            className="mt-2 text-xs text-on-surface-variant hover:text-primary transition-all font-label uppercase tracking-wider"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="_trap"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
          />

          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.filter((f) => !f.textarea).map((field) => (
              <div key={field.id} className="relative">
                <input
                  id={field.id}
                  type={field.type}
                  value={values[field.id]}
                  onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                  placeholder=" "
                  required
                  className={`peer w-full bg-black/[0.04] dark:bg-white/[0.05] backdrop-blur-sm border border-black/[0.09] dark:border-white/[0.10] rounded-xl px-4 pt-6 pb-3 text-on-surface text-sm outline-none transition-all duration-300 focus:bg-black/[0.07] dark:focus:bg-white/[0.09] ${field.focusBorder} ${field.focusShadow}`}
                />
                <label
                  htmlFor={field.id}
                  className={`absolute left-4 top-[1.05rem] text-on-surface-variant/50 text-sm transition-all duration-200 pointer-events-none
                    peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-widest peer-focus:uppercase
                    peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:tracking-widest peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-on-surface-variant/40
                    ${field.focusLabel}`}
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>

          {/* Message textarea */}
          {fields.filter((f) => f.textarea).map((field) => (
            <div key={field.id} className="relative">
              <textarea
                id={field.id}
                value={values[field.id]}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder=" "
                rows={5}
                required
                className={`peer w-full bg-black/[0.04] dark:bg-white/[0.05] backdrop-blur-sm border border-black/[0.09] dark:border-white/[0.10] rounded-xl px-4 pt-8 pb-3 text-on-surface text-sm outline-none transition-all duration-300 resize-none focus:bg-black/[0.07] dark:focus:bg-white/[0.09] ${field.focusBorder} ${field.focusShadow}`}
              />
              <label
                htmlFor={field.id}
                className={`absolute left-4 top-[1.1rem] text-on-surface-variant/50 text-sm transition-all duration-200 pointer-events-none
                  peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-widest peer-focus:uppercase
                  peer-[&:not(:placeholder-shown)]:top-2.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:tracking-widest peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:text-on-surface-variant/40
                  ${field.focusLabel}`}
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-red-400/90 text-xs font-body flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold font-headline text-sm flex items-center gap-2 text-on-primary transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:pointer-events-none backdrop-blur-xl bg-primary/80 border border-primary/40 shadow-[0_0_30px_rgba(199,185,245,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-primary/95 hover:shadow-[0_0_55px_rgba(199,185,245,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Sending…
                </>
              ) : (
                <>
                  Send Message
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
