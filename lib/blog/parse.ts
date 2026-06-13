export type Frontmatter = Record<string, string | string[] | boolean>;

export function parseFrontmatter(source: string): { meta: Frontmatter; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: source };

  const meta: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const raw = m[2].trim();

    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      meta[key] = raw.slice(1, -1);
    } else if (raw.startsWith("[") && raw.endsWith("]")) {
      meta[key] = raw
        .slice(1, -1)
        .split(",")
        .map((t) => t.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (raw === "true" || raw === "false") {
      meta[key] = raw === "true";
    } else {
      meta[key] = raw;
    }
  }

  return { meta, body: match[2] };
}
