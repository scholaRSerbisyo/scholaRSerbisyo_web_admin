import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import SideProfileFrame from "@/components/Static/SideProfile";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "scholaRSerbisyo",
  description: "Event Management for Scholars"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = cookies().get('isSign')?.value;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-dark-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {
            !isAuth?
            <>
              <main>
                {children}
              </main>
            </>
            :
            <>
              <SideProfileFrame children={children} />
            </>
          }
        </ThemeProvider>
      </body>
    </html>
  );
}
