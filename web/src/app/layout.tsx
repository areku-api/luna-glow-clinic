import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { PreferencesProvider } from "@/components/PreferencesProvider";
import "./globals.css";

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Luna Glow · จองคิวและสกินแคร์",
  description:
    "คลินิกความงามนนทบุรี — จองคิวง่าย ซื้อสกินแคร์ใช้ต่อที่บ้าน ส่งถึงใน 2–3 วัน",
};

const bootScript = `
(function(){
  try {
    var t = localStorage.getItem('luna_theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
    var l = localStorage.getItem('luna_locale');
    if (l === 'en' || l === 'th') document.documentElement.lang = l;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${plex.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <PreferencesProvider>
          <CartProvider>{children}</CartProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
