import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarketLink — Know what's at the market before you get there",
  description:
    "Discover local farmers, browse this week's fresh stock and reserve it for market pickup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={manrope.variable + " " + dmSerifDisplay.variable}
    >
      <body>{children}</body>
    </html>
  );
}
