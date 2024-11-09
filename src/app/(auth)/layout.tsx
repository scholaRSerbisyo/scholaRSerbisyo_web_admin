import type { Metadata } from "next";
import "../globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import SideProfileFrame from "@/components/Static/SideProfile";

export const metadata: Metadata = {
  title: "scholaRSerbisyo - SignIn",
  description: "Sign In"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuth = cookies().get('isSign')?.value;
  return (
    <div>
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
    </div>
  );
}
