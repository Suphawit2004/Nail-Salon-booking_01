import "./globals.css";
export default function RootLayout({children}:{children:React.ReactNode}){
  return (<html lang="th"><body className="body-soft">{children}</body></html>);
}
