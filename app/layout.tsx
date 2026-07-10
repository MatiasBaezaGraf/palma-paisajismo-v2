import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const palmaFont = Nunito_Sans({
  variable: "--font-palma",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Palma — Diseño de Paisajes con Sentido",
  description:
    "Palma es un estudio de paisajismo fundado en 2011 por Isabella de Sousa y Heidi Ignatov. Diseñamos jardines en todas las escalas: balcones, jardines urbanos y de campo, desarrollos residenciales, corporativos e industriales.",
  icons: {
    icon: "/palma/palma-01.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${palmaFont.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full bg-[#f9f7f4] text-[#131419]">{children}</body>
    </html>
  );
}
