import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pagometro',
  description: 'Cumple, Cobra, Ahorra.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
<body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
