import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NagarSetu — civic grievance platform",
  description: "Report civic problems and follow them until they are fixed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
