'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from './ui/input';
import { submitChatMessage } from '@/app/actions';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await submitChatMessage({ messages: newMessages });
      const botMessage: Message = { role: 'model', content: response };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'model',
        content: "Sorry, I'm having a little trouble connecting. Please try again in a moment.",
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // bit of a hack to scroll to the bottom
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if(isOpen && messages.length === 0) {
        setIsLoading(true);
        const firstMessages: Message[] = [{
            role: 'model',
            content: "Hi there! I'm Inio-Bot, an AI assistant. Feel free to ask me anything about Inioluwa's work, skills, or experience. How can I help you today?"
        }];
        setTimeout(() => {
            setMessages(firstMessages);
            setIsLoading(false);
        }, 1000)
    }
  }, [isOpen, messages.length]);

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-2xl"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Chat"
      >
        <MessageSquare size={28} />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Say Hello to Inio-Bot!</SheetTitle>
            <SheetDescription>
              This AI assistant can answer questions about my work and experience.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : ''
                    )}
                  >
                    {message.role === 'model' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-lg max-w-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-lg bg-secondary">
                            <Loader2 className="animate-spin" />
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <SheetFooter>
            <form onSubmit={handleSendMessage} className="w-full flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a project..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
