import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "../styles/globals.css";
import { Footer } from "@/components/ui/Footer";
import { ClientSideProvider } from "@/components/providers/ClientSideProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata = {
  title: "MidnightCommerce - God Mode 2040",
  description: "Experimental World-Class Digital Showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-white/20">
        {/* Ambient CSS background — no JS, renders instantly */}
        <div className="fluid-mercury-bg" />

        <ClientSideProvider>
          <main className="flex-grow z-10 relative">
            {children}
          </main>
        </ClientSideProvider>

        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{ className: "glass-2 text-white border-white/10" }}
        />
      </body>
    </html>
  );
}
