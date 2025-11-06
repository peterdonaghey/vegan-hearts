import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const quicksand = Quicksand({ subsets: ["latin"], variable: '--font-quicksand', weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "VeganHearts - Awakening Compassion",
  description: "We are so happy you found this space where everyone is Loved as a living being and precious soul. Awakening and supporting compassionate living through vegan education, community, and advocacy.",
  keywords: ["vegan", "veganism", "animal rights", "plant-based", "education", "community", "compassion", "animal sanctuary"],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${quicksand.variable}`} suppressHydrationWarning>{children}</body>
    </html>
  );
}

