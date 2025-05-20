
"use client";

import * as React from 'react';
import type { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendMessageToDialogflow } from '@/app/actions/dialogflow'; // Placeholder action

interface ChatboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId] = React.useState<string>(() => `session_${Math.random().toString(36).substring(7)}`);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'initial-bot-message',
          text: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy?',
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ["¿Qué es Pagómetro?", "Ayuda con tareas", "Contactar soporte"]
        }
      ]);
    }
  }, [isOpen, messages.length]);

  React.useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real app, this would call your backend which then calls Dialogflow
      const botResponseText = await sendMessageToDialogflow(textToSend, sessionId);
      
      // Simulate quick replies from Dialogflow
      let quickReplies: string[] | undefined = undefined;
      if (botResponseText.toLowerCase().includes("escalar")) {
        quickReplies = ["Contactar por WhatsApp", "Enviar Email"];
      } else if (Math.random() < 0.3) {
         quickReplies = ["Gracias", "Saber más", "Otra pregunta"];
      }


      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: quickReplies,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        text: 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 right-6 w-full max-w-sm h-[70vh] max-h-[500px] shadow-xl z-50 flex flex-col rounded-lg border bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">Asistente Virtual</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar chat">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end space-x-2",
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'bot' && <Bot className="h-6 w-6 text-muted-foreground self-start shrink-0" />}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[80%] text-sm",
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={cn(
                      "text-xs mt-1",
                      msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'
                    )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground self-start shrink-0" />}
              </div>
            ))}
             {messages[messages.length -1]?.sender === 'bot' && messages[messages.length -1].quickReplies && (
              <div className="flex flex-wrap gap-2 mt-2 justify-start">
                {messages[messages.length -1].quickReplies?.map(reply => (
                  <Button key={reply} variant="outline" size="sm" onClick={() => handleSendMessage(reply)}>
                    {reply}
                  </Button>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="flex items-center space-x-2 justify-start">
                 <Bot className="h-6 w-6 text-muted-foreground self-start" />
                <div className="p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none">
                  <p className="italic">Escribiendo...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Enviar mensaje">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chatbox;
