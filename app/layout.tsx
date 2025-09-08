import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FilterToggle } from "../components/FilterToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Math Chronicles",
  description: "A timeline of mathematical ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO; // e.g., "yourname/math-chronicles"
  const owner = repo?.split("/")[0] || "lucasaschenbach";
  const name = repo?.split("/")[1] || "math-chronicles";
  return (
    <html lang="en">
      <head>
        {/* MathJax configuration for LaTeX support */}
        <script
          id="mathjax-config"
          dangerouslySetInnerHTML={{
            __html: `window.MathJax = { tex: { inlineMath: [['$', '$'], ['\\\(', '\\\)']], displayMath: [['$$','$$'], ['\\[','\\]']] }, svg: { fontCache: 'global' } };`,
          }}
        />
        <script
          id="mathjax"
          defer
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        />
        {/* GitHub Star (iframe embed) */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <div className="min-h-screen flex flex-col">
          <header className="px-6 sm:px-10 py-6 flex items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">Math Chronicles</h1>
            <FilterToggle />
            <div className="flex-1" />
            <iframe
              src={`https://ghbtns.com/github-btn.html?user=${owner}&repo=${name}&type=star&count=true`}
              title="GitHub"
              width="80"
              height="20"
            />
          </header>
          <main className="flex-1 px-6 sm:px-10">{children}</main>
          <footer className="px-6 sm:px-10 py-6 text-xs text-neutral-400 flex gap-6">
            <span>Contribute</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
