'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { healthQueryChatbot, type HealthQueryChatbotOutput } from '@/ai/flows/health-query-chatbot';
import { imageDiagnosis, type ImageDiagnosisOutput } from '@/ai/flows/image-diagnosis';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, User, Bot, Paperclip, X } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

const CHAT_HISTORY_KEY = 'chatHistory';

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      } else {
         setMessages([
          {
            id: 'initial-message',
            role: 'assistant',
            content: 'Welcome to Afya.Ai! How can I help you today? You can also upload an image of a health concern.',
          },
        ]);
      }
    } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
        setMessages([
          {
            id: 'initial-message',
            role: 'assistant',
            content: 'Welcome to Afya.Ai! How can I help you today? You can also upload an image of a health concern.',
          },
        ]);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
    }

    if (scrollAreaRef.current) {
      const scrollable = scrollAreaRef.current.querySelector('div');
      if (scrollable) {
        scrollable.scrollTop = scrollable.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageData(dataUri);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() && !imageData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      image: imagePreview ?? undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInputValue = inputValue;
    const currentImageData = imageData;

    setInputValue('');
    handleRemoveImage();
    setIsLoading(true);

    try {
       let assistantMessage: Message;
       if (currentImageData) {
        const { diagnosis }: ImageDiagnosisOutput = await imageDiagnosis({ photoDataUri: currentImageData, question: currentInputValue });
         assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: diagnosis,
        };
      } else {
        const { response }: HealthQueryChatbotOutput = await healthQueryChatbot({ query: currentInputValue });
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
        };
      }
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
       toast({
        title: "An error occurred",
        description: "Failed to get a response from the chatbot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col p-4 gap-4">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {messages.length === 1 && messages[0].id === 'initial-message' && !imagePreview && (
             <Card className="p-6 text-center">
                <CardContent className="pt-6">
                    <Logo className="mx-auto size-12 text-primary/80" />
                    <h2 className="mt-4 text-2xl font-semibold">Welcome to Afya.Ai</h2>
                    <p className="mt-2 text-muted-foreground">
                        How can I help you today?
                    </p>
                </CardContent>
            </Card>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-prose rounded-lg p-3 space-y-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.image && (
                    <Image src={message.image} alt="User upload" width={300} height={300} className="rounded-md" />
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-muted">
                    <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t pt-4">
        {imagePreview && (
          <div className="relative w-32 h-32 mb-2">
            <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0 h-6 w-6 rounded-full bg-background/50 hover:bg-background/75"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={imageData ? "Ask a question about the image..." : "Ask a health question..."}
            className="flex-1"
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || (!inputValue.trim() && !imageData)}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
