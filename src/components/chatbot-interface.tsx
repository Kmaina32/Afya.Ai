
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { healthQueryChatbot, type HealthQueryChatbotOutput } from '@/ai/flows/health-query-chatbot';
import { imageDiagnosis, type ImageDiagnosisOutput } from '@/ai/flows/image-diagnosis';
import { textToSpeech, type TextToSpeechOutput } from '@/ai/flows/tts';
import { consultationSummarizer, type ConsultationSummarizerOutput } from '@/ai/flows/summarizer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, User, Bot, Paperclip, X, Mic, Square, Speaker, FileText, Loader2, Info, Siren } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { AudioPlayer } from './audio-player';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp?: any;
};

type AlertContent = {
    id: string;
    title: string;
    announcement: string;
}

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState<ConsultationSummarizerOutput | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeAlert, setActiveAlert] = useState<AlertContent | null>(null);
  const [user, authLoading] = useAuthState(auth);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { toast } = useToast();

   useEffect(() => {
    if (user) {
      const q = query(collection(db, "alerts"), where("isActive", "==", true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const alertDoc = querySnapshot.docs[0];
          setActiveAlert({ id: alertDoc.id, ...alertDoc.data() as Omit<AlertContent, 'id'> });
        } else {
          setActiveAlert(null);
        }
      });
  
      return () => unsubscribe();
    }
  }, [user]);

  // Fetch chat history from Firestore
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, `chatbot-history/${user.uid}/messages`),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        if (history.length === 0) {
            setMessages([
              {
                id: 'initial-message',
                role: 'assistant',
                content: 'Welcome to Afya.Ai! How can I help you today? You can also upload an image of a health concern. Your conversation will be saved.',
              },
            ]);
        } else {
            setMessages(history);
        }
      });
      return () => unsubscribe();
    } else if (!authLoading) {
      // Handle guest users
       setMessages([
          {
            id: 'initial-message',
            role: 'assistant',
            content: 'Welcome to Afya.Ai! Please sign in to have your conversation history saved permanently.',
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

  const handleSummarize = async () => {
      setIsSummarizing(true);
      try {
          const historyToSummarize = messages.filter(m => m.id !== 'initial-message').map(({ role, content }) => ({ role, content }));
          const result = await consultationSummarizer({ history: historyToSummarize });
          setSummary(result);
      } catch(error) {
          console.error(error);
          toast({
              title: "Summarization Failed",
              description: "Could not generate a summary. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsSummarizing(false);
      }
  }
  
  const saveMessage = async (message: Omit<Message, 'id'>) => {
    if (user) {
      await addDoc(collection(db, `chatbot-history/${user.uid}/messages`), {
        ...message,
        timestamp: serverTimestamp(),
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() && !imageData) return;

    if (!user) {
        toast({
            title: "Please Sign In",
            description: "You need to be signed in to start a conversation.",
            variant: "destructive"
        });
        return;
    }

    setSummary(null);

    const userMessageContent = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      image: imagePreview ?? undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(userMessage);
    
    const currentImageData = imageData;
    setInputValue('');
    handleRemoveImage();
    setIsLoading(true);

    try {
       let assistantResponse: string;
       if (currentImageData) {
        const { diagnosis } = await imageDiagnosis({ photoDataUri: currentImageData, question: userMessageContent });
        assistantResponse = diagnosis;
      } else {
        const { response } = await healthQueryChatbot({ query: userMessageContent });
        assistantResponse = response;
      }

      const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      await handlePlayAudio(assistantMessage.content);

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
       {audioDataUri && isPlaying && (
        <AudioPlayer 
          audioDataUri={audioDataUri} 
          onEnded={() => {
            setIsPlaying(false);
            setAudioDataUri(null);
          }} 
        />
      )}

      {activeAlert && (
        <Alert variant="destructive" className="animate-in fade-in-50">
            <Siren className="h-4 w-4" />
            <AlertTitle>{activeAlert.title}</AlertTitle>
            <AlertDescription>
                {activeAlert.announcement}
            </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {(messages.length === 0 || (messages.length === 1 && messages[0].id === 'initial-message')) && !imagePreview && (
             <Card className="p-6 text-center">
                <CardContent className="pt-6">
                    <Logo className="mx-auto size-12 text-primary/80" />
                    <h2 className="mt-4 text-2xl font-semibold">Welcome to Afya.Ai</h2>
                    <p className="mt-2 text-muted-foreground">
                        {user ? "How can I help you today?" : "Sign in to save your chat history."}
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
      <div className="border-t pt-4 space-y-3">
        {messages.length > 1 && !isLoading && (
          <div className="flex justify-end">
            <Dialog>
                 <DialogTrigger asChild>
                    <Button variant="secondary" onClick={handleSummarize} disabled={isSummarizing || !user}>
                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        Generate Summary
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Consultation Summary</DialogTitle>
                    </DialogHeader>
                    {summary ? (
                         <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Summary</h3>
                                <p className="text-sm text-muted-foreground">{summary.summary}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Action Plan</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {summary.actionPlan.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center p-10">
                            <p>Your summary will appear here once generated.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
          </div>
        )}
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
            placeholder={isRecording ? "Listening..." : (imageData ? "Ask a question about the image..." : "Ask a health question...")}
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
         {!user && !authLoading && (
          <p className="text-xs text-muted-foreground text-center">
            <a href="/signin" className="underline">Sign in</a> to save your conversation history.
          </p>
        )}
      </div>
    </div>
  );
}
