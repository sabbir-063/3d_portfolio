import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// Static social-share card (1200×630) generated at build time.
// Replaces the missing /og-image.png so every share renders a real preview.
export const alt = "Mohammad Sabbir Musfique — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Embed the headshot as a data URL — Satori cannot resolve runtime URLs at
// build time, so we inline the file bytes.
const photoSrc = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public", "sabbir_musfique.png"))
  .toString("base64")}`;

// Build the 60px line grid as a full-size SVG data URI. Satori ignores tiled
// CSS backgrounds (background-size repeat), so we draw every line explicitly
// and render it as an <img>. Mirrors the site-wide `.soft-grid` pattern.
const GRID = 60;
const gridLines = [
  ...Array.from({ length: Math.floor(size.width / GRID) + 1 }, (_, i) => {
    const x = i * GRID;
    return `<line x1="${x}" y1="0" x2="${x}" y2="${size.height}" />`;
  }),
  ...Array.from({ length: Math.floor(size.height / GRID) + 1 }, (_, i) => {
    const y = i * GRID;
    return `<line x1="0" y1="${y}" x2="${size.width}" y2="${y}" />`;
  }),
].join("");
const gridSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}">` +
  `<g stroke="rgb(199,185,245)" stroke-opacity="0.08" stroke-width="1">${gridLines}</g>` +
  `</svg>`
)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f0c1c 0%, #161126 55%, #1d1533 100%)",
          color: "#ece5fc",
          fontFamily: "sans-serif",
        }}
      >
        {/* soft-grid pattern overlay — matches site-wide .soft-grid (60px lines) */}
        <img
          src={gridSrc}
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0 }}
        />

        {/* soft lavender glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(199,185,245,0.30) 0%, rgba(199,185,245,0) 70%)",
            display: "flex",
          }}
        />

        {/* top row: role + location, with avatar on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 9999,
                border: "1px solid rgba(199,185,245,0.35)",
                background: "rgba(199,185,245,0.08)",
                color: "#c7b9f5",
                fontSize: 24,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Software Engineer
            </div>
            <div
              style={{
                display: "flex",
                color: "#aea8be",
                fontSize: 24,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Dhaka, Bangladesh
            </div>
          </div>

          {/* circular headshot */}
          <img
            src={photoSrc}
            width={150}
            height={150}
            style={{
              borderRadius: 9999,
              border: "3px solid rgba(199,185,245,0.55)",
              objectFit: "cover",
            }}
          />
        </div>

        {/* name + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Mohammad Sabbir Musfique
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 36,
              color: "#aea8be",
            }}
          >
            <span style={{ color: "#c9e8ee" }}>{"// "}</span>
            <span style={{ marginLeft: 12 }}>
              Building full-stack web systems, mobile apps &amp; AI-powered solutions
            </span>
          </div>
        </div>

        {/* bottom row: stack + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["React", "Flutter", "Spring Boot", "Python"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#ece5fc",
                  fontSize: 26,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{ display: "flex", color: "#c7b9f5", fontSize: 30, fontWeight: 600 }}
          >
            sabbirmusfique.com.bd
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
