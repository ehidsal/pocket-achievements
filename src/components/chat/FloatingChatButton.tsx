
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      size="icon"
      aria-label="Abrir chat de ayuda"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};

export default FloatingChatButton;
