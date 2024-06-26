'use client'
import Sidebar from "@/components/ControlSystem/sideBar";
import { ThemeProvider } from "@/components/ControlSystem/themeSet";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="text-black">
    <ThemeProvider>
        <Sidebar/>
        {children}
    </ThemeProvider>
    </div>
  );
}