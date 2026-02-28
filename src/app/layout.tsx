import type { Metadata } from "next";
import { Roboto, Noto_Sans_JP, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sample Design System",
  description: "Sample Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${roboto.variable} ${notoSansJP.variable} ${notoSansMono.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
