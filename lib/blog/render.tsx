import { Fragment, type ReactNode } from "react";

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "hr" };

const isBlockStarter = (line: string): boolean =>
  line.startsWith("```") ||
  line.startsWith("## ") ||
  line.startsWith("### ") ||
  line.startsWith("> ") ||
  /^[-*]\s+/.test(line) ||
  /^\d+\.\s+/.test(line) ||
  /^---+$/.test(line.trim());

function tokenize(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, code: buf.join("\n") });
      continue;
    }

    if (line.startsWith("### ")) { blocks.push({ type: "h3", text: line.slice(4) }); i++; continue; }
    if (line.startsWith("## "))  { blocks.push({ type: "h2", text: line.slice(3) }); i++; continue; }

    if (/^---+$/.test(line.trim())) { blocks.push({ type: "hr" }); i++; continue; }

    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "quote", text: buf.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStarter(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }

  return blocks;
}

function inline(text: string): ReactNode {
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;

  const patterns: { re: RegExp; render: (m: RegExpMatchArray, k: number) => ReactNode }[] = [
    {
      re: /^\[([^\]]+)\]\(([^)]+)\)/,
      render: (m, k) => {
        const external = m[2].startsWith("http");
        return (
          <a
            key={k}
            href={m[2]}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
          >
            {m[1]}
          </a>
        );
      },
    },
    {
      re: /^`([^`]+)`/,
      render: (m, k) => (
        <code key={k} className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.07] text-primary text-[0.9em] font-mono">
          {m[1]}
        </code>
      ),
    },
    {
      re: /^\*\*([^*]+)\*\*/,
      render: (m, k) => <strong key={k} className="font-semibold text-on-surface">{m[1]}</strong>,
    },
    {
      re: /^\*([^*]+)\*/,
      render: (m, k) => <em key={k} className="italic">{m[1]}</em>,
    },
  ];

  while (rest.length) {
    let matched = false;
    for (const p of patterns) {
      const m = rest.match(p.re);
      if (m) {
        out.push(p.render(m, key++));
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const next = rest.search(/[\[*`]/);
      if (next === -1) {
        out.push(<Fragment key={key++}>{rest}</Fragment>);
        break;
      }
      const cut = next === 0 ? 1 : next;
      out.push(<Fragment key={key++}>{rest.slice(0, cut)}</Fragment>);
      rest = rest.slice(cut);
    }
  }

  return out;
}

export default function MarkdownContent({ source }: { source: string }) {
  const blocks = tokenize(source);

  return (
    <div className="font-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="text-2xl md:text-[1.75rem] font-bold font-headline tracking-tight text-on-surface mt-14 mb-4 leading-snug">
                {inline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg md:text-xl font-bold font-headline tracking-tight text-on-surface mt-10 mb-3 leading-snug">
                {inline(b.text)}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-on-surface-variant leading-[1.85] my-5 text-[1rem]">
                {inline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="my-6 pl-6 space-y-2.5 list-disc marker:text-primary/60">
                {b.items.map((it, j) => (
                  <li key={j} className="text-on-surface-variant leading-[1.8] pl-1">{inline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-6 pl-6 space-y-2.5 list-decimal marker:text-primary/60">
                {b.items.map((it, j) => (
                  <li key={j} className="text-on-surface-variant leading-[1.8] pl-1">{inline(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-7 border-l-2 border-primary/40 pl-5 italic text-on-surface/85 leading-[1.8]">
                {inline(b.text)}
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} className="my-7 p-5 rounded-xl glass-panel overflow-x-auto text-[0.85rem] font-mono leading-relaxed">
                <code>{b.code}</code>
              </pre>
            );
          case "hr":
            return <hr key={i} className="my-12 border-black/[0.08] dark:border-white/[0.08]" />;
        }
      })}
    </div>
  );
}
