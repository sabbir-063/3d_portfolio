"use client";

import { useEffect, useState } from "react";

const quotes = [
  "Versioned more carefully than my life decisions.",
  "Clean architecture, questionable sleep schedule.",
  "Mostly stable in production and in life.",
  'Built properly after rejecting several "good enough" versions.',
  "Engineered with intent. Revised with doubt.",
  "Some bugs were harmed in the making of this site.",
];

export default function FooterQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote) return null;

  return <p>{quote}</p>;
}
