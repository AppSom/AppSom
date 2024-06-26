import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/lib/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReduxProvider from "@/redux/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppSom",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`${inter.className} text-black`}>
      {/* <ReduxProvider> */}
      <NextAuthProvider session={session}>
      {children}
      </NextAuthProvider>
      {/* </ReduxProvider> */}
      </body>
    </html>
  );
}
