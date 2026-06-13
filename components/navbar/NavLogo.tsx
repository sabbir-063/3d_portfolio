import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href="/#Home" className="flex items-center group cursor-pointer">
      <svg
        className="w-10 h-10"
        style={{ filter: "drop-shadow(0 0 8px rgb(var(--color-primary) / 0.45))" }}
        viewBox="0 0 40 40"
        aria-label="Mohammad Sabbir Musfique"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "rgb(var(--color-primary))" }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--color-secondary))" }} />
          </linearGradient>
        </defs>
        <path
          d="M25.5 14.5C23.5 11.8 19 11.3 16.5 13.2C14.2 15 15 17.8 18 19C20.5 20 24 20.7 25.5 22.8C27.2 25.2 25 28.4 21.5 28.9C18.5 29.3 15 28.3 13.5 25.8"
          fill="none"
          stroke="url(#logoGrad)"
          strokeLinecap="round"
          strokeWidth="2.6"
          transform="translate(3.2,0) skewX(-10)"
        />
        <path
          d="M12 34C10 34 8 32 8 30C8 28 10 26 12 26C14 26 16 28 16 30"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="20" fill="none" r="18" stroke="white" strokeOpacity="0.05" />
      </svg>
    </Link>
  );
}
