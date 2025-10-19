
import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title:"Min Nail Studio", description:"จองคิวทำเล็บออนไลน์" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="th"><body>{children}</body></html>
}
