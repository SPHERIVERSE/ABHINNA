import type { Metadata } from "next";
import { Inter, Cinzel_Decorative, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// 🏛️ The "ABHINNA" Title Font (Academic/Prestige look)
const cinzel = Cinzel_Decorative({ 
  weight: ["400", "700", "900"], 
  subsets: ["latin"],
  variable: "--font-cinzel"
});

// ✍️ The Motto Font (Script)
const greatVibes = Great_Vibes({ 
  weight: ["400"], 
  subsets: ["latin"],
  variable: "--font-great-vibes"
});

export const metadata: Metadata = {
  title: "Abhinna Institute | Art & Academic",
  description: "A destination of Art & Academic Excellence in Guwahati.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${cinzel.variable} ${greatVibes.variable}`}
      // 🟢 Add this to prevent extension-injected attributes from breaking hydration
      suppressHydrationWarning
    >
      <body className="font-sans bg-gray-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
