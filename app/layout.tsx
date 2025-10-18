import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Min Nail Salon",
  description: "Nail salon booking app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
