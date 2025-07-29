'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { aiTherapist, type AITherapistOutput } from '@/ai/flows/ai-therapist';
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/tts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, User, Bot, Mic, Square, Speaker } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from './audio-player';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: any;
};

export function TherapistInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, authLoading] = useAuthState(auth);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
        const q = query(
            collection(db, `therapist-history/${user.uid}/messages`),
            orderBy('timestamp', 'asc')
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            if (history.length === 0) {
                setMessages([
                    {
                        id: 'initial-message',
                        role: 'assistant',
                        content: 'Welcome. This is a safe space to talk about whatever is on your mind. How are you feeling today?',
                    },
                ]);
            } else {
                setMessages(history);
            }
        });
        return () => unsubscribe();
    } else if (!authLoading) {
        setMessages([
            {
                id: 'initial-message',
                role: 'assistant',
                content: 'Welcome. Please sign in to have your conversation history saved permanently.',
            },
        ]);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollable = scrollAreaRef.current.querySelector('div');
      if (scrollable) {
        scrollable.scrollTop = scrollable.scrollHeight;
      }
    }
  }, [messages]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition. Try using Chrome or Safari.",
        variant: "destructive",
      });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
      
      if (event.error !== 'no-speech') {
        toast({
          title: "Speech Recognition Error",
          description: `An error occurred: ${event.error}`,
          variant: "destructive",
        });
      }
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };

    recognitionRef.current.start();
  };

  const handlePlayAudio = async (text: string) => {
    setIsPlaying(true);
    try {
      const { audioDataUri } = await textToSpeech({ text });
      setAudioDataUri(audioDataUri);
    } catch (error) {
      console.error(error);
      toast({
        title: "Audio Playback Error",
        description: "Failed to generate audio for the response.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };
  
  const saveMessage = async (message: Omit<Message, 'id'>) => {
    if (user) {
      await addDoc(collection(db, `therapist-history/${user.uid}/messages`), {
        ...message,
        timestamp: serverTimestamp(),
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!user) {
        toast({
            title: "Please Sign In",
            description: "You need to be signed in to start a conversation.",
            variant: "destructive"
        });
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(userMessage);
    
    const currentInputValue = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const { response }: AITherapistOutput = await aiTherapist({ query: currentInputValue });
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      await handlePlayAudio(assistantMessage.content);
    } catch (error) {
      console.error(error);
       toast({
        title: "An error occurred",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col p-4 gap-4">
       {audioDataUri && isPlaying && (
        <AudioPlayer 
          audioDataUri={audioDataUri} 
          onEnded={() => {
            setIsPlaying(false);
            setAudioDataUri(null);
          }} 
        />
      )}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {(messages.length === 0 || (messages.length === 1 && messages[0].id === 'initial-message')) && (
             <Card className="p-6 text-center">
                <CardContent className="pt-6">
                    <Logo className="mx-auto size-12 text-primary/80" />
                    <h2 className="mt-4 text-2xl font-semibold">AI Therapist</h2>
                    <p className="mt-2 text-muted-foreground">
                        How are you feeling today?
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
                <div className="flex items-center gap-2">
                    <p className="text-sm whitespace-pre-wrap flex-1">{message.content}</p>
                    {message.role === 'assistant' && message.id !== 'initial-message' && (
                       <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handlePlayAudio(message.content)}
                          disabled={isLoading || isPlaying}
                          className="h-6 w-6"
                       >
                          <Speaker className="h-4 w-4" />
                       </Button>
                    )}
                </div>
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
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="flex-1"
            disabled={isLoading || isRecording}
          />
           <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "ghost"}
            onClick={handleToggleRecording}
            disabled={isLoading}
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
         {!user && !authLoading && (
            <p className="text-xs text-muted-foreground text-center">
                <a href="/signin" className="underline">Sign in</a> to save your conversation history.
            </p>
        )}
      </div>
    </div>
  );
}

    