import SideNav from "@/components/SideNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started | RetroUI",
};

export default function ComponentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="max-lg:px-4">
        <div className="flex lg:gap-20 items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0 sticky top-28 self-start">
            <SideNav />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
