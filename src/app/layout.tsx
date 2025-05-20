
"use client"; // Required for useState and useEffect if Chatbox is managed here

import * as React from 'react'; // Import React
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import FloatingChatButton from '@/components/chat/FloatingChatButton';
import Chatbox from '@/components/chat/Chatbox';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata should ideally be defined statically if possible, or moved to a server component
// export const metadata: Metadata = { // Cannot be used in a client component
//   title: 'Pagometro',
//   description: 'Cumple, Cobra, Ahorra.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  // Add metadata directly to the head if this remains a client component
  React.useEffect(() => {
    document.title = "Pagómetro";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Cumple, Cobra, Ahorra.");
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = "description";
      newMeta.content = "Cumple, Cobra, Ahorra.";
      document.head.appendChild(newMeta);
    }
  }, []);


  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Toaster />
        <FloatingChatButton onClick={toggleChat} />
        <Chatbox isOpen={isChatOpen} onClose={toggleChat} />
      </body>
    </html>
  );
}
