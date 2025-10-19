
import Image from "next/image";
import BottomNav from "@/app/components/BottomNav";
export default function LayoutWrapper({children}:{children:React.ReactNode}){
  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-white">
      <header className="app-banner">
        <div className="mx-auto flex h-36 max-w-screen-sm items-center justify-center">
          <Image src="/logo.png" alt="Min Nail Studio" width={160} height={120}/>
        </div>
      </header>
      <main className="page-pad-bottom">{children}</main>
      <BottomNav/>
    </div>
  );
}
