'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Volume2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatbotResponse } from '@/ai/flows/chatbot';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { SealOfMaharashtra } from '../icons';

interface Message {
  role: 'user' | 'model';
  text: string;
  audio?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handlePlayAudio = (audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Reformat messages for the AI flow
      const history = messages.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.text }],
      }));

      const response = await getChatbotResponse(history, input);
      const botMessage: Message = { role: 'model', text: response.text, audio: response.audio };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        role: 'model',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          text: 'Hello! I am the CivisInsights AI assistant. How can I help you today?',
        },
      ]);
    }
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleOpen}
          size="icon"
          className="rounded-full h-16 w-16 shadow-lg"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-full max-w-sm shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Assistant</CardTitle>
            <SealOfMaharashtra className="size-8 text-primary" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    )}
                  >
                    <Avatar
                      className={cn(
                        'border-2',
                        message.role === 'user'
                          ? 'border-primary'
                          : 'border-muted'
                      )}
                    >
                      <AvatarFallback>
                        {message.role === 'user' ? (
                          <User className="size-5" />
                        ) : (
                          <Bot className="size-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div
                        className={cn(
                            'rounded-lg px-3 py-2 text-sm max-w-[80%]',
                            message.role === 'user'
                            ? 'bg-primary text-primary-foreground float-right'
                            : 'bg-muted'
                        )}
                        >
                        {message.text}
                        </div>
                        {message.role === 'model' && message.audio && (
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePlayAudio(message.audio!)}>
                                <Play className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="border-2 border-muted">
                      <AvatarFallback>
                        <Bot className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
