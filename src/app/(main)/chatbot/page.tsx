import { ChatbotInterface } from '@/components/chatbot-interface';

export default function ChatbotPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b p-4 md:p-6">
        <h1 className="text-2xl font-bold">AI Health Chatbot</h1>
        <p className="text-muted-foreground">
          Ask any health-related questions. Please note, this is for informational purposes and not a substitute for professional medical advice.
        </p>
      </header>
      <ChatbotInterface />
    </div>
  );
}
